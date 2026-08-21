import pool from "../../db.js";

/*
 * Get dashboard statistics.
 */
export const getDashboardStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total_submissions,
      COUNT(*) FILTER (
        WHERE created_at >= CURRENT_DATE
      )::int AS today_submissions,
      COUNT(*) FILTER (
        WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
      )::int AS month_submissions
    FROM bookings
  `);

  return result.rows[0];
};


/*
 * Get recent booking submissions.
 */
export const getRecentSubmissions = async (limit = 10) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      contact_number,
      institution_type,
      program_type,
      start_date,
      created_at
    FROM bookings
    ORDER BY created_at DESC
    LIMIT $1
    `,
    [limit]
  );

  return result.rows;
};


/*
 * Get all booking submissions.
 */
export const getAllSubmissions = async () => {
  const result = await pool.query(`
    SELECT
      id,
      name,
      email,
      contact_number,
      institution_type,
      program_type,
      start_date,
      created_at
    FROM bookings
    ORDER BY created_at DESC
  `);

  return result.rows;
};