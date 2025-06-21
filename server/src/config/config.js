// require("dotenv").config();

// const config = {
//   port: process.env.PORT || 5000,
//   mongoUri: process.env.MONGO_URI
// //   jwt: {
// //     secret: process.env.JWT_SECRET,
// //     expiresIn: process.env.JWT_EXPIRES_IN || "1d",
// //     refreshSecret: process.env.REFRESH_TOKEN_SECRET,
// //     refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
// //   },
// //   clientURL: process.env.CLIENT_URL,
// //   email: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   }
// };

// module.exports = { config };



require("dotenv").config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  GOOGLE_API:process.env.GOOGLE_API,
};

module.exports = { config }; // ✅ wrap it in object

