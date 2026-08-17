import bcrypt from "bcrypt";
import pool from "./db.js";

const createAdmin = async () => {
  try {
    const username = "admin";
    const email = "admin@chaostheory.live";
    const password = "Password@123";

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `INSERT INTO admin_users
       (username, email, password_hash)
       VALUES ($1, $2, $3)`,
      [username, email, passwordHash]
    );

    console.log("Admin account created successfully.");

  } catch (error) {
    console.error("Failed to create admin:", error);
  } finally {
    await pool.end();
  }
};

createAdmin();