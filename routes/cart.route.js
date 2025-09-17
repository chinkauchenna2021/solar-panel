import { Router } from "express";
import {authMiddleware} from "../middleware/auth.middleware.js"
import { addToCart, getCart, updateCartItem, removeCartItem } from "../controllers/cart.controller.js";


const cartRouter = Router()

cartRouter.post('/cart/add', authMiddleware, addToCart )
cartRouter.get('/cart', authMiddleware, getCart);
cartRouter.put('/cart/items/:itemId', authMiddleware, updateCartItem);
cartRouter.delete('/cart/items/:itemId',authMiddleware, removeCartItem)




export default cartRouter;