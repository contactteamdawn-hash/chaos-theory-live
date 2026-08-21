const API_BASE_URL = "https://chaos-theory-live.onrender.com/api/admin";

/*
 * Admin login
 */
export const adminLogin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};


/*
 * Get authenticated admin profile
 */
export const getAdminProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed");
  }

  return data;
};


/*
 * Logout admin
 */
export const adminLogout = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Logout failed");
  }

  return data;
};


/*
 * Get dashboard statistics and recent submissions
 */
export const getDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load dashboard");
  }

  return data;
};


/*
 * Get all submissions
 */
export const getAllSubmissions = async () => {
  const response = await fetch(`${API_BASE_URL}/submissions`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load submissions");
  }

  return data;
};