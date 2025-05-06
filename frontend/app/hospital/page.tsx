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
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
const patientStatuses = ["Normal", "Urgent", "Immediate"];

export default function HospitalPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [requestForm, setRequestForm] = useState({
    hospitalName: "",
    bloodType: "",
    quantity: "",
    city: "",
    patientStatus: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      setSuccess(true);
      setRequestForm({
        hospitalName: "",
        bloodType: "",
        quantity: "",
        city: "",
        patientStatus: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit request. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Hospital Blood Request
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Your blood request has been submitted successfully. We will
              process it as soon as possible.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="hospitalName"
                  label="Hospital Name"
                  name="hospitalName"
                  value={requestForm.hospitalName}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="bloodType"
                  select
                  label="Blood Type"
                  name="bloodType"
                  value={requestForm.bloodType}
                  onChange={handleFormChange}
                >
                  {bloodTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="quantity"
                  label="Quantity (Units)"
                  name="quantity"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  value={requestForm.quantity}
                  onChange={handleFormChange}
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
                  value={requestForm.city}
                  onChange={handleFormChange}
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
                  id="patientStatus"
                  select
                  label="Patient Status"
                  name="patientStatus"
                  value={requestForm.patientStatus}
                  onChange={handleFormChange}
                >
                  {patientStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
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
                  {loading ? <CircularProgress size={24} /> : "Submit Request"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}
