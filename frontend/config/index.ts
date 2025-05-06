// Environment variables
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Blood types
export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Cities
export const CITIES = [
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

// Patient statuses
export const PATIENT_STATUSES = ["Normal", "Urgent", "Immediate"];

// Request statuses
export const REQUEST_STATUSES = ["Pending", "Accepted"];

// Virus test results
export const VIRUS_TEST_RESULTS = ["Negative", "Positive"];
