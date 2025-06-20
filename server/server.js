



const app = require("./src/App.js");
const { config } = require("./src/config/config.js");
const connectDB = require("./src/config/db.js");

const startServer = async () => {
  try {
    await connectDB(); // wait until DB connects
    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer(); 