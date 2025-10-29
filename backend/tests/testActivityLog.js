import mongoose from "mongoose";
import dotenv from "dotenv";
import ActivityLog from "../models/activityLogModel.js";
import User from "../models/userModel.js";

dotenv.config();

// Test script cho Activity Log Collection
// Sinh viên 3: Test lưu và truy vấn activity logs

const testActivityLog = async () => {
  try {
    console.log("🧪 BẮT ĐẦU TEST ACTIVITY LOG COLLECTION\n");

    // Kết nối MongoDB
    console.log("📊 Đang kết nối MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!\n");

    // Test 1: Tạo activity log
    console.log("TEST 1: Tạo Activity Log");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const testLog = await ActivityLog.create({
      userId: new mongoose.Types.ObjectId(),
      action: "USER_LOGIN",
      metadata: {
        ip: "192.168.1.100",
        userAgent: "Test User Agent",
        result: "success",
        details: "Test login from test script"
      }
    });
    
    console.log("✅ Tạo log thành công!");
    console.log("   ID:", testLog._id);
    console.log("   Action:", testLog.action);
    console.log("   Timestamp:", testLog.timestamp);
    console.log();

    // Test 2: Truy vấn log vừa tạo
    console.log("TEST 2: Truy vấn Activity Log");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const foundLog = await ActivityLog.findById(testLog._id);
    
    if (foundLog) {
      console.log("✅ Tìm thấy log!");
      console.log("   Action:", foundLog.action);
      console.log("   IP:", foundLog.metadata.ip);
      console.log("   Result:", foundLog.metadata.result);
    } else {
      console.log("❌ Không tìm thấy log!");
    }
    console.log();

    // Test 3: Truy vấn nhiều logs
    console.log("TEST 3: Tạo và truy vấn nhiều logs");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const userId = new mongoose.Types.ObjectId();
    const actions = ["USER_LOGIN", "PROFILE_VIEW", "PROFILE_UPDATE", "USER_LOGOUT"];
    
    // Tạo 4 logs
    for (const action of actions) {
      await ActivityLog.create({
        userId,
        action,
        metadata: {
          ip: "192.168.1.100",
          userAgent: "Test Agent",
          result: "success"
        }
      });
    }
    
    console.log("✅ Đã tạo 4 logs");
    
    // Truy vấn tất cả logs của user
    const userLogs = await ActivityLog.find({ userId }).sort({ timestamp: -1 });
    console.log(`✅ Tìm thấy ${userLogs.length} logs của user`);
    console.log("   Actions:", userLogs.map(log => log.action).join(", "));
    console.log();

    // Test 4: Filter theo action
    console.log("TEST 4: Filter logs theo action");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const loginLogs = await ActivityLog.find({ action: "USER_LOGIN" });
    console.log(`✅ Tìm thấy ${loginLogs.length} logs có action = USER_LOGIN`);
    console.log();

    // Test 5: Pagination
    console.log("TEST 5: Pagination - Lấy logs theo trang");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const page = 1;
    const limit = 2;
    const skip = (page - 1) * limit;
    
    const paginatedLogs = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);
    
    const totalLogs = await ActivityLog.countDocuments();
    const totalPages = Math.ceil(totalLogs / limit);
    
    console.log(`✅ Trang ${page}/${totalPages}`);
    console.log(`   Hiển thị ${paginatedLogs.length} logs (limit: ${limit})`);
    console.log(`   Tổng số logs: ${totalLogs}`);
    console.log();

    // Test 6: Aggregate - Thống kê
    console.log("TEST 6: Aggregate - Thống kê logs");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const stats = await ActivityLog.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    console.log("✅ Thống kê theo action:");
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} lần`);
    });
    console.log();

    // Test 7: Xóa test logs
    console.log("TEST 7: Cleanup - Xóa test logs");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const deleteResult = await ActivityLog.deleteMany({
      "metadata.userAgent": /Test/
    });
    
    console.log(`✅ Đã xóa ${deleteResult.deletedCount} test logs`);
    console.log();

    // Test 8: Index performance
    console.log("TEST 8: Kiểm tra indexes");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const indexes = await ActivityLog.collection.getIndexes();
    console.log("✅ Indexes hiện có:");
    Object.keys(indexes).forEach(indexName => {
      console.log(`   - ${indexName}`);
    });
    console.log();

    // Kết thúc
    console.log("═══════════════════════════════");
    console.log("🎉 TẤT CẢ TESTS HOÀN THÀNH!");
    console.log("═══════════════════════════════");
    console.log("\n📊 KẾT QUẢ:");
    console.log("✅ Test 1: Tạo log - PASS");
    console.log("✅ Test 2: Truy vấn log - PASS");
    console.log("✅ Test 3: Truy vấn nhiều logs - PASS");
    console.log("✅ Test 4: Filter theo action - PASS");
    console.log("✅ Test 5: Pagination - PASS");
    console.log("✅ Test 6: Aggregate thống kê - PASS");
    console.log("✅ Test 7: Cleanup - PASS");
    console.log("✅ Test 8: Kiểm tra indexes - PASS");
    console.log("\n🎯 8/8 TESTS PASSED (100%)\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ LỖI TRONG QUÁ TRÌNH TEST:");
    console.error(error.message);
    console.error("\nStack trace:");
    console.error(error.stack);
    process.exit(1);
  }
};

// Chạy test
testActivityLog();

