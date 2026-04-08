require("dotenv").config();
const mongoose = require("mongoose");
const { UserModel } = require("./models/users.models");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/elearning";

async function checkUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await UserModel.find({ role: "admin" });
    if (users.length === 0) {
      console.log("NO_ADMIN_FOUND");
    } else {
      console.log("ADMINS_FOUND:");
      users.forEach(u => console.log(`- ${u.email}`));
    }
  } catch (err) {
    console.log("ERROR:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
