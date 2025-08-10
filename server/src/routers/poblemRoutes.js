const express = require("express")
const problemRouter = express.Router()
const { problemValidator } = require("../validations/validations")
const validate = require("../middlewares/validate")
const problemController = require("../controllers/problemControllers")
const { protecttedRoutesUser } = require("../middlewares/userMiddlewares")
const {isAdmin} = require("../middlewares/adminMiddlewares")
const { isUser } = require("../middlewares/checkUserOrAdmin")

problemRouter.post("/create",problemValidator,validate, protecttedRoutesUser,isAdmin ,problemController.createProblem)
problemRouter.put("/update/:id",problemValidator,validate, protecttedRoutesUser,isAdmin ,problemController.updateProblem)
problemRouter.delete("/delete/:id", protecttedRoutesUser,isAdmin ,problemController.deleteProblem )
problemRouter.get("/singleProblem/:id", protecttedRoutesUser,isUser ,problemController.getSinglePrblemById )
problemRouter.get("/singleProblem", protecttedRoutesUser,isUser ,problemController.getAllPrblems )



module.exports=problemRouter




















