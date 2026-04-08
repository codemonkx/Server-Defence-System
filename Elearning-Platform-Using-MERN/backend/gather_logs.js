const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { UniversalLogModel } = require("./models/universalLog.models");
const { connection } = require("./db");

async function gatherLogs() {
  try {
    console.log("Connecting to MongoDB...");
    await connection;
    console.log("Connected.");

    console.log("Fetching latest universal logs (last 30 minutes)...");
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    let logs = await UniversalLogModel.find({
      "core.timestamp": { $gte: thirtyMinutesAgo }
    })
      .sort({ "core.timestamp": -1 })
      .limit(200)
      .lean();

    // Fallback: if still empty, grab the 50 most recent logs regardless of time
    if (logs.length === 0) {
      console.log("No recent logs — fetching last 50 logs from any time...");
      logs = await UniversalLogModel.find({})
        .sort({ "core.timestamp": -1 })
        .limit(50)
        .lean();
    }

    // Final fallback: generate a heartbeat record so the agent never stalls
    if (logs.length === 0) {
      console.log("No logs found at all. Generating a heartbeat record...");
      const mockLog = {
        core: { timestamp: new Date(), event_id: `heartbeat-${Date.now()}` },
        web: { http_method: "GET", request_uri: "/", status_code: 200, response_time: 15 },
        network: {
          source_ip: "127.0.0.1",
          request_rate_per_min: 3,
          failed_login_attempts: 0,
          session_duration_ms: 15,
          data_transfer_bytes: 512,
          request_interval_ms: 100,
          cpu_usage_percent: 2.0,
          geographic_location: "Unknown"
        }
      };
      logs.push(mockLog);
    }

    const outputPath = path.join(__dirname, "defend_logs_export.json");
    fs.writeFileSync(outputPath, JSON.stringify(logs, null, 2));
    console.log(`Logs exported to ${outputPath}`);

  } catch (error) {
    console.error("Gather logs failed:", error);
  } finally {
    mongoose.connection.close();
  }
}

gatherLogs();
