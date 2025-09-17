import { prisma } from "../db/prisma.js";
import jwt from "jsonwebtoken"

// POST /favorites
 const addToFavorites = async (req, res) => {
  try {
  const userId = req.userId;
    const { productId } = req.body;
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if already in favorites
    const existing = await prisma.favorite.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product already in favorites",
      });
    }

    // Add to favorites
    await prisma.favorite.create({
      data: { userId, productId },
    });

    return res.json({
      success: true,
      message: "Product added to favorites",
      data: null,
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export { addToFavorites };



// DELETE /favorites/:productId
const removeFavorite = async (req, res) => {
  try {
    // const { userId } = req.body; // we assume you pass userId in request body for now
    const userId = req.userId;
    const { productId } = req.params;

    // Check if favorite exists
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: Number(productId),
        },
      },
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    // Delete favorite
    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId: Number(productId),
        },
      },
    });

    res.json({
      success: true,
      message: "Product removed from favorites",
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export { removeFavorite };



// GET /favorites?page=&limit=
const getFavorites = async (req, res) => {
  try {
    const userId = req.userId;// or from auth middleware later
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Count total favorites
    const totalItems = await prisma.favorite.count({
      where: { userId },
    });

    // Fetch favorites with product details
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const formatted = favorites.map(fav => ({
      id: fav.product.id,
      title: fav.product.title,
      price: fav.product.price.toFixed(2),
      oldPrice: fav.product.oldPrice?.toFixed(2) || null,
      rating: fav.product.rating || 0,
      imageUrl: fav.product.imageUrl,
      addedAt: fav.createdAt,
    }));

    res.json({
      success: true,
      data: {
        favorites: formatted,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export { getFavorites };


