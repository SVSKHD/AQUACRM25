import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  signIn: async (email: string, password: string) => {
    try {
      // For demo purposes, we'll simulate a successful login
      // In production, this would make an actual API call
      // if (email === "demo@aquakart.com" && password === "demo123") {
      //   const mockResponse = {
      //     token: "mock-jwt-token-for-demo-purposes",
      //     user: {
      //       _id: "1",
      //       email: email,
      //       name: "Demo User",
      //       role: "admin",
      //     },
      //   };

      //   localStorage.setItem("token", mockResponse.token);
      //   return mockResponse;
      // } else {
      //   throw new Error("Invalid credentials");
      // }

      // Actual API implementation (commented out for demo)

      const response = await api.post("/crm/user/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to sign in";
      throw new Error(message);
    }
  },

  signOut: async () => {
    localStorage.removeItem("token");
  },

  getSession: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      // For demo purposes, return mock user data
      if (token === "mock-jwt-token-for-demo-purposes") {
        return {
          user: {
            _id: "1",
            email: "demo@aquakart.com",
            name: "Demo User",
            role: "admin",
          },
        };
      }

      // Actual API implementation (commented out for demo)
      /*
      const response = await api.get('/crm/user/me');
      return response.data;
      */

      return null;
    } catch (error) {
      localStorage.removeItem("token");
      return null;
    }
  },
};

export default api;
