import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "login",
        "logout",
        "signup",
        "token_refresh",
        "password_change",
        "password_reset_request",
        "password_reset_success",
        "avatar_upload",
        "profile_view",
        "profile_update",
        "failed_login",
      ],
      index: true,
    },
    metadata: {
      ip: String,
      userAgent: String,
      result: String, // success, failed, etc.
      details: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;


