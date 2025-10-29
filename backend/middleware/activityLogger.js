import ActivityLog from "../models/activityLogModel.js";

// Middleware to log user activity
export const logActivity = async (userId, action, metadata = {}) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      metadata: {
        ip: metadata.ip || "",
        userAgent: metadata.userAgent || "",
        result: metadata.result || "success",
        details: metadata.details || "",
      },
      timestamp: new Date(),
    });
    console.log(`[Activity Log] User ${userId} - ${action}`);
  } catch (error) {
    console.error(`[Activity Log Error] ${error.message}`);
    // Don't throw error - logging failure shouldn't break the main flow
  }
};

// Middleware wrapper to automatically log activity
export const activityLoggerMiddleware = (action) => {
  return async (req, res, next) => {
    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to log after successful response
    res.json = function (data) {
      // Only log if user is authenticated and response is successful
      if (req.user && req.user._id && res.statusCode < 400) {
        logActivity(req.user._id, action, {
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
          result: "success",
        }).catch(console.error);
      }
      return originalJson(data);
    };

    next();
  };
};

export default logActivity;


