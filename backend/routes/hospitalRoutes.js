const express = require("express");
const hospitalController = require("../controllers/hospitalController");

const router = express.Router();

router.post("/request", hospitalController.createHospitalRequest);

module.exports = router;
