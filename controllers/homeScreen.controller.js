// import bcrypt from "bcryptjs";       
// import jwt from "jsonwebtoken"; 

import { prisma } from "../db/prisma.js";

const getHomeData = async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { createdAt: "desc" },
        });

        const categories = await prisma.category.findMany({
            orderBy: { createdAt: "desc" },
        });

        const featuredProducts = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({
            success: true,
            data: {
                banners,
                categories,
                featuredProducts,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export { getHomeData };

const getProducts = async (req, res) => {
    try {

        const {
            filter = "all",
            category,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        // Build filters dynamically
        let where = {};

        // Filter by category if provided
        if (category) {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { brand: { contains: search, mode: "insensitive" } },
            ];
        }


        // Apply special filters
        switch (filter) {
            case "newest":
                where.isNew = true;
                break;
            case "popular":
                where.isPopular = true;
                break;
            case "high-efficiency":
                where.efficiency = { gte: 20 }; // Example: 20%+ efficiency
                break;
            case "affordable":
                where.price = { lte: 100 };
                break;
            case "portable":
                where.isPortable = true;
                break;
            case "residential":
                where.category = "Residential";
                break;
            case "commercial":
                where.category = "Commercial";
                break;
            case "off-grid":
                where.isOffGrid = true;
                break;
            default:
                // "all" means no extra filters
                break;
        }


        // Query DB
        const [products, totalItems] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: "desc" },
            }),
            prisma.product.count({ where }),
        ]);

        const totalPages = Math.ceil(totalItems / Number(limit));

        return res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: Number(page),
                    totalPages,
                    totalItems,
                    hasNext: Number(page) < totalPages,
                    hasPrevious: Number(page) > 1,
                },
            },
        });


    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: "Server error fetching products",
        });

    }


}
export { getProducts };

const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: Number(req.params.productId) },
            include: {
                images: true,
                sizes: true,
                colors: true,
                specifications: true,
            }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // 🔹 Transform the raw Prisma result
        const transformedProduct = {
            id: product.id,
            title: product.title,
            // description: product.description ?? "High-efficiency solar panel with premium materials", // add description if you have field
            price: product.price.toFixed(2), // format as string
            oldPrice: product.oldPrice?.toFixed(2) || null,
            rating: product.rating ?? 0,
            reviewCount: product.reviewCount ?? 128, // you can add reviewCount field later in schema
            category: product.category,
            brand: product.brand,
            images: product.images.map(img => img.url),
            sizes: product.sizes.map(s => s.size),
            colors: product.colors.map(c => c.color),
            specifications: product.specifications.reduce((acc, spec) => {
                acc[spec.key] = spec.value;
                return acc;
            }, {}),
            inStock: product.inStock,
            stockQuantity: product.stockQuantity,
            isFavorite: product.isFavorite,
        };

        return res.status(200).json({
            success: true,
            data: transformedProduct,
        });

    } catch (error) {
        console.error("Error fetching product details:", error);
        return res.status(500).json({
            success: false,
            message: "Server error fetching product details",
        });
    }
}
export { getProductDetails };

const productReview = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch reviews with pagination
        const reviews = await prisma.review.findMany({
            where: { productId },
            skip,
            take: limit,
            include: {
                user: { select: { id: true, firstName: true, lastName: true, profileImage: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        // Count total reviews
        const totalReviews = await prisma.review.count({ where: { productId } });

        // Calculate average rating
        const avg = await prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true }
        });

        // Rating distribution
        const ratingCounts = await Promise.all(
            [5, 4, 3, 2, 1].map(async (r) => ({
                [r]: await prisma.review.count({
                    where: { productId, rating: r }
                })
            }))
        );

        res.json({
            success: true,
            data: {
                reviews: reviews.map(r => ({
                    id: r.id,
                    userId: r.userId,
                    userName: `${r.user.firstName} ${r.user.lastName}`,
                    userAvatar: r.user.profileImage,
                    rating: r.rating,
                    subject: r.subject,
                    comment: r.comment,
                    createdAt: r.createdAt,
                    helpful: r.helpful,
                    images: r.images
                })),
                summary: {
                    averageRating: avg._avg.rating || 0,
                    totalReviews,
                    ratingDistribution: Object.assign({}, ...ratingCounts)
                },
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalReviews / limit),
                    hasNext: page * limit < totalReviews
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export { productReview };

//categories



const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                label: true,
                image: true,
                products: { select: { id: true } } // we use `select` to get related products
            },
        });


        const result = categories.map(cat => ({
            id: cat.id,
            label: cat.label,
            image: cat.image,
            productCount: cat.products.length,
        }));

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export { getCategories }



//  GET /categories/:categoryId/products
//  Query: page (default 1), limit (default 20)
 
const GetcategoriesAndProduct =  async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid categoryId",
      });
    }

    // check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, label: true, image: true },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // count total products in that category
    const totalItems = await prisma.product.count({
      where: { categoryId },
    });

    const totalPages = Math.ceil(totalItems / limit);

    // get paginated products
    const products = await prisma.product.findMany({
      where: { categoryId },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        price: true,
        oldPrice: true,
        rating: true,
        imageUrl: true,
      },
    });

    res.json({
      success: true,
      data: {
        category,
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export { GetcategoriesAndProduct };
