const dotenv = require("dotenv")
const app = require("./src/app")
const connectDB = require("./src/db/db")
dotenv.config()

const PORT = process.env.PORT || 5000
// console.log(PORT)


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();