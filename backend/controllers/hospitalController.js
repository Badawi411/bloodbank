const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const getCoordinates = require("../utils/coordinates");

const Hospital = require("../models/hospitalRequestModel");

exports.createHospitalRequest = catchAsync(async (req, res, next) => {
  const { hospitalName, bloodType, quantity, city, patientStatus } = req.body;
  if (!hospitalName || !bloodType || !quantity || !city || !patientStatus) {
    return next(new AppError("All fields are required", 400));
  }

  const coordinates = await getCoordinates(city);
  if (!coordinates) {
    return next(new AppError("Invalid city name", 400));
  }

  const request = new Hospital({
    hospitalName,
    bloodType,
    quantity,
    city,
    location: {
      type: "Point",
      coordinates: [coordinates.lon, coordinates.lat],
    },
    patientStatus,
    requestDate: new Date().toISOString().split("T")[0],
    status: "Pending",
  });
  await request.save();

  res.status(201).json({
    status: "success",
    data: {
      request,
    },
  });
});
