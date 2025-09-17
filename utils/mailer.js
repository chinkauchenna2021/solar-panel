import nodemailer from "nodemailer";


const sendOtpEmail = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Solar App" <${process.env.EMAIL_USER}>`,
        to,
        subject: "OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    console.log(`✅ OTP sent to ${to}`);

}

export { sendOtpEmail };