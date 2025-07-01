const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    });
// console.log(process.env.JWT_SECRET)
    
    const token = jwt.sign({ id: user._id },process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
    });

  } catch (error) {
    console.error("❌ Register Error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
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