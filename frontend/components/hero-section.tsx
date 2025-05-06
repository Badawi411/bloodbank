"use client"
import { Box, Button, Container, Typography, Grid } from "@mui/material"
import { styled } from "@mui/material/styles"
import Link from "next/link"

const HeroBox = styled(Box)(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundImage: "url(/blood-donation-bg.jpg)",
  padding: theme.spacing(8, 0),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}))

const HeroContent = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6),
    paddingRight: 0,
  },
}))

export default function HeroSection() {
  return (
    <HeroBox>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item md={6}>
            <HeroContent>
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Donate Blood, Save Lives
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Your donation can make a difference. Join our mission to ensure blood supply for those in need.
              </Typography>
              <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button variant="contained" size="large" component={Link} href="/donor">
                  Donate Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ color: "white", borderColor: "white" }}
                  component={Link}
                  href="/hospital"
                >
                  Request Blood
                </Button>
              </Box>
            </HeroContent>
          </Grid>
        </Grid>
      </Container>
    </HeroBox>
  )
}
