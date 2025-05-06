const Donor = require("../models/donorModel");
const Donation = require("../models/donationModel");
const BloodStock = require("../models/bloodStockModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const getCoordinates = require("../utils/coordinates");
const sendEmail = require("../utils/sendEmail");

exports.registerDonor = catchAsync(async (req, res, next) => {
  const { nationalId, name, city, email } = req.body;

  if (!nationalId) {
    return next(new AppError("National ID is required", 400));
  }

  const existing = await Donor.findOne({ nationalId });
  if (existing) {
    console.log(existing);
    // Check if the last donation was more than 3 months ago
    const Difference = new Date() - new Date(existing.lastDonationDate);
    const dateDifference = Math.floor(Difference / (1000 * 60 * 60 * 24)); // Difference in days

    if (existing.lastDonationDate && dateDifference < 90) {
      console.log("Not eligible to donate yet");
      await sendEmail(
        existing.email,
        "Donation Rejected",
        `You are not eligible to donate yet. Please wait ${
          90 - dateDifference
        } days to donate again.`
      );

      return res.status(200).json({
        status: "rejected",
        message: `You are not eligible to donate yet. Please wait ${
          90 - dateDifference
        } days.`,
        waitDays: 90 - dateDifference,
        donor: existing,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "You are eligible to donate. Redirecting to the donation page.",
      donor: existing,
    });
  }

  if (!name || !city || !email) {
    return next(new AppError("All fields are required", 400));
  }

  // Get coordinates for the city
  const coordinates = await getCoordinates(city);
  if (!coordinates) {
    return next(new AppError("Invalid city name", 400));
  }

  const donor = new Donor({
    nationalId,
    name,
    city,
    email,
    lastDonationDate: new Date().toISOString().split("T")[0],
    location: {
      coordinates: [coordinates.lon, coordinates.lat],
    },
  });

  await donor.save();
  return res.status(201).json({
    status: "success",
    data: {
      donor,
    },
    donorId: donor._id,
  });
});

exports.donateBlood = catchAsync(async (req, res, next) => {
  const { bloodType, virusTestResult, bloodBankCity } = req.body;

  if (!bloodType || !virusTestResult || !bloodBankCity) {
    return next(new AppError("All fields are required", 400));
  }

  const donorId = req.params.donorId;
  const donor = await Donor.findById(donorId);
  if (!donor) {
    return next(new AppError("Donor not found", 404));
  }

  if (virusTestResult === "Positive") {
    await sendEmail(
      donor.email,
      "Donation Rejected",
      "You are not eligible to donate due to a positive virus test result."
    );
    return next(
      new AppError("Donation rejected due to positive virus test result", 400)
    );
  }

  const donationDate = new Date().toISOString().split("T")[0];

  const expirationDate = new Date(donationDate);
  expirationDate.setDate(expirationDate.getDate() + 40); // Set expiration date to 40 days from donation date

  const coordinates = await getCoordinates(bloodBankCity);
  if (!coordinates) {
    return next(new AppError("Invalid city name", 400));
  }

  const donation = new Donation({
    donor: donorId,
    donationDate: new Date(),
    bloodType,
    virusTestResult,
    bloodBankCity,
    location: {
      coordinates: [coordinates.lon, coordinates.lat],
    },
    expirationDate,
  });

  await donation.save();

  donor.lastDonationDate = new Date().toISOString().split("T")[0];
  await donor.save();

  // Update stock
  let stock = await BloodStock.findOne({ bloodType, city: bloodBankCity });
  if (stock) {
    stock.quantity += 1;
    stock.donations.push(donation._id);
    await stock.save();
  } else {
    stock = await BloodStock.create({
      bloodType,
      city: bloodBankCity,
      location: {
        coordinates: [coordinates.lon, coordinates.lat],
      },
      quantity: 1,
      donations: [donation._id],
    });
  }

  // Send email to donor
  await sendEmail(
    donor.email,
    "Donation Confirmation",
    `Thank you for your donation! Your donation ID is ${
      donation._id
    }. It will expire on ${expirationDate.toISOString().split("T")[0]}.`
  );

  res.status(201).json({
    status: "success",
    data: {
      donation,
      stock,
    },
  });
});
