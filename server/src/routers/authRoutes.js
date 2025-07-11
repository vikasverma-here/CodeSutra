const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/authControllers")
const { registerValidation,loginValidation } = require("../validations/authValidation");
const validate = require("../middlewares/validate");

// authenctication routes 
authRouter.post("/register",registerValidation,validate,authController.register)
authRouter.post("/login", loginValidation, validate, authController.login);
authRouter.post("/logout",  authController.logout);


// verificatio using nodemailer 
authRouter.get("/verify/:token",authController.verifyUser)

module.exports=authRouter