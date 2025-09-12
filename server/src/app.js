const express = require("express")
const app = express()
const authRoutes = require("../src/routers/authRoutes")
const adminAuthRoutes=require("../src/routers/adminAuthRoutes")
const problemRoutes = require("../src/routers/poblemRoutes")
const submissionRoutes = require("./routers/submissionRoutes")
const cookieParser = require("cookie-parser");
const userRoutes = require("./routers/userRoutes")
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use("/api/user/auth",authRoutes)
app.use("/api/admin/auth",adminAuthRoutes)
app.use("/api/admin/problems",problemRoutes)
app.use("/api/user/problems",problemRoutes)
app.use("/api/user/submit",submissionRoutes)
app.use("/api/user/info",userRoutes)
module.exports=app