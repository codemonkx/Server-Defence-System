require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { UserModel } = require("./models/users.models");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/elearning";

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  const email = "admin@learnhub.com";
  const existing = await UserModel.findOne({ email });

  if (existing) {
    // ensure role is admin
    existing.role = "admin";
    await existing.save();
    console.log("Admin already exists — role updated to admin.");
    console.log("Email   :", email);
    console.log("Password: admin@1234");
  } else {
    const hash = await bcrypt.hash("admin@1234", 5);
    const admin = new UserModel({
      name: "Admin",
      email,
      password: hash,
      age: 25,
      city: "HQ",
      job: "Administrator",
      role: "admin",
    });
    await admin.save();
    console.log("Admin created successfully!");
    console.log("Email   :", email);
    console.log("Password: admin@1234");
  }

  await mongoose.disconnect();
}

createAdmin().catch(console.error);
