// const mongoose = require("mongoose");
// const config = require("./config.js");
// console.log(config.mongoUri);

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(config.mongoUri);

//     console.log(`✅ MongoDB connected → ${conn.connection.host} (${conn.connection.name})`);
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err.message);
//     process.exit(1); // Exit process with failure
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");
const { config } = require("./config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB connected → ${conn.connection.host} (${conn.connection.name})`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

