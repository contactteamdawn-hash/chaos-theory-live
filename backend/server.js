import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import bookingsRoutes from "./routes/bookings.js";
import adminAuthRoutes from "./admin/routes/auth.js";
import adminDashboardRoutes from "./admin/routes/dashboard.js";

dotenv.config();

const app = express();

/* Middleware */
app.use(cors({
  origin: "https://chaos-theory-live.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

/* Routes */
app.use("/api/bookings", bookingsRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminDashboardRoutes);

/* Test route */
app.get("/", (req, res) => {
  res.send(" Server is running");
});

/* Start server */
const PORT = process.env.PORT || 5000;

app.listen(PORT,"0.0.0.0" ,() => {
  console.log(` Server running on http://localhost:${PORT}`);
});