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
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // checks DB
    res.status(200).json({ status: "ok", db: "connected", timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ status: "error", db: "disconnected", timestamp: new Date().toISOString() });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Solar API running on port ${PORT}`));

