const express = require("express")
const authRouterAdmin = express.Router()
const authControllerAdmin = require("../controllers/adminAuthControllers")
const { registerValidation,loginValidation ,adminRegisterValidation} = require("../validations/authValidation");
const validate = require("../middlewares/validate");



authRouterAdmin.post("/register",registerValidation,validate,adminRegisterValidation,authControllerAdmin.adminRegister)
authRouterAdmin.post("/login", loginValidation, validate,authControllerAdmin.adminLogin);
// authRouter.post("admin/logout",  authController.logout);

module.exports=authRouterAdmin