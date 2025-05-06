const mongoose = require("mongoose");

const hospitalRequestSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
  },
  bloodType: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
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
  patientStatus: {
    type: String,
    required: true,
    enum: ["Immediate", "Urgent", "Normal"],
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted"],
    default: "Pending",
  },
});

hospitalRequestSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.requestDate = ret.requestDate.toISOString().split("T")[0];
    return ret;
  },
});

hospitalRequestSchema.index({ location: "2dsphere" });

// Middleware to sort the hospitals before find by patient status (Immediate then urgent then normal) and then by request status (pending then accepted then rejected)

const HospitalRequest = mongoose.model(
  "HospitalRequest",
  hospitalRequestSchema
);

module.exports = HospitalRequest;
