const express = require("express")
const userRoutes= express.Router()
const userControllers = require ("../controllers/services/userControllers")
const { protecttedRoutesUser } = require("../middlewares/userMiddlewares")
const { isUser } = require("../middlewares/checkUserOrAdmin")

userRoutes.get("/problem/solved",protecttedRoutesUser,isUser,userControllers.getUserSubmissions)


module.exports=userRoutes