"use client";
import { useState } from "react";
import type React from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const steps = ["Donor Registration", "Donation Details"];

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const cities = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Sharm El Sheikh",
  "Luxor",
  "Aswan",
  "Hurghada",
  "Port Said",
  "Suez",
  "Mansoura",
  "Tanta",
  "Ismailia",
  "Faiyum",
  "Zagazig",
  "Damietta",
  "Qena",
  "Sohag",
  "Beni Suef",
  "Minya",
  "Asyut",
  "Damanhur",
  "Qalyubia",
  "Kafr El Sheikh",
  "Beheira",
  "Sharqia",
  "Monufia",
  "Gharbia",
  "Dakahlia",
  "Matruh",
  "Red Sea",
  "New Valley",
  "North Sinai",
  "South Sinai",
];
const virusTestResults = ["Negative", "Positive"];

export default function DonorPage() {
  const [donorExists, setDonorExists] = useState<boolean | null>(null); // null: unknown
  const [rejectedMessage, setRejectedMessage] = useState<string | null>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [donorId, setDonorId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Donor registration form state
  const [donorForm, setDonorForm] = useState({
    nationalId: "",
    name: "",
    city: "",
    email: "",
  });

  // Donation form state
  const [donationForm, setDonationForm] = useState({
    bloodType: "",
    virusTestResult: "",
    bloodBankCity: "",
  });

  const handleDonorFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDonorForm((prev) => ({ ...prev, [name]: value }));
    if (name === "nationalId") {
      setDonorExists(null); // reset
    }
  };

  const handleDonationFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDonationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRejectedMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/donors/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donorForm),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to register donor");
      }

      if (data.status === "rejected") {
        setRejectedMessage(data.message);
        setActiveStep(2); // 👈 Go to a custom "rejected" step
        return;
      }

      if (response.status === 200 && data.donor) {
        setDonorForm({
          nationalId: data.donor.nationalId,
          name: data.donor.name,
          city: data.donor.city,
          email: data.donor.email,
        });
        setDonorExists(true); // Donor exists
        setDonorId(data.donor._id); // or `data.donorId` depending on your API
        setActiveStep(1);
      } else if (response.status === 201) {
        // New donor registered
        setDonorId(data.donorId); // or `data.donor._id` depending on your API
        setActiveStep(1);
      }
    } catch (err: any) {
      // If the user needs to fill more info (name, city, email)
      if (err.message.includes("All fields are required")) {
        setDonorExists(false); // Donor doesn't exist, show extra fields
      } else {
        setError(err.message || "Something went wrong.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/donors/${donorId}/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process donation");
      }

      setSuccess(true);
      setActiveStep(2);

      // ✅ Reset donor form for a new entry after successful donation
      setDonorForm({
        nationalId: "",
        name: "",
        city: "",
        email: "",
      });
      setDonationForm({
        bloodType: "",
        virusTestResult: "",
        bloodBankCity: "",
      });
      setDonorExists(null);
      setDonorId(null);
    } catch (err: any) {
      setError(err.message || "Failed to process donation. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setDonorId(null);
    setSuccess(false);
    setError(null);
    setDonorForm({
      nationalId: "",
      name: "",
      city: "",
      email: "",
    });
    setDonationForm({
      bloodType: "",
      virusTestResult: "",
      bloodBankCity: "",
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Blood Donation
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box component="form" onSubmit={handleDonorSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="nationalId"
                    label="National ID"
                    name="nationalId"
                    value={donorForm.nationalId}
                    onChange={handleDonorFormChange}
                  />
                </Grid>
                {(donorExists === false || donorExists === true) && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        value={donorForm.name}
                        onChange={handleDonorFormChange}
                        InputProps={{ readOnly: donorExists === true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="city"
                        select
                        label="City"
                        name="city"
                        value={donorForm.city}
                        onChange={handleDonorFormChange}
                        InputProps={{ readOnly: donorExists === true }}
                      >
                        {cities.map((city) => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        value={donorForm.email}
                        onChange={handleDonorFormChange}
                        InputProps={{ readOnly: donorExists === true }}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Continue"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box component="form" onSubmit={handleDonationSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    id="bloodType"
                    select
                    label="Blood Type"
                    name="bloodType"
                    value={donationForm.bloodType}
                    onChange={handleDonationFormChange}
                  >
                    {bloodTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    id="virusTestResult"
                    select
                    label="Virus Test Result"
                    name="virusTestResult"
                    value={donationForm.virusTestResult}
                    onChange={handleDonationFormChange}
                  >
                    {virusTestResults.map((result) => (
                      <MenuItem key={result} value={result}>
                        {result}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    id="bloodBankCity"
                    select
                    label="Blood Bank City"
                    name="bloodBankCity"
                    value={donationForm.bloodBankCity}
                    onChange={handleDonationFormChange}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Submit Donation"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ textAlign: "center", py: 3 }}>
              {rejectedMessage ? (
                <>
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    {rejectedMessage}
                  </Alert>
                  <Typography variant="body1" paragraph>
                    Please come back when you're eligible. Thank you for your
                    interest!
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleReset}
                    sx={{ mt: 2 }}
                  >
                    Try Again
                  </Button>
                </>
              ) : (
                <>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Thank you for your donation! Your contribution will help
                    save lives.
                  </Alert>
                  <Typography variant="body1" paragraph>
                    Your donation has been successfully recorded. You will
                    receive a confirmation email shortly.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleReset}
                    sx={{ mt: 2 }}
                  >
                    Donate Again
                  </Button>
                </>
              )}
            </Box>
          )}
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}
