import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Redux Thunk: Fetch users
export const fetchUsers = createAsyncThunk(
  "demoUsers/fetchUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Lấy user từ auth state để check quyền
      const state = getState();
      const authUser = state.demoAuth?.user;
      
      if (!authUser || authUser.role !== "admin") {
        return rejectWithValue("Bạn không có quyền");
      }

      const res = await api.get("/users");
      const users = res.data || [];

      const stats = {
        total: users.length,
        admins: users.filter((u) => u.role === "admin").length,
        moderators: users.filter((u) => u.role === "moderator").length,
        users: users.filter((u) => u.role === "user").length,
      };

      return {
        users,
        stats,
        userCount: users.length,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Không thể lấy danh sách users"
      );
    }
  }
);

const initialState = {
  loading: false,
  users: [],
  userCount: 0,
  stats: {
    total: 0,
    admins: 0,
    moderators: 0,
    users: 0,
  },
  filter: "all",
  search: "",
  error: null,
};

const demoUsersSlice = createSlice({
  name: "demoUsers",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.userCount = action.payload.userCount;
        state.stats = action.payload.stats;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.users = [];
        state.userCount = 0;
        state.stats = {
          total: 0,
          admins: 0,
          moderators: 0,
          users: 0,
        };
      });
  },
});

export const { setFilter, setSearch, clearError } = demoUsersSlice.actions;
export default demoUsersSlice.reducer;

