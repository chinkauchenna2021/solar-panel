import { Router } from "express";
import { registerUser , verifyOtp, resendOtp, loginUser} from "../controllers/auth.controller.js";

const router  = Router()

//authentication routes
router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser)



export default router;