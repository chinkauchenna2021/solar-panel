import { Router } from "express";
import { getHomeData, getProducts, getProductDetails, productReview, getCategories, GetcategoriesAndProduct } from "../controllers/homeScreen.controller.js";

const homeScreenRouter =  Router()

homeScreenRouter.get('/home', getHomeData);
homeScreenRouter.get('/products', getProducts);
homeScreenRouter.get("/products/:productId", getProductDetails);
homeScreenRouter.get("/products/:productId/reviews", productReview);
homeScreenRouter.get("/categories", getCategories);
homeScreenRouter.get("/categories/:categoryId/products",GetcategoriesAndProduct)



export default homeScreenRouter;