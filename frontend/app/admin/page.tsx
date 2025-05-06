"use client";
import { useState, useEffect } from "react";
import type React from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Type definitions for API responses
interface BloodStock {
  _id: string;
  bloodType: string;
  quantity: number;
  city: string;
  donations: Donation[];
}

interface Donation {
  _id: string;
  donor: {
    name: string;
    email: string;
  };
  donationDate: string;
  bloodType: string;
  expirationDate: string;
}

interface HospitalRequest {
  _id: string;
  hospitalName: string;
  bloodType: string;
  quantity: number;
  city: string;
  patientStatus: "Normal" | "Urgent" | "Immediate";
  requestDate: string;
  status: "Pending" | "Accepted";
}

interface Donor {
  _id: string;
  nationalId: string;
  name: string;
  city: string;
  email: string;
  lastDonationDate: string;
}

export default function AdminPage() {
  const [value, setValue] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Data states
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [hospitalRequests, setHospitalRequests] = useState<HospitalRequest[]>(
    []
  );
  const [donors, setDonors] = useState<Donor[]>([]);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  // Check if user is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("bloodbank_token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchData(storedToken);
    }
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchData(token);
    }
  }, [value, isLoggedIn, token]);

  const fetchData = async (authToken: string) => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = "";
      switch (value) {
        case 0:
          endpoint = `${API_BASE_URL}/admin/stock`;
          const stockResponse = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (!stockResponse.ok) throw new Error("Failed to fetch blood stock");
          const stockData = await stockResponse.json();
          setBloodStock(stockData.data.bloodStock);
          break;

        case 1:
          endpoint = `${API_BASE_URL}/admin/hospitals-requests`;
          const requestsResponse = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (!requestsResponse.ok)
            throw new Error("Failed to fetch hospital requests");
          const requestsData = await requestsResponse.json();
          setHospitalRequests(requestsData.data.hospitals);
          break;

        case 2:
          endpoint = `${API_BASE_URL}/admin/donors`;
          const donorsResponse = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (!donorsResponse.ok) throw new Error("Failed to fetch donors");
          const donorsData = await donorsResponse.json();
          setDonors(donorsData.data.donors);
          break;
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token and set logged in state
      localStorage.setItem("bloodbank_token", data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      fetchData(data.token);
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/admin/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Clear local storage and state
    localStorage.removeItem("bloodbank_token");
    setToken(null);
    setIsLoggedIn(false);
    setBloodStock([]);
    setHospitalRequests([]);
    setDonors([]);
    setLoginForm({
      username: "",
      password: "",
    });
  };

  const handleProcessRequests = async () => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/process-requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Processing failed");
      }

      setSnackbar({
        open: true,
        message: "Requests processed successfully",
        severity: "success",
      });

      // Refresh hospital requests data
      fetchData(token!);
    } catch (err: any) {
      setError(err.message || "Failed to process requests");
      setSnackbar({
        open: true,
        message: err.message || "Failed to process requests",
        severity: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteExpiredBlood = async (donationId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/${donationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Deletion failed");
      }

      setSnackbar({
        open: true,
        message: "Expired blood unit deleted successfully",
        severity: "success",
      });

      // Refresh blood stock data
      fetchData(token!);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete expired blood unit",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Accepted":
        return "success";
      case "Rejected":
        return "error";
      case "Immediate":
        return "error";
      case "Urgent":
        return "warning";
      case "Normal":
        return "info";
      default:
        return "default";
    }
  };

  const isExpired = (expirationDate: string) => {
    return new Date(expirationDate) < new Date();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Admin Dashboard
          </Typography>

          {!isLoggedIn ? (
            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
              sx={{ mt: 3 }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={loginForm.username}
                onChange={handleFormChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={handleFormChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>
            </Box>
          ) : (
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleTabChange}
                  aria-label="admin dashboard tabs"
                >
                  <Tab label="Blood Stock" />
                  <Tab label="Hospital Requests" />
                  <Tab label="Donors" />
                  <Tab label="Process Requests" />
                </Tabs>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <TabPanel value={value} index={0}>
                <Typography variant="h6" gutterBottom>
                  Blood Stock Management
                </Typography>
                {loading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table
                      sx={{ minWidth: 650 }}
                      aria-label="blood stock table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Blood Type</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>Donations</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bloodStock.length > 0 ? (
                          bloodStock.map((stock) => (
                            <TableRow key={stock._id}>
                              <TableCell>{stock.bloodType}</TableCell>
                              <TableCell>{stock.quantity}</TableCell>
                              <TableCell>{stock.city}</TableCell>
                              <TableCell>
                                <Box sx={{ maxHeight: 150, overflow: "auto" }}>
                                  {stock.donations.map((donation) => (
                                    <Box
                                      key={donation._id}
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 1,
                                        p: 1,
                                        border: 1,
                                        borderColor: isExpired(
                                          donation.expirationDate
                                        )
                                          ? "error.main"
                                          : "divider",
                                        borderRadius: 1,
                                        bgcolor: isExpired(
                                          donation.expirationDate
                                        )
                                          ? "error.light"
                                          : "background.paper",
                                      }}
                                    >
                                      <Box>
                                        <Typography variant="body2">
                                          Donor: {donation.donor.name}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          display="block"
                                        >
                                          Expires: {donation.expirationDate}
                                        </Typography>
                                      </Box>
                                      {isExpired(donation.expirationDate) && (
                                        <IconButton
                                          color="error"
                                          onClick={() =>
                                            handleDeleteExpiredBlood(
                                              donation._id
                                            )
                                          }
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      )}
                                    </Box>
                                  ))}
                                </Box>
                              </TableCell>
                              <TableCell>
                                {stock.donations.filter((d) =>
                                  isExpired(d.expirationDate)
                                ).length > 0 && (
                                  <Chip
                                    label={`${
                                      stock.donations.filter((d) =>
                                        isExpired(d.expirationDate)
                                      ).length
                                    } Expired`}
                                    color="error"
                                    size="small"
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No blood stock data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>

              <TabPanel value={value} index={1}>
                <Typography variant="h6" gutterBottom>
                  Hospital Requests
                </Typography>
                {loading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table
                      sx={{ minWidth: 650 }}
                      aria-label="hospital requests table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Hospital</TableCell>
                          <TableCell>Blood Type</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>Patient Status</TableCell>
                          <TableCell>Request Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {hospitalRequests.length > 0 ? (
                          hospitalRequests.map((request) => (
                            <TableRow key={request._id}>
                              <TableCell>{request.hospitalName}</TableCell>
                              <TableCell>{request.bloodType}</TableCell>
                              <TableCell>{request.quantity}</TableCell>
                              <TableCell>{request.city}</TableCell>
                              <TableCell>
                                <Chip
                                  label={request.patientStatus}
                                  color={
                                    getStatusColor(request.patientStatus) as any
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{request.requestDate}</TableCell>
                              <TableCell>
                                <Chip
                                  label={request.status}
                                  color={getStatusColor(request.status) as any}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              No hospital requests available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>

              <TabPanel value={value} index={2}>
                <Typography variant="h6" gutterBottom>
                  Donor Management
                </Typography>
                {loading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="donors table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>National ID</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>Last Donation</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {donors.length > 0 ? (
                          donors.map((donor) => (
                            <TableRow key={donor._id}>
                              <TableCell>{donor.name}</TableCell>
                              <TableCell>{donor.nationalId}</TableCell>
                              <TableCell>{donor.email}</TableCell>
                              <TableCell>{donor.city}</TableCell>
                              <TableCell>
                                {donor.lastDonationDate || "Never"}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No donor data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>

              <TabPanel value={value} index={3}>
                <Typography variant="h6" gutterBottom>
                  Process Requests
                </Typography>
                <Typography variant="body1" paragraph>
                  Automatically process pending hospital requests based on blood
                  availability and proximity.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleProcessRequests}
                  disabled={processing}
                  sx={{ mt: 2 }}
                >
                  {processing ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Process Pending Requests"
                  )}
                </Button>
                <Alert severity="info" sx={{ mt: 2 }}>
                  This will process all pending hospital requests and allocate
                  blood units based on availability and proximity. The system
                  requires at least 10 pending requests to process.
                </Alert>
              </TabPanel>

              <Box sx={{ mt: 3, textAlign: "right" }}>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
