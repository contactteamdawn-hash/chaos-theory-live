import express from "express";
import pool from "../db.js";

const router = express.Router();

/* CREATE booking */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      contact_number,
      institution_type,
      program_type,
      start_date
    } = req.body;

    const result = await pool.query(
      `INSERT INTO bookings 
      (name, email, contact_number, institution_type, program_type, start_date)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [name, email, contact_number, institution_type, program_type, start_date]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;