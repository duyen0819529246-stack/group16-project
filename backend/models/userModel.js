import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
    avatar: { type: String, default: "" },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
