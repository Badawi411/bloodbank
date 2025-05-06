"use client"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import type React from "react"

import CssBaseline from "@mui/material/CssBaseline"
import { red } from "@mui/material/colors"

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#d32f2f",
    },
    secondary: {
      main: "#f50057",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
})

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
