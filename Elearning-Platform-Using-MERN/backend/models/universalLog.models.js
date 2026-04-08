const mongoose = require("mongoose");

const universalLogSchema = mongoose.Schema(
    {
        // ===== Core Log Info =====
        core: {
            timestamp: { type: Date, default: Date.now },
            event_id: { type: String, required: true },
            event_type: { type: String },
            log_level: { type: String, enum: ["INFO", "WARN", "ERROR", "DEBUG"], default: "INFO" },
            service_name: { type: String, default: "Project-Defend-Backend" },
            host: { type: String },
            host_name: { type: String },
        },

        // ===== Web Server Logs =====
        web: {
            remote_ip: { type: String },
            remote_port: { type: String },
            http_method: { type: String },
            request_uri: { type: String },
            http_version: { type: String },
            status_code: { type: Number },
            response_size: { type: Number },
            response_time: { type: Number }, // in ms
            referrer: { type: String },
            user_agent: { type: String },
            connection_status: { type: String },
        },

        // ===== Authentication Logs =====
        auth: {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            username: { type: String },
            domain: { type: String },
            source_ip: { type: String },
            authentication_method: { type: String },
            login_status: { type: String },
            failure_reason: { type: String },
            logon_type: { type: String },
            session_id: { type: String },
        },

        // ===== Application Server Logs =====
        app: {
            endpoint: { type: String },
            action: { type: String },
            request_payload: { type: mongoose.Schema.Types.Mixed },
            response_status: { type: String },
            error_message: { type: String },
            execution_time: { type: Number },
            thread_id: { type: String },
        },

        // ===== Database Server Logs =====
        db: {
            db_user: { type: String },
            client_ip: { type: String },
            database_name: { type: String },
            query_text: { type: String },
            query_type: { type: String },
            rows_affected: { type: Number },
            execution_time: { type: Number },
            query_status: { type: String },
            error_code: { type: String },
            connection_id: { type: String },
        },

        // ===== Firewall / Network Logs =====
        network: {
            destination_ip: { type: String },
            source_ip: { type: String },
            source_port: { type: Number },
            destination_port: { type: Number },
            protocol: { type: String },
            action: { type: String },
            connection_state: { type: String },
            packet_count: { type: Number },
            bytes_sent: { type: Number },
            bytes_received: { type: Number },
            interface: { type: String },
            rule_id: { type: String },
            // Extended traffic/security fields
            request_rate_per_min: { type: Number },
            failed_login_attempts: { type: Number },
            session_duration_ms: { type: Number },
            data_transfer_bytes: { type: Number },
            request_size_bytes: { type: Number },
            response_size_bytes: { type: Number },
            geographic_location: { type: String },
            request_method: { type: String },
            request_interval_ms: { type: Number },
            cpu_usage_percent: { type: Number },
        },

        // ===== Operating System Logs =====
        os: {
            process_id: { type: Number },
            process_name: { type: String },
            parent_process_id: { type: Number },
            command_executed: { type: String },
            file_path: { type: String },
            event_id: { type: String },
            event_type: { type: String },
            user_id: { type: String },
        },
    },
    {
        versionKey: false,
    }
);

const UniversalLogModel = mongoose.model("universalLog", universalLogSchema);

module.exports = {
    UniversalLogModel,
};
