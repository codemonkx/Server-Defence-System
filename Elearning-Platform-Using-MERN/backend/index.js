const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");

dotenv.config();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// AI Defense Middleware (Must be high in stack)
const { universalActivityLogger } = require("./middlewares/activity.middleware");

// Configure CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.137.1:3000" // For hotspot demo
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy blocked this request."), false);
    }
  },
  credentials: true,
}));

// Apply logging to all routes
app.use(universalActivityLogger);

// Routes
const userRouter = require("./routes/users.routes");
app.use("/api/auth", userRouter);

const courseRouter = require("./routes/courses.routes");
app.use("/api/courses", courseRouter);

const logRouter = require("./routes/logs.routes");
app.use("/api/security", logRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", service: "Project-Defend-Backend" });
});

app.listen(process.env.port, () => {
    // AI DEMO: Reset the blocked IPs manifest on server start
    try {
        const fs = require('fs');
        const blockedIpsPath = path.join(__dirname, '..', 'final-year-pro', 'blocked_ips.json');
        
        // Ensure directory exists if possible, but folder final-year-pro should be there
        fs.writeFileSync(blockedIpsPath, '[]');
        console.log('AI Firewall completely reset.');
    } catch (e) {
        console.error('Failed to reset AI Firewall:', e.message);
    }

    console.log(`Server listening on port ${process.env.port}`);
});
