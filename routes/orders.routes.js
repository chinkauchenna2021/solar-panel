import { Router } from "express";
// import { paystackWebhook } from "../controllers/paystack.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js"
import { createOrder, getOrders, getOrderDetails, trackOrder} from  "../controllers/orders.controller.js";
const ordersRouter = Router();

ordersRouter.post('/orders', createOrder);
//paystackWebhook url
// ordersRouter.post('/webhook', paystackWebhook);
ordersRouter.get('/orders', authMiddleware, getOrders); 
ordersRouter.get('/orders/:orderId',authMiddleware, getOrderDetails);
ordersRouter.get('/orders/:orderId/track',authMiddleware, trackOrder)


export default ordersRouter;