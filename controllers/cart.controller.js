import { prisma } from "../db/prisma.js";





// POST /cart/add
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, size, color } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Find or create cart for user
    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Add item to cart
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size,
        color,
      },
    });

    // Calculate totals
    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    res.json({
      success: true,
      message: "Product added to cart successfully",
      data: {
        cartId: cart.id,
        itemCount,
        totalAmount: totalAmount.toFixed(2),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}
export { addToCart };




// GET /cart
const getCart = async (req, res) => {
  try {
     const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    // Find user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.json({
        success: true,
        data: {
          id: null,
          items: [],
          summary: {
            itemCount: 0,
            subtotal: "0.00",
            shipping: "0.00",
            tax: "0.00",
            total: "0.00",
          },
        },
      });
    }

    // Summary calculation
    let itemCount = 0;
    let subtotal = 0;

    const items = cart.items.map((item) => {
      const itemSubtotal = item.product.price * item.quantity;
      itemCount += item.quantity;
      subtotal += itemSubtotal;

      return {
        id: item.id,
        product: {
          id: item.product.id,
          title: item.product.title,
          imageUrl: item.product.imageUrl,
          price: item.product.price.toFixed(2),
        },
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        subtotal: itemSubtotal.toFixed(2),
      };
    });

    // Configurable values
    const shipping = 25.0; // move to settings table later if needed
    const taxRate = 0.1083;
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    res.json({
      success: true,
      data: {
        id: cart.id,
        items,
        summary: {
          itemCount,
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
export { getCart };




// PUT /cart/items/:itemId
const updateCartItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10); // ✅ convert to number
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Check if item exists
    const existingItem = await prisma.cartItem.findUnique({
      where: { id: itemId }, // now integer
      include: { cart: true, product: true },
    });

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    // Recalculate totals for the cart
    const items = await prisma.cartItem.findMany({
      where: { cartId: existingItem.cartId },
      include: { product: true },
    });

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    res.json({
      success: true,
      message: "Cart updated successfully",
      data: {
        itemCount,
        totalAmount: totalAmount.toFixed(2),
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

export { updateCartItem };


// DELETE /cart/items/:itemId
 const removeCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId  = parseInt(req.params.itemId, 10);

    // Find the item
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Ensure the cart belongs to the user
    const cart = await prisma.cart.findFirst({
      where: { userId, id: item.cartId },
    });

    if (!cart) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove this item",
      });
    }

    // Delete the item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    // Recalculate cart totals
    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });

    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
    const totalAmount = items
      .reduce((acc, i) => acc + i.quantity * i.product.price, 0)
      .toFixed(2);

    return res.json({
      success: true,
      message: "Item removed from cart",
      data: {
        itemCount,
        totalAmount,
      },
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export { removeCartItem };