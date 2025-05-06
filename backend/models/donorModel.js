const mongoose = require("mongoose");
const validator = require("validator");

const donorSchema = new mongoose.Schema({
  nationalId: { type: String, required: true, unique: true },
  name: { type: String },
  city: { type: String },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: {
      type: [Number],
    },
  },
  email: {
    type: String,

    validate: [validator.isEmail, "Invalid email address"],
    lowercase: true,
  },
  lastDonationDate: {
    type: Date,
  },
});

donorSchema.set("toJSON", {
  transform: function (doc, ret) {
    if (ret.lastDonationDate) {
      ret.lastDonationDate = ret.lastDonationDate.toISOString().split("T")[0];
    }
    return ret;
  },
});

donorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Donor", donorSchema);
