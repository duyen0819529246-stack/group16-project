import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/user.js";
import profileRoutes from "./routes/profile.js";
import authRoutes from "./routes/auth.js"; // ✅ route mới cho refresh token

// Load .env
dotenv.config();

// Khởi tạo app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Route test
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes); // ✅ thêm route auth

// ✅ Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("❌ MongoDB connection error:", error));
