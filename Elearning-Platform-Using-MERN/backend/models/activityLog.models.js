const mongoose = require("mongoose");

const activityLogSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        name: { type: String },
        email: { type: String },
        action: { type: String, required: true },
        method: { type: String, required: true },
        path: { type: String, required: true },
        query: { type: Object },
        timestamp: { type: Date, default: Date.now },
    },
    {
        versionKey: false,
    }
);

const ActivityLogModel = mongoose.model("activityLog", activityLogSchema);

module.exports = {
    ActivityLogModel,
};
