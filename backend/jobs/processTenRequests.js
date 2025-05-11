const cron = require("node-cron");

const Hospital = require("../models/hospitalRequestModel");
const BloodStock = require("../models/bloodStockModel");
const Donation = require("../models/donationModel");
const { calculateDistance } = require("../utils/calculateDistance");

// The function to execute when there are 10 or more requests
async function processRequests() {
  const Hospital = await Hospital.find({ status: "Pending" });

  if (!Hospital || hospitalRequests.length < 10) {
    console.log("Less than 10 pending requests. Skipping processing.");
    return;
  }

  hospitalRequests.sort((a, b) => {
    const statusOrder = ["Immediate", "Urgent", "Normal"];
    return (
      statusOrder.indexOf(a.patientStatus) -
      statusOrder.indexOf(b.patientStatus)
    );
  });

  const bloodStock = await BloodStock.find();
  if (!bloodStock || !bloodStock.length) {
    console.log("No blood stock found. Skipping processing.");
    return;
  }

  const results = [];

  for (const request of hospitalRequests) {
    const stocks = bloodStock.filter(
      (stock) => stock.bloodType === request.bloodType
    );

    if (!stocks.length) {
      results.push({
        requestId: request._id,
        success: false,
        message: "Blood type not available",
      });
      continue;
    }

    let closestStock = null;
    let minDistance = Infinity;

    for (const stock of stocks) {
      const stockCoordinates = stock.location.coordinates;
      const hospitalCoordinates = request.location.coordinates;
      const distance = calculateDistance(
        hospitalCoordinates[1],
        hospitalCoordinates[0],
        stockCoordinates[1],
        stockCoordinates[0]
      );

      if (distance < minDistance && stock.quantity >= request.quantity) {
        minDistance = distance;
        closestStock = stock;
      }
    }

    if (closestStock) {
      closestStock.quantity -= request.quantity;

      const donationsToRemove = closestStock.donations.slice(
        0,
        request.quantity
      );
      closestStock.donations = closestStock.donations.slice(request.quantity);

      await BloodStock.findByIdAndUpdate(closestStock._id, {
        quantity: closestStock.quantity,
        donations: closestStock.donations,
      });

      for (const donation of donationsToRemove) {
        await Donation.findByIdAndDelete(donation._id);
      }

      await Hospital.findByIdAndUpdate(request._id, {
        status: "Accepted",
      });

      results.push({
        requestId: request._id,
        success: true,
        message: "Request fulfilled",
      });
    } else {
      await Hospital.findByIdAndUpdate(request._id, {
        status: "Pending",
      });

      results.push({
        requestId: request._id,
        success: false,
        message: "No nearby stock available",
      });
    }
  }

  console.log("Hospital request processing results:", results);
}

// Cron job - runs every 2 hours  0 */2 * * *
cron.schedule("* * * * *", async () => {
  try {
    const count = await Hospital.countDocuments();
    if (count >= 10) {
      await processRequests();
    } else {
      console.log(`Only ${count} requests found. No action taken.`);
    }
  } catch (error) {
    console.error("Error during hospital requests check:", error);
  }
});
