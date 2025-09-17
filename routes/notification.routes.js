import { Router } from "express";
import {authMiddleware} from "../middleware/auth.middleware.js"
import { getNotifications , markNotificationAsRead, markAllNotificationsAsRead} from "../controllers/notification.controller.js";

const NotificationsRoughter = Router()

NotificationsRoughter.get('/notifications', authMiddleware, getNotifications);
NotificationsRoughter.put('/notifications/:notificationId/read', authMiddleware, markNotificationAsRead);
NotificationsRoughter.put("/notifications/mark-all-read", authMiddleware, markAllNotificationsAsRead);

export default NotificationsRoughter;