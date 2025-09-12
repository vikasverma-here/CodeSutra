const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protecttedRoutesUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
      console.log( "idkvjoi",token)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing from cookies",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or corrupt token",
    });
  }
};



module.exports = { protecttedRoutesUser };