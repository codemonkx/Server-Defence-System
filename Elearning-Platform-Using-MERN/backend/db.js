const mongoose = require("mongoose");
require("dotenv").config();

// Use environment variable for MongoDB URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning';

// Set timeout for queries so they fallback to JSON faster if DB is missing
mongoose.set('bufferTimeoutMS', 1000);

// Connect to MongoDB
const connection = mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 1000, // Detect missing DB in 1 second
});

connection
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

const db = mongoose.connection;

db.on("error", (error) => console.error("MongoDB Connection Error:", error));
db.once("open", () => console.log("Connected to MongoDB"));


module.exports = {
    connection
};
