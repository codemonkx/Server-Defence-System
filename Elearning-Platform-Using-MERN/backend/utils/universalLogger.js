const { UniversalLogModel } = require("../models/universalLog.models");
const { v4: uuidv4 } = require("uuid");
const os = require("os");

const logEvent = async (category, data, level = "INFO") => {
    try {
        const logEntry = new UniversalLogModel({
            core: {
                event_id: uuidv4(),
                event_type: `${category.toUpperCase()}_EVENT`,
                log_level: level,
                service_name: "Elearning-Backend",
                host: os.hostname(),
                host_name: os.type(),
            },
            [category]: data,
        });

        // Populate OS details for every log if not provided
        if (category !== "os") {
            logEntry.os = {
                process_id: process.pid,
                process_name: "node",
                parent_process_id: process.ppid,
                user_id: os.userInfo().username,
            };
        }

        await logEntry.save();
    } catch (err) {
        console.error("Universal Logger Error:", err);
    }
};

module.exports = { logEvent };
