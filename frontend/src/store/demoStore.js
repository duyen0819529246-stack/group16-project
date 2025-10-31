import { configureStore } from "@reduxjs/toolkit";
import demoAuthReducer from "./demoAuthSlice";
import demoUsersReducer from "./demoUsersSlice";

export const demoStore = configureStore({
  reducer: {
    demoAuth: demoAuthReducer,
    demoUsers: demoUsersReducer,
  },
  devTools: true, // Enable Redux DevTools
});

