
// ✅ Middleware 2: Role Check for Admin
const isUser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user in request",
      });
    }

    if (req.user.role.toLowerCase() !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied: user only",
      });
    }

    next();
  } catch (error) {
    console.error("Role Check Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during role check",
    });
  }
};

module.exports = {  isUser };