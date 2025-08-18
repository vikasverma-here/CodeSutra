const express = require("express")
const { protecttedRoutesUser } = require("../middlewares/userMiddlewares")
const submissionControllers = require("../controllers/submissionControllers")
const { isUser } = require("../middlewares/checkUserOrAdmin")

const submissionRoutes= express.Router()

submissionRoutes.post("/problem/:id",protecttedRoutesUser,isUser,submissionControllers.submitQuesion)

module.exports=submissionRoutes