const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const calculateDistance = require("../utils/calculateDistance");

const Donor = require("../models/donorModel");
const BloodStock = require("../models/bloodStockModel");
const Hospital = require("../models/hospitalRequestModel");
3;
const Donation = require("../models/donationModel");

exports.getAllBloodStock = catchAsync(async (req, res, next) => {
  const bloodStock = await BloodStock.find({ quantity: { $gt: 0 } });

  if (!bloodStock) {
    return next(new AppError("No blood stock found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      bloodStock,
    },
  });
});

exports.getAllHospitalsRequests = catchAsync(async (req, res, next) => {
  const hospitals = await Hospital.find();

  if (!hospitals) {
    return next(new AppError("No hospital requests found", 404));
  }

  hospitals.sort((a, b) => {
    const requestStatusOrder = {
      Pending: 1,
      Accepted: 2,
    };
    const statusOrder = ["Immediate", "Urgent", "Normal"];

    const requestStatusComparison =
      requestStatusOrder[a.status] - requestStatusOrder[b.status];

    if (requestStatusComparison !== 0) {
      return requestStatusComparison;
    }

    return (
      statusOrder.indexOf(a.patientStatus) -
      statusOrder.indexOf(b.patientStatus)
    );
  });

  res.status(200).json({
    status: "success",
    data: {
      hospitals,
    },
  });
});

exports.getAllDonors = catchAsync(async (req, res, next) => {
  const donors = await Donor.find();

  if (!donors) {
    return next(new AppError("No donors found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      donors,
    },
  });
});

exports.processRequests = catchAsync(async (req, res, next) => {
  const hospitalRequests = await Hospital.find({
    status: "Pending",
  });

  if (!hospitalRequests) {
    return next(new AppError("No hospital requests found", 404));
  }

  if (hospitalRequests.length < 8) {
    return next(
      new AppError("The number of requests must be at least 10", 400)
    );
  }

  hospitalRequests.sort((a, b) => {
    const statusOrder = ["Immediate", "Urgent", "Normal"];
    return (
      statusOrder.indexOf(a.patientStatus) -
      statusOrder.indexOf(b.patientStatus)
    );
  });

  const bloodStock = await BloodStock.find();
  if (!bloodStock) {
    return next(new AppError("No blood stock found", 404));
  }

  const results = [];

  for (const request of hospitalRequests) {
    // Find blood stock for the requested blood type
    const stocks = bloodStock.filter(
      (stock) => stock.bloodType === request.bloodType
    );

    if (!stocks.length) {
      results.push({
        requestId: request._id,
        success: false,
        message: "Blood type not available",
      });
      continue;
    }

    // Find the closest blood stock based on distance
    let closestStock = null;
    let minDistance = Infinity;

    for (const stock of stocks) {
      const stockCoordinates = stock.location.coordinates;
      const hospitalCoordinates = request.location.coordinates;
      const distance = calculateDistance(
        hospitalCoordinates[1],
        hospitalCoordinates[0],
        stockCoordinates[1],
        stockCoordinates[0]
      );

      if (distance < minDistance && stock.quantity >= request.quantity) {
        minDistance = distance;
        closestStock = stock;
      }
    }

    if (closestStock) {
      // Deduct the requested quantity from the closest stock
      closestStock.quantity -= request.quantity;

      const donationsToRemove = closestStock.donations.slice(
        0,
        request.quantity
      );
      closestStock.donations = closestStock.donations.slice(request.quantity);

      await BloodStock.findByIdAndUpdate(closestStock._id, {
        quantity: closestStock.quantity,
        donations: closestStock.donations,
      });

      for (const donation of donationsToRemove) {
        await Donation.findByIdAndDelete(donation._id);
      }

      // Update the request status to "Accepted"
      await Hospital.findByIdAndUpdate(request._id, {
        status: "Accepted",
      });

      results.push({
        requestId: request._id,
        success: true,
        message: "Request fulfilled",
      });
    } else {
      await Hospital.findByIdAndUpdate(request._id, {
        status: "Pending",
      });

      results.push({
        requestId: request._id,
        success: false,
        message: "No nearby stock available",
      });
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      results,
    },
  });
});

exports.deleteExpiredBloodUnits = catchAsync(async (req, res, next) => {
  const donationId = req.params.donationId;
  const donation = await Donation.findById(donationId);
  if (!donation) {
    return next(new AppError("No donation found with that ID", 404));
  }
  const currentDate = new Date();
  if (new Date(donation.expirationDate) > currentDate) {
    return next(new AppError("Blood unit is not expired yet", 400));
  }
  const bloodStock = await BloodStock.find({});
  if (!bloodStock) {
    return next(new AppError("No blood stock found", 404));
  }
  // get blood stock that contains the donation
  const bloodStockWithDonation = bloodStock.filter(
    (unit) =>
      unit.donations.filter((donation) => donation._id == donationId).length > 0
  );

  // Remove expired donation from blood stock and donations and save
  for (const unit of bloodStockWithDonation) {
    console.log(unit);
    unit.donations = unit.donations.filter(
      (donation) => donation._id != donationId
    );
    unit.quantity -= 1;
    await unit.save();
  }
  // Delete the donation
  await Donation.findByIdAndDelete(donationId);

  res.status(200).json({
    status: "success",
    data: {
      message: "Expired blood unit deleted successfully",
    },
  });
});
