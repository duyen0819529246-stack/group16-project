import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/userModel.js";

dotenv.config();

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    password: "123456",
    role: "admin",
    avatar: ""
  },
  {
    name: "Moderator User",
    email: "moderator@gmail.com",
    password: "123456",
    role: "moderator",
    avatar: ""
  },
  {
    name: "Normal User 1",
    email: "user1@gmail.com",
    password: "123456",
    role: "user",
    avatar: ""
  },
  {
    name: "Normal User 2",
    email: "user2@gmail.com",
    password: "123456",
    role: "user",
    avatar: ""
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Xóa tất cả users cũ (ngoại trừ admin hiện tại nếu muốn giữ)
    // await User.deleteMany({});
    // console.log("🗑️  Đã xóa tất cả users cũ");

    // Hash password và tạo users mới
    for (const userData of sampleUsers) {
      const userExists = await User.findOne({ email: userData.email });
      
      if (!userExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        await User.create({
          ...userData,
          password: hashedPassword
        });
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }

    console.log("\n🎉 Seed completed successfully!");
    console.log("\n📋 Sample credentials:");
    console.log("Admin    - email: admin@gmail.com      | password: 123456");
    console.log("Moderator- email: moderator@gmail.com  | password: 123456");
    console.log("User 1   - email: user1@gmail.com      | password: 123456");
    console.log("User 2   - email: user2@gmail.com      | password: 123456");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();

