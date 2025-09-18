import { Router } from "express";
import { registerUser , verifyOtp, resendOtp, loginUser} from "../controllers/auth.controller.js";
import { refreshAccessToken } from "../middleware/auth.middleware.js";

const router  = Router()

//authentication routes
router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);



export default router;