const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const calculateDistance = require("../utils/calculateDistance");

const Donor = require("../models/donorModel");
const BloodStock = require("../models/bloodStockModel");
const Hospital = require("../models/hospitalRequestModel");
3;
const Donation = require("../models/donationModel");

exports.getAllBloodStock = catchAsync(async (req, res, next) => {
  const bloodStock = await BloodStock.find({
    quantity: { $gt: 0 },
  });

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
  await Donation.findByIdAndUpdate(donationId, { expired: true });

  res.status(200).json({
    status: "success",
    data: {
      message: "Expired blood unit deleted successfully",
    },
  });
});
