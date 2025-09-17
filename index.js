import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js"
import homeScreenRouter from "./routes/homeScreen.route.js"
import cartRouter from "./routes/cart.route.js";
import favoritesRouter from "./routes/favorites.route.js";
import ordersRouter from "./routes/orders.routes.js";
import NotificationsRoughter from "./routes/notification.routes.js";
import userRoughter from "./routes/user.routes.js";

dotenv.config()

const app = express() //connect to express
//allowes fronted to make Api call
app.use(cors());
//parse json 
app.use(express.json());
//auth
app.use('/api/v1/auth', authRoutes);
//homescreen
app.use('/api/v1/', homeScreenRouter);
//add to cart
app.use('/api/v1', cartRouter);
//favorites
app.use('/api/v1', favoritesRouter);
//orders
app.use('/api/v1', ordersRouter);
//notification
app.use('/api/v1', NotificationsRoughter)

//user
app.use('/api/v1', userRoughter)



//paystack webbook
// app.use("/paystack", ordersRouter)




// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// async function main() {
//   const userId = "cmfmo4bcc0000vqgs946wt0fe"; 

//   const notifications = [
//     {
//       title: "Order Shipped",
//       message: "Your order #TRK452126542 has been shipped and is on its way",
//       type: "order_update",
//       icon: "local_shipping",
//       isRead: false,
//       actionUrl: "/orders/order_123456",
//       userId,
//     },
//     {
//       title: "Flash Sale Alert",
//       message: "Limited time offer! Get 30% off on all solar panels",
//       type: "promotion",
//       icon: "flash_on",
//       isRead: true,
//       actionUrl: "/products?filter=sale",
//       userId,
//     },
//     {
//       title: "Order Delivered",
//       message: "Your order #TRK789654 has been delivered successfully",
//       type: "order_update",
//       icon: "check_circle",
//       isRead: false,
//       actionUrl: "/orders/order_789654",
//       userId,
//     },
//   ];

//   await prisma.notification.createMany({
//     data: notifications,
//     skipDuplicates: true,
//   });

//   console.log("✅ Notifications seeded!");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Solar API running on port ${PORT}`));

