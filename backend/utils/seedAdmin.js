// seedAdmin.js
const mongoose = require("mongoose");
const Admin = require("../models/adminModel");

mongoose.connect("mongodb://127.0.0.1:27017/bloodbank");

const createAdmin = async () => {
  await Admin.create({
    username: "admin",
    password: "admin123", // In production, hash this
  });
  console.log("Admin created");
  mongoose.disconnect();
};

createAdmin();
