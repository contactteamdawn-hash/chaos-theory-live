import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import bookingsRoutes from "./routes/bookings.js";

dotenv.config();

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/bookings", bookingsRoutes);

/* Test route */
app.get("/", (req, res) => {
  res.send(" Server is running");
});

/* Start server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});