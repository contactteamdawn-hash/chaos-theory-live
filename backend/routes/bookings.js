import express from "express";
import pool from "../db.js";

const router = express.Router();

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

    // ==========================================
    // 1. SAVE SUBMISSION TO POSTGRESQL
    // ==========================================

    const result = await pool.query(
      `INSERT INTO bookings
      (name, email, contact_number, institution_type, program_type, start_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        name,
        email,
        contact_number,
        institution_type,
        program_type,
        start_date
      ]
    );

    // ==========================================
    // 2. SEND SUBMISSION TO FORMSPREE
    // ==========================================

    let emailSent = false;

    try {
      const formspreeResponse = await fetch(
        `https://formspree.io/f/${process.env.FORMSPREE_ID}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            contact_number,
            institution_type,
            program_type,
            start_date
          })
        }
      );

      emailSent = formspreeResponse.ok;

      if (!formspreeResponse.ok) {
        console.error(
          "Formspree error:",
          await formspreeResponse.text()
        );
      }

    } catch (formspreeError) {
      console.error(
        "Formspree request failed:",
        formspreeError
      );
    }

    // ==========================================
    // 3. RESPOND TO FRONTEND
    // ==========================================

    res.json({
      success: true,
      booking: result.rows[0],
      emailSent
    });

  } catch (err) {

    console.error("Booking error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to submit booking"
    });
  }
});

export default router;