const mongoose = require("mongoose");

const bloodStockSchema = new mongoose.Schema({
  bloodType: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  donations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
    },
  ],
});

bloodStockSchema.pre("find", function (next) {
  const query = this.getQuery();
  const match = { expired: false };

  if (query.city) match.city = query.city;
  if (query.bloodType) match.bloodType = query.bloodType;

  this.populate({
    path: "donations",
    match,
    populate: {
      path: "donor",
      select: "email",
    },
    select: "donor expirationDate expired",
  });
  next();
});

const BloodStock = mongoose.model("BloodStock", bloodStockSchema);

module.exports = BloodStock;
