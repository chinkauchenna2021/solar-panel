
import bcrypt from "bcryptjs";       
import jwt from "jsonwebtoken";   
import { prisma } from "../db/prisma.js";
import { sendOtpEmail } from "../utils/mailer.js";


//registeration
const registerUser = async (req, res) => {

    try {
        const { firstName, lastName, email, password, confirmPassword, country } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !country) {
            res.status(400).json({ success: false, message: "All fields are required" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' })
        }

        //check if user already exist
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: { firstName, lastName, email, password: hashedPassword, country }
        });

             //send otp
        const otpCode  = Math.floor(1000 + Math.random() * 9000).toString()
          
        await prisma.otp.create({
            data:{
            email: user.email,
            code: otpCode,
            expiresAt: new Date( Date.now() + 5 * 60 * 1000), 
            },
        });

         // send OTP via email

         await sendOtpEmail(user.email, otpCode);

        res.json({
            success: true,
            message: "Registration successful",
            data: {
                userId: user.id,
                email: user.email,
                isVerified: user.isVerified,
            },

        });

   


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }


}
export {registerUser}
 


//verify otp
const  verifyOtp  = async (req, res) =>{
    try {


const { email, otp} = req.body;
const otpRecord  = await prisma.otp.findFirst({
    where:{email, code: otp},
});

if (!otpRecord ) {
    return res.status(400).json({success: false, message: "Invalid OTP"})
    
}

if (otpRecord.expiresAt < new Date()) {
    return res.status(400).json({success: false, message:"OTP expired"})
    
}

// set user status true
const user  = await prisma.user.update({
    where: { email },
    data: { isVerified: true },
    
});


await prisma.otp.delete({where: { id: otpRecord.id }})

    // issue JWT tokens
    const accessToken  = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken  = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      return res.json({
      success: true,
      message: "OTP verified successfully",
      data: {
        userId: user.id,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          country: user.country,
          isVerified: true   
        }
      },
    });

        
  

    } catch (error) {
        console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
    }
}
export { verifyOtp  };



//resnd otp
const resendOtp  = async (req, res) =>{
    try {
const  { email } = req.body;

 if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

   
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    await prisma.otp.deleteMany({ where: { email } });

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    await prisma.otp.create({
      data: {
        email,
        code: otpCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
      },
    });

    //resnd email
      await sendOtpEmail(email, otpCode);


    res.json({
      success: true,
      message: "OTP sent successfully",
      data: null,
    });
        
    } catch (error) {
        res.status(500).json({success: false, message: "server error"})
    }
}
export {resendOtp}



//login
const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Expirations
    const accessTokenExpiry = rememberMe ? "7d" : "2d";
    const refreshTokenExpiry = "30d";

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: refreshTokenExpiry }
    );
    console.log(refreshToken);
    

    // Store refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2); //two days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          country: user.country,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export {loginUser }

