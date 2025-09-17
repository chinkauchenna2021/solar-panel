import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // --- 1. Clear existing data ---
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();

  // --- 2. Seed Banners ---
  await prisma.banner.createMany({
    data: [
      {
        imageUrl: "https://example.com/banner1.jpg",
        title: "Go Solar, Save More",
        actionUrl: "/products",
      },
      {
        imageUrl: "https://example.com/banner2.jpg",
        title: "Eco-friendly Power",
        actionUrl: "/categories",
      },
    ],
  });

  // --- 3. Seed Categories ---
  await prisma.category.createMany({
    data: [
      { label: "Monocrystalline", image: "https://example.com/mono.jpg" },
      { label: "Polycrystalline", image: "https://example.com/poly.jpg" },
    ],
  });

  const mono = await prisma.category.findFirst({ where: { label: "Monocrystalline" } });
  const poly = await prisma.category.findFirst({ where: { label: "Polycrystalline" } });

  // --- 4. Seed Products ---
  const product1 = await prisma.product.create({
    data: {
      title: "Monocrystalline Solar Panel 200W",
      price: 150.0,
      oldPrice: 200.0,
      rating: 4.5,
      imageUrl: "https://example.com/panel1.jpg",
      brand: "SunPower",
      inStock: true,
      stockQuantity: 50,
      categoryId: mono.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      title: "Polycrystalline Solar Panel 150W",
      price: 100.0,
      oldPrice: 120.0,
      rating: 4.0,
      imageUrl: "https://example.com/panel2.jpg",
      brand: "EcoSolar",
      inStock: true,
      stockQuantity: 80,
      categoryId: poly.id,
    },
  });

  // --- 5. Product Images ---
  await prisma.productImage.createMany({
    data: [
      { productId: product1.id, url: "https://example.com/panel1a.jpg" },
      { productId: product1.id, url: "https://example.com/panel1b.jpg" },
      { productId: product2.id, url: "https://example.com/panel2a.jpg" },
    ],
  });

  // --- 6. Product Sizes ---
  await prisma.productSize.createMany({
    data: [
      { productId: product1.id, size: "200W" },
      { productId: product2.id, size: "150W" },
    ],
  });

  // --- 7. Product Colors ---
  await prisma.productColor.createMany({
    data: [
      { productId: product1.id, color: "Black" },
      { productId: product2.id, color: "Blue" },
    ],
  });

  // --- 8. Product Specs ---
  await prisma.productSpecification.createMany({
    data: [
      { productId: product1.id, key: "Efficiency", value: "22%" },
      { productId: product1.id, key: "Warranty", value: "25 years" },
      { productId: product2.id, key: "Efficiency", value: "18%" },
    ],
  });

  // --- 9. User-dependent seeding (skip if no user exists) ---
  const user = await prisma.user.findFirst();
  if (user) {
    // Reviews
    await prisma.review.createMany({
      data: [
        {
          productId: product1.id,
          userId: user.id,
          rating: 5,
          comment: "Excellent panel, works perfectly!",
        },
        {
          productId: product2.id,
          userId: user.id,
          rating: 4,
          comment: "Good value for the price.",
        },
      ],
    });

    // Cart
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
        items: {
          create: [
            { productId: product1.id, quantity: 2, size: "200W", color: "Black" },
            { productId: product2.id, quantity: 1, size: "150W", color: "Blue" },
          ],
        },
      },
      include: { items: true },
    });
    console.log("🛒 Cart created:", cart.id);

    // Favorites
    // await prisma.favorite.createMany({
    //   data: [
    //     { userId: user.id, productId: product1.id },
    //     { userId: user.id, productId: product2.id },
    //   ],
    // });
    // console.log("⭐ Favorites added for user:", user.email);
  } else {
    console.log("⚠️ No user found, skipping reviews, cart, and favorites.");
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
