"use client";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  Bloodtype,
  LocalHospital,
  Favorite,
  AccessTime,
  VolunteerActivism,
  People,
} from "@mui/icons-material";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import BloodTypeCard from "@/components/blood-type-card";
import StatCard from "@/components/stat-card";
import BloodAvailability from "@/components/blood-availability";

const bloodTypes = [
  {
    type: "A+",
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
  },
  {
    type: "A-",
    canDonateTo: ["A+", "A-", "AB+", "AB-"],
    canReceiveFrom: ["A-", "O-"],
  },
  {
    type: "B+",
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
  },
  {
    type: "B-",
    canDonateTo: ["B+", "B-", "AB+", "AB-"],
    canReceiveFrom: ["B-", "O-"],
  },
  {
    type: "AB+",
    canDonateTo: ["AB+"],
    canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  {
    type: "AB-",
    canDonateTo: ["AB+", "AB-"],
    canReceiveFrom: ["A-", "B-", "AB-", "O-"],
  },
  {
    type: "O+",
    canDonateTo: ["A+", "B+", "AB+", "O+"],
    canReceiveFrom: ["O+", "O-"],
  },
  {
    type: "O-",
    canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    canReceiveFrom: ["O-"],
  },
];

export default function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <HeroSection />

        {/* Stats Section */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            sx={{ mb: 6 }}
          >
            Blood Donation Impact
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Blood Donations"
                value="10,000+"
                icon={<Bloodtype color="primary" />}
                description="Total blood units collected"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Lives Saved"
                value="30,000+"
                icon={<Favorite color="error" />}
                description="Patients helped through donations"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Hospitals Served"
                value="50+"
                icon={<LocalHospital color="primary" />}
                description="Medical facilities we support"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Response Time"
                value="4 hrs"
                icon={<AccessTime color="secondary" />}
                description="Average emergency response time"
              />
            </Grid>
          </Grid>
        </Container>

        {/* About Section */}
        <Box sx={{ bgcolor: "grey.100", py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h2" gutterBottom>
                  About Our Blood Bank
                </Typography>
                <Typography variant="body1" paragraph>
                  Our blood bank management system is designed to streamline the
                  process of blood donation and distribution. We connect donors
                  with hospitals and patients in need, ensuring a reliable
                  supply of blood for medical emergencies.
                </Typography>
                <Typography variant="body1" paragraph>
                  With our advanced tracking system, we monitor blood inventory
                  levels, manage donor information, and process hospital
                  requests efficiently.
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<VolunteerActivism />}
                    href="/donor"
                  >
                    Become a Donor
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<People />}
                    href="/about"
                  >
                    Learn More
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h5" gutterBottom color="primary">
                    Why Donate Blood?
                  </Typography>
                  <Typography variant="body1" paragraph>
                    • A single donation can save up to 3 lives
                  </Typography>
                  <Typography variant="body1" paragraph>
                    • Blood cannot be manufactured – it can only come from
                    donors
                  </Typography>
                  <Typography variant="body1" paragraph>
                    • Every 2 seconds someone needs blood
                  </Typography>
                  <Typography variant="body1" paragraph>
                    • Only 37% of the population is eligible to donate blood
                  </Typography>
                  <Typography variant="body1">
                    • Blood donation is a safe, simple procedure that takes
                    about an hour
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Blood Types Section */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Blood Type Compatibility
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ mb: 6 }}>
            Understanding blood type compatibility is crucial for successful
            transfusions
          </Typography>
          <Grid container spacing={3}>
            {bloodTypes.map((bloodType) => (
              <Grid item xs={12} sm={6} md={3} key={bloodType.type}>
                <BloodTypeCard
                  type={bloodType.type}
                  canDonateTo={bloodType.canDonateTo}
                  canReceiveFrom={bloodType.canReceiveFrom}
                />
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Process Section */}
        <Box sx={{ bgcolor: "grey.100", py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              align="center"
              sx={{ mb: 6 }}
            >
              How It Works
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 2,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4">1</Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    Register as a Donor
                  </Typography>
                  <Typography variant="body1">
                    Complete a simple registration form with your personal
                    details and medical history.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 2,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4">2</Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    Donate Blood
                  </Typography>
                  <Typography variant="body1">
                    Visit a blood bank location to donate. The process takes
                    about 10-15 minutes.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 2,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4">3</Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    Save Lives
                  </Typography>
                  <Typography variant="body1">
                    Your donation is processed, tested, and distributed to
                    hospitals to help patients in need.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
