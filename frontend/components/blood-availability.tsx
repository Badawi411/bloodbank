"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Chip,
} from "@mui/material";
import { API_URL, BLOOD_TYPES } from "@/config";

interface BloodStock {
  _id: string;
  bloodType: string;
  quantity: number;
  city: string;
}

export default function BloodAvailability() {
  const [loading, setLoading] = useState(true);
  const [bloodStock, setBloodStock] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBloodStock = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/stock`);

        if (!response.ok) {
          throw new Error("Failed to fetch blood stock");
        }

        const data = await response.json();

        // Aggregate quantities by blood type
        const stockByType: Record<string, number> = {};

        data.data.bloodStock.forEach((stock: BloodStock) => {
          if (stockByType[stock.bloodType]) {
            stockByType[stock.bloodType] += stock.quantity;
          } else {
            stockByType[stock.bloodType] = stock.quantity;
          }
        });

        setBloodStock(stockByType);
      } catch (err) {
        console.error("Error fetching blood stock:", err);
        setError("Could not load blood availability data");
      } finally {
        setLoading(false);
      }
    };

    fetchBloodStock();
  }, []);

  const getAvailabilityStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Not Available", color: "error" };
    if (quantity < 5) return { label: "Low", color: "warning" };
    if (quantity < 10) return { label: "Moderate", color: "info" };
    return { label: "Good", color: "success" };
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Current Blood Availability
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {BLOOD_TYPES.map((type) => {
          const quantity = bloodStock[type] || 0;
          const status = getAvailabilityStatus(quantity);

          return (
            <Grid item xs={6} sm={3} key={type}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  textAlign: "center",
                  border: 1,
                  borderColor: "divider",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {type}
                </Typography>
                <Typography variant="h6" sx={{ my: 1 }}>
                  {quantity} units
                </Typography>
                <Chip
                  label={status.label}
                  color={status.color as any}
                  size="small"
                  sx={{ alignSelf: "center" }}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
