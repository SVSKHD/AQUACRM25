import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/api";

interface User {
  id: string;
  email: string;
  role?: string;
  token?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await authService.signIn(email, password);
      return {
        id: response.user._id,
        email: response.user.email,
        token: response.token,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in");
    }
  },
);

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const userString = localStorage.getItem("user");
  if (!userString) return null;

  const user = JSON.parse(userString);

  // ✅ return the expected shape
  return {
    id: user.id || user._id,
    email: user.email,
    role: user.role == 1 ? "admin" : "user",
    token: user.token,
  };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut: (state) => {
      authService.signOut();
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to sign in";
    });

    // Check Auth
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
