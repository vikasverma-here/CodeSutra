// const dotenv = require("dotenv")
// const app = require("./src/app")
// const connectDB = require("./src/db/db")
// dotenv.config()

// const PORT = process.env.PORT || 5000
// // console.log(PORT)


// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is listening on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("❌ Failed to connect to MongoDB:", error.message);
//     process.exit(1);
//   }
// };

// startServer();



const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const redisClient = require("./src/redis/redisClient"); // ✅ Redis client

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    await redisClient.connect(); // ✅ Redis connect
    console.log("✅ Redis Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect:", error.message);
    process.exit(1);
  }
};

startServer();
