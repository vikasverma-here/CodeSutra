const { body } = require("express-validator");

exports.registerValidation = [
  body("firstName")
    .notEmpty().withMessage("First name is required")
    .isAlpha().withMessage("First name must contain only letters"),

  body("lastName")
    .notEmpty().withMessage("Last name is required")
    .isAlpha().withMessage("Last name must contain only letters"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("username")
    .notEmpty().withMessage("Username is required")
    .isAlphanumeric().withMessage("Username must be alphanumeric"),
];


exports.loginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];


exports.adminRegisterValidation = [
  ...exports.registerValidation,
  body("secretCode")
    .notEmpty().withMessage("Secret code is required")
    .equals(process.env.ADMIN_SECRET_CODE).withMessage("Invalid admin secret code"),
];