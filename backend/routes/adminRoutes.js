const express = require("express");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.get("/stock", adminController.getAllBloodStock);
router.get("/hospitals-requests", adminController.getAllHospitalsRequests);
router.get("/donors", adminController.getAllDonors);
router.delete("/:donationId", adminController.deleteExpiredBloodUnits);

module.exports = router;
