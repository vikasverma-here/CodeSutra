const { createClient } = require("redis");
require("dotenv").config();



const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT), // ✅ Port as number
    // tls: true, // ✅ Required for Redis Cloud
  },
  username: "default",
  password: process.env.REDIS_PASSWORD,
});

client.on("error", (err) => console.error("❌ Redis Client Error:", err));
client.on("connect", () => console.log("🟡 Redis Connecting..."));
client.on("ready", () => console.log("✅ Redis Ready!"));

module.exports = client;
