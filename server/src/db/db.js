// src/config/db.js
const mongoose = require("mongoose");

const connectDb = async () => {
    console.log(process.env.MONGO_URI)
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); 
  }
};

module.exports = connectDb;
