import { Router } from "express";

import { addToFavorites, removeFavorite, getFavorites} from "../controllers/favorites.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js"

const favoritesRouter = Router()

favoritesRouter.post('/favorites',authMiddleware, addToFavorites);
favoritesRouter.delete('/favorites/:productId', authMiddleware, removeFavorite);
favoritesRouter.get('/favorites',authMiddleware, getFavorites);


export default favoritesRouter;