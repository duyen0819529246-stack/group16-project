import ActivityLog from "../models/activityLogModel.js";
import User from "../models/userModel.js";

// Get all activity logs (Admin only)
export const getAllLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, userId } = req.query;
    
    const filter = {};
    if (action) filter.action = action;
    if (userId) filter.userId = userId;
    
    const logs = await ActivityLog.find(filter)
      .populate("userId", "name email role")
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    const count = await ActivityLog.countDocuments(filter);
    
    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalLogs: count,
    });
  } catch (err) {
    console.error("getAllLogs error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Get logs for a specific user
export const getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50, action } = req.query;
    
    const filter = { userId };
    if (action) filter.action = action;
    
    const logs = await ActivityLog.find(filter)
      .populate("userId", "name email role")
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    const count = await ActivityLog.countDocuments(filter);
    
    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalLogs: count,
    });
  } catch (err) {
    console.error("getUserLogs error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Get activity statistics (Admin only)
export const getActivityStats = async (req, res) => {
  try {
    const stats = await ActivityLog.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    
    const totalLogs = await ActivityLog.countDocuments();
    const recentLogs = await ActivityLog.find()
      .populate("userId", "name email")
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();
    
    res.json({
      stats,
      totalLogs,
      recentLogs,
    });
  } catch (err) {
    console.error("getActivityStats error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Get my activity logs (current user)
export const getMyLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action } = req.query;
    const userId = req.user._id;
    
    const filter = { userId };
    if (action) filter.action = action;
    
    const logs = await ActivityLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    const count = await ActivityLog.countDocuments(filter);
    
    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalLogs: count,
    });
  } catch (err) {
    console.error("getMyLogs error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


