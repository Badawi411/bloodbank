const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  donationDate: {
    type: Date,
    default: Date.now,
  },
  bloodType: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  virusTestResult: {
    type: String,
    required: true,
    enum: ["Negative", "Positive"],
  },
  bloodBankCity: {
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
  expirationDate: {
    type: Date,
    required: true,
    default: function () {
      const expirationDate = new Date(this.donationDate);
      expirationDate.setDate(expirationDate.getDate() + 40);
      return expirationDate;
    },
  },
  expired: {
    type: Boolean,
    default: false,
  },
});

donationSchema.set("toJSON", {
  transform: function (doc, ret) {
    if (ret.donationDate) {
      ret.donationDate = ret.donationDate.toISOString().split("T")[0];
    }
    if (ret.expirationDate) {
      ret.expirationDate = ret.expirationDate.toISOString().split("T")[0];
    }
    return ret;
  },
});

donationSchema.index({ location: "2dsphere" });

donationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "donor",
    select: "name email city",
  });
  next();
});

module.exports = mongoose.model("Donation", donationSchema);
