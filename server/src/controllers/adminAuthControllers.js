

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const redisClient = require("../redis/redisClient");
const jwt = require("jsonwebtoken");
// const sentEmail =require("../utils/sendEmail");
const sendEmail = require("../utils/sendEmail");



module.exports.adminRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, secretCode,username } = req.body;

   
    if (secretCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({ success: false, message: "Invalid secret code give me valid secret code to become admin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      username,
      role: "admin", 
    });

    const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      role: "admin",
    });
  } catch (error) {
    console.error("❌ Admin Register Error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


module.exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized: Not an admin account" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Admin Login Error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
