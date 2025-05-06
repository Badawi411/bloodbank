const express = require("express");
const donorController = require("../controllers/donorController");

const router = express.Router();

router.post("/register", donorController.registerDonor);

router.post("/:donorId/donate", donorController.donateBlood);

module.exports = router;
