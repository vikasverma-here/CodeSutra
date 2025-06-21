const express = require("express");
const AiChatRouter = express.Router();
const aiChatController = require("../controllers/AiChatController");

AiChatRouter.post("/send",aiChatController.aiChat),



module.exports = AiChatRouter;