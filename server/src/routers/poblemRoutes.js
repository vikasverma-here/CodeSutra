const express = require("express")
const problemRouter = express.Router()
const { problemValidator } = require("../validations/validations")
const validate = require("../middlewares/validate")
const problemController = require("../controllers/problemControllers")
const { protecttedRoutesUser } = require("../middlewares/userMiddlewares")
const {isAdmin} = require("../middlewares/adminMiddlewares")

problemRouter.post("/create",problemValidator,validate, protecttedRoutesUser,isAdmin ,problemController.createProblem)



module.exports=problemRouter