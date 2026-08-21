import {
  getDashboardStats,
  getRecentSubmissions,
  getAllSubmissions,
} from "../services/DashboardService.js";


/*
 * GET /api/admin/dashboard
 *
 * Returns dashboard statistics and recent submissions.
 */
export const getDashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    const recentSubmissions = await getRecentSubmissions(10);

    return res.status(200).json({
      success: true,
      stats: {
        totalSubmissions: stats.total_submissions,
        todaySubmissions: stats.today_submissions,
        monthSubmissions: stats.month_submissions,
      },
      recentSubmissions,
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};


/*
 * GET /api/admin/submissions
 *
 * Returns all booking submissions.
 */
export const getSubmissions = async (req, res) => {
  try {
    const submissions = await getAllSubmissions();

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });

  } catch (error) {
    console.error("Submissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load submissions",
    });
  }
};