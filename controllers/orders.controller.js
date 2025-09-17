import { prisma } from "../db/prisma.js";
import { verifyPaystackPayment } from "../payments/paystack_verify.js"



// Helper to generate tracking IDs
function generateTrackingId() {
  return "TRK" + Math.floor(100000000 + Math.random() * 900000000);
}

// Estimated delivery = today + 5 days
function getEstimatedDelivery() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toISOString();
}

const createOrder = async (req, res) => {
  try {
    const { cartId, shippingAddress, paymentMethod, paymentRef } = req.body;
     const userId = req.userId;// assume middleware sets req.user

    if (!cartId || !shippingAddress || !paymentMethod || !paymentRef) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    if (paymentMethod !== "paystack") {
      return res
        .status(400)
        .json({ success: false, message: "Only Paystack is supported" });
    }

    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: Number(cartId) },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.userId !== userId) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    if (cart.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty" });
    }

    //  Calculate subtotal, shipping, tax, total
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.quantity * Number(item.product.price),
      0
    );

    const shipping = 25.0; // i will make it dynamic later
    const tax = subtotal * 0.1; //   10% VAT
    const total = subtotal + shipping + tax;

    // paystack payment verification 
    const paymentData = await verifyPaystackPayment(paymentRef)

    if (paymentData.status !== true || paymentData.data.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Payment not verified",
      });
    }

    const amountPaid = paymentData.data.amount / 100; // Paystack sends in kobo
    if (amountPaid !== total) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
      });
    }

    // ✅ Create order
    const order = await prisma.order.create({
      data: {
        userId: userId, // use logged in user
        trackingId: generateTrackingId(),
        paymentRef,
        shippingAddress,
        status: "CONFIRMED",
        subtotal,
        shipping,
        tax,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });

    // ✅ Clear cart after placing order
    await prisma.cartItem.deleteMany({ where: { cartId } });

    return res.json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderId: order.id,
        trackingId: order.trackingId,
        status: order.status.toLowerCase(),
        subtotal: order.subtotal.toString(),
        shipping: order.shipping.toString(),
        tax: order.tax.toString(),
        total: order.total.toString(),
        estimatedDelivery: getEstimatedDelivery(),
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export { createOrder };



const getOrders = async (req, res) => {
  try {
    const userId = req.userId;// assume middleware sets req.user
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // ✅ Filter by status (optional)
    const where = { userId };
    if (status) {
      where.status = status.toUpperCase();
    }

    // ✅ Fetch orders
    const [orders, totalItems] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  imageUrl: true,
                  brand: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / Number(limit));

    // ✅ Format response
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      trackingId: order.trackingId,
      status: order.status.toLowerCase(),
      orderDate: order.createdAt,
      estimatedDelivery: getEstimatedDelivery(),
      total: order.total.toString(),
      items: order.items.map((item) => ({
        product: {
          id: item.product.id,
          title: item.product.title,
          imageUrl: item.product.imageUrl,
        },
        quantity: item.quantity,
        size: item.product.brand || null, // you can map `brand` as "size"
        price: item.price.toString(),
      })),
    }));

    return res.json({
      success: true,
      data: {
        orders: formattedOrders,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems,
        },
      },
    });
  } catch (error) {
    console.error("Get Orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export { getOrders };



// GET /orders/:orderId
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ Build shippingAddress object
    const shippingAddress = typeof order.shippingAddress === "string"
      ? JSON.parse(order.shippingAddress) // if stored as JSON string
      : order.shippingAddress;

    // ✅ Map items into response format
    const items = order.items.map((item) => ({
      product: {
        id: item.product.id,
        title: item.product.title,
        imageUrl: item.product.imageUrl,
      },
      quantity: item.quantity,
      size: item.size || null,
      color: item.color || null,
      price: item.price.toFixed(2),
      subtotal: (item.price * item.quantity).toFixed(2),
    }));

    // ✅ Calculate summary
    const subtotal = order.subtotal?.toFixed(2) || items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0).toFixed(2);
    const shipping = order.shipping?.toFixed(2) || "25.00";
    const tax = order.tax?.toFixed(2) || (subtotal * 0.1083).toFixed(2); // 10.83% example tax
    const total = order.total?.toFixed(2) || (
      parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax)
    ).toFixed(2);

    // ✅ Timeline steps
    const timeline = [
      {
        status: "placed",
        title: "Order Placed",
        timestamp: order.createdAt,
        completed: true,
      },
      {
        status: "processing",
        title: "In Progress",
        timestamp: order.processingAt || null,
        completed: !!order.processingAt,
      },
      {
        status: "shipped",
        title: "Shipped",
        timestamp: order.shippedAt || null,
        completed: !!order.shippedAt,
      },
      {
        status: "delivered",
        title: "Delivered",
        timestamp: order.deliveredAt || null,
        completed: !!order.deliveredAt,
      },
    ];

    // ✅ Final API Response
    return res.json({
      success: true,
      data: {
        id: order.id,
        trackingId: order.trackingId,
        status: order.status.toLowerCase(),
        orderDate: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
        shippingAddress,
        items,
        summary: {
          subtotal,
          shipping,
          tax,
          total,
        },
        timeline,
      },
    });
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
export { getOrderDetails };


// GET /orders/:orderId/track
const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ Build timeline dynamically
    const timeline = [
      {
        status: "placed",
        title: "Order Placed",
        description: "Your order has been confirmed",
        timestamp: order.createdAt,
        completed: true,
      },
      {
        status: "processing",
        title: "In Progress",
        description: "Your order is being prepared",
        timestamp: order.processingAt || null,
        completed: !!order.processingAt,
      },
      {
        status: "shipped",
        title: "Shipped",
        description: "Your order is on its way",
        timestamp: order.shippedAt || null,
        completed: !!order.shippedAt,
      },
      {
        status: "delivered",
        title: "Delivered",
        description: "Your order will be delivered",
        timestamp: order.deliveredAt || null,
        completed: !!order.deliveredAt,
      },
    ];

    // ✅ Response
    return res.json({
      success: true,
      data: {
        orderId: order.id,
        trackingId: order.trackingId,
        currentStatus: order.status.toLowerCase(),
        estimatedDelivery: order.estimatedDelivery,
        timeline,
      },
    });
  } catch (err) {
    console.error("Error tracking order:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export { trackOrder };


