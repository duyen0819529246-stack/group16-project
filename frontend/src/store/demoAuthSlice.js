import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

// Redux Thunk: Đăng nhập
export const demoLogin = createAsyncThunk(
  "demoAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken, token, user } = res.data;

      const finalAccessToken = accessToken || token;
      const finalRefreshToken = refreshToken || token;

      if (finalAccessToken && finalRefreshToken) {
        localStorage.setItem("accessToken", finalAccessToken);
        localStorage.setItem("refreshToken", finalRefreshToken);

        const decoded = jwtDecode(finalAccessToken);
        const userData = user || {
          id: decoded.id,
          name: decoded.name || "",
          email: decoded.email || email,
          role: decoded.role || "user",
        };

        localStorage.setItem("user", JSON.stringify(userData));

        return {
          accessToken: finalAccessToken,
          refreshToken: finalRefreshToken,
          user: userData,
        };
      }
      throw new Error("Server không trả về token");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Đăng nhập thất bại"
      );
    }
  }
);

// Redux Thunk: Logout
export const demoLogout = createAsyncThunk("demoAuth/logout", async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return null;
});

// Load initial state từ localStorage
const getInitialAuthState = () => {
  try {
    let accessToken = localStorage.getItem("accessToken");
    let user = null;
    
    // Thử lấy user từ localStorage
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      try {
        user = JSON.parse(userFromStorage);
        console.log("demoAuthSlice: Loaded user from localStorage:", user);
      } catch (e) {
        console.error("demoAuthSlice: Error parsing user from localStorage:", e);
        user = null;
      }
    }
    
    // Nếu có token nhưng chưa có user, thử decode token
    if (accessToken && !user) {
      try {
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 > Date.now()) {
          user = {
            id: decoded.id,
            name: decoded.name || "",
            email: decoded.email || "",
            role: decoded.role || "user",
          };
          console.log("demoAuthSlice: Decoded user from token:", user);
        } else {
          console.log("demoAuthSlice: Token expired");
        }
      } catch (e) {
        console.error("demoAuthSlice: Error decoding token:", e);
      }
    }

    const state = {
      user: user,
      accessToken: accessToken,
      refreshToken: localStorage.getItem("refreshToken") || null,
      loading: false,
      error: null,
      authenticated: !!(accessToken && user),
    };
    
    console.log("demoAuthSlice: Initial state:", state);
    return state;
  } catch (e) {
    console.error("demoAuthSlice: Error in getInitialAuthState:", e);
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,
      authenticated: false,
    };
  }
};

const initialState = getInitialAuthState();

const demoAuthSlice = createSlice({
  name: "demoAuth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(demoLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(demoLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.authenticated = true;
        state.error = null;
      })
      .addCase(demoLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authenticated = false;
      })
      .addCase(demoLogout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.authenticated = false;
        state.error = null;
        state.loading = false;
      });
  },
});

export const { clearError } = demoAuthSlice.actions;
export default demoAuthSlice.reducer;

