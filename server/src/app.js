const express = require("express")
const app = express()
const authRoutes = require("../src/routers/authRoutes")
const adminAuthRoutes=require("../src/routers/adminAuthRoutes")
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use("/api/user/auth",authRoutes)
app.use("/api/admin/auth",adminAuthRoutes)

module.exports=app