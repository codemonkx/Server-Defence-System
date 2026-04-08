const mongoose = require("mongoose");

const loginLogSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        ip: { type: String },
        userAgent: { type: String },
        city: { type: String },
        region: { type: String },
        country: { type: String },
        timezone: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        metro: { type: Number },
        area: { type: Number },
        eu: { type: String },
        range: { type: [Number] },
        timestamp: { type: Date, default: Date.now },
    },
    {
        versionKey: false,
    }
);

const LoginLogModel = mongoose.model("loginLog", loginLogSchema);

module.exports = {
    LoginLogModel,
};
