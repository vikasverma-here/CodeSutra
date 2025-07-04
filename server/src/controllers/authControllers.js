const User = require("../models/userModel");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const redisClient = require("../redis/redisClient");
const jwt = require("jsonwebtoken");
// const sentEmail =require("../utils/sendEmail");
const sendEmail = require("../utils/sendEmail");

// authenticatio controllers 

// module.exports.register = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, username } = req.body;

  
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Email already in use" });
//     }

   
//     const hashedPassword = await bcrypt.hash(password, 10);


//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       username,
//       password: hashedPassword,
//     });
// // console.log(process.env.JWT_SECRET)
    
//     const token = jwt.sign({ id: user._id },process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       token,
//     });

//   } catch (error) {
//     console.error("❌ Register Error:", error.message);
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// };


module.exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      isVerified: false, // Important for verification
    });

    // Generate verification token
    const emailToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const verifyLink = `http://localhost:4000/api/user/auth/verify/${emailToken}`;

    const html = `
      <h2>Hello ${firstName} 👋</h2>
      <p>Welcome to <b>CodeSutra</b>! Please verify your email by clicking below:</p>
      <a href="${verifyLink}" style="padding:10px 20px;background:#007bff;color:white;border-radius:5px;text-decoration:none;">Verify Email</a>
      <p>This link will expire in 15 minutes.</p>
      <hr/>
      <p style="color:gray;">CodeSutra Team</p>
    `;

    await sendEmail(email, "Verify your email for CodeSutra", html);

    res.status(201).json({
      success: true,
      message: "User registered! Please check your email to verify.",
    });

  } catch (error) {
    console.error("❌ Register Error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// ✅ VERIFY CONTROLLER
module.exports.verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).send("Invalid token or user not found");

    if (user.isVerified) {
      return res.send("✅ You're already verified on CodeSutra!");
    }

    user.isVerified = true;
    await user.save();

    res.send("🎉 Your email has been successfully verified for CodeSutra!");
  } catch (error) {
    console.error("❌ Verification Error:", error.message);
    res.status(400).send("❌ Invalid or expired verification link.");
  }
};

module.exports.login = async(req,res)=>{
  try{
   const {email,password} = req.body
  console.log(email,password)
   const isExit = await User.findOne({email})
   if (!isExit){
    return res.status(404).json({success:false,message:"this email is not exit "})
   }

   const isMatched = await bcrypt.compare(password,isExit.password)

   if(!isMatched){
    return res.status(401).json({success:false,message:"Invalid Credential"})
   }


   const token = jwt.sign({id:isExit._id,email:isExit.email},process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log(req.cookies)
     
   res.status(200).json({success:true,message:"Login Successfull"})
    
  }catch(error){
    console.error("❌ Register Error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({ message: "Token not found in cookies" });
    }

    const decoded = jwt.decode(token);
    console.log(decoded)
    const expiryInSeconds = decoded.exp - Math.floor(Date.now() / 1000); // remaining time

    // Blacklist the token in Redis
    await redisClient.set(`blacklist:${token}`, "true", {
  EX: expiryInSeconds,
});


    // Clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// verify user using nodemailer 
// module.exports.verifyUser=async(req,res)=>{
//   res.send("sent")
// }






