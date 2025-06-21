const express = require("express")
const app = express();
const AiChatRouter = require("./routes/AiChatRoutes");
app.use(express.json());

app.use("/api/user/ai-chat", AiChatRouter);



module.exports = { app };