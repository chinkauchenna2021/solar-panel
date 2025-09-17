import { Router } from "express";
import {authMiddleware} from "../middleware/auth.middleware.js"
import { updateUserLocation ,getUserProfile} from "../controllers/user.controller.js";

const userRoughter = Router()

userRoughter.put('/user/location', authMiddleware,  updateUserLocation);
userRoughter.put('/user/profile', authMiddleware, getUserProfile)

export default userRoughter;