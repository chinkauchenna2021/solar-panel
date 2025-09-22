import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");


  // Delete in reverse order of dependencies
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
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

  // -- Seed Banners ---
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

  // ---  Seed Categories ---
  await prisma.category.createMany({
    data: [
      { label: "Monocrystalline", image: "  https://atlas-content-cdn.pixelsquid.com/stock-images/monocrystalline-solar-panels-cell-PO93E48-600.jpg " },
      { label: "Polycrystalline", image: "https://www.swiftermall.com/3618-large_default/mercury-260w-24v-polycrystalline-solar-panel.jpg" },
      { label: "Thin-Film", image: "https://images.squarespace-cdn.com/content/v1/63edb9b9c075c9465b1fc838/63c04cef-54d5-4811-b46f-436cce496cca/thin-film-solar-panels.jpg?format=2500w" },
      { label: "Portable", image: "https://antigravitybatteries.com/wp-content/uploads/2022/03/antigravity-xs200-portable-solar-panel-200-watt.jpg" },
      {
        label: 'Solar Roof Tiles',
        image: 'https://hanergy.eu/wp-content/uploads/2018/01/hantiles_los.jpg'
      },

    ],
  });


  const solarPanelsCategory = await prisma.category.findFirst({ where: { label: "Monocrystalline" } });

  // Products dataset (24 items)
  const products = [
    {
      title: "Solar Pane l350W",
      price: 250,
      oldPrice: 300,
      rating: 4.8,
      imageUrl: "https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg",
      category: 'Solar Panels',
      brand: "SunPower",
      description: "High-efficiency 350W solar panel designed formaximum energy output. Durable and weather-resistant.",
      sizes: ["100W", "200W", "350W", "400W"],
      colors: ["Black", "Blue", "Silver"],
      images: [
        "https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg",
        "https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg",
        "https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg",
      ],
    },
    {
      title: "Solar Panel 400W Monocrystalline",
      price: 320,
      oldPrice: 380,
      rating: 4.9,
      imageUrl: "https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg",
      category: 'Solar Panels',
      brand: "Canadian Solar",
      description: "Premium 400W monocrystalline solar panel with superior efficiency and 25-year warranty.",
      sizes: ["300W", "350W", "400W", "450W"],
      colors: ["Black", "Silver"],
      images: [
        "https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg",
        "https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg",
        "https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg",
      ],
    },
    {
      title: 'Solar Panel 500W Bifacial',
      price: '450.00',
      oldPrice: '520.00',
      rating: 4.8,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
      category: 'Solar Panels',
      brand: 'Jinko Solar',
      description: 'Advanced 500W bifacial solar panel capturing light from both sides for maximum efficiency.',
      sizes: ['400W', '450W', '500W', '550W'],
      colors: ['Black', 'Blue', 'Silver'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
        'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      ]
    },
    {
      title: 'Solar Panel 300W Polycrystalline',
      price: '220.00',
      oldPrice: '270.00',
      rating: 4.6,
      imageUrl: 'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      category: 'Solar Panels',
      brand: 'TrinaSolar',
      description: 'Cost-effective 300W polycrystalline solarpanel with reliable performance and durability.',
      sizes: ['250W', '300W', '350W'],
      colors: ['Blue', 'Black'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      ]
    },
    {
      title: 'Solar Panel 450W PERC Technology',
      price: '380.00',
      oldPrice: '450.00',
      rating: 4.9,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      category: 'Solar Panels',
      brand: 'LONGiSolar',
      description: 'High-performance 450W PERCtechnology solar panel with enhanced light absorption.',
      sizes: ['350W', '400W', '450W', '500W'],
      colors: ['Black', 'Silver'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
        'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      ]
    },
    {
      title: 'Solar Panel 200W Flexible',
      price: '180.00',
      oldPrice: '220.00',
      rating: 4.4,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
      category: 'Solar Panels',
      brand: 'Renogy',
      description: 'Light weight 200W  flexible solar panel perfect for RVs, boats, and curved surfaces.',
      sizes: ['100W', '150W', '200W'],
      colors: ['Black'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      ]
    },
    {
      title: 'Solar Panel 600W Tier-1',
      price: '520.00',
      oldPrice: '600.00',
      rating: 4.9,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
      category: 'Solar Panels',
      brand: 'First Solar',
      description: 'Premium 600W tier-1 solar panel with industry-leading efficiency and reliability.',
      sizes: ['500W', '550W', '600W', '650W'],
      colors: ['Black', 'Silver'],
      images: [
        'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      ]
    },
    {
      title: 'Solar Panel 250W BudgetSeries',
      price: '160.00',
      oldPrice: '200.00',
      rating: 4.3,
      imageUrl: 'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      category: 'Solar Panels',
      brand: 'Yingli Solar',
      description: 'Affordable 250W solar panel offering excellent value for residential installations.',
      sizes: ['200W', '250W', '300W'],
      colors: ['Blue', 'Black'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
      ]
    },
    {
      title: 'Solar Panel 380W Half-CutCell',
      price: '290.00',
      oldPrice: '340.00',
      rating: 4.7,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      category: 'Solar Panels',
      brand: 'HanwhaQCELLS',
      description: 'Innovative 380W half-cutcell solar panel with reduced power losses and improved performance.',
      sizes: ['320W', '350W', '380W', '420W'],
      colors: ['Black', 'Silver', 'Blue'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
        'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      ]
    },
    {
      title: 'Solar Panel 550W CommercialGrade',
      price: '480.00',
      oldPrice: '560.00',
      rating: 4.8,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
      category: 'Solar Panels',
      brand: 'JASolar',
      description: 'Heavy-duty 550W commercial-grade solar panel designed for large-scale installations.',
      sizes: ['450W', '500W', '550W', '600W'],
      colors: ['Black', 'Silver'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      ]
    },
    {
      title: 'Solar Panel 150W Portable',
      price: '140.00',
      oldPrice: '170.00',
      rating: 4.5,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
      category: 'Solar Panels',
      brand: 'GoalZero',
      description: 'Compact 150W portable solar  panel with foldable design for camping and out door use.',
      sizes: ['100W', '150W', '200W'],
      colors: ['Black', 'Green'],
      images: [
        'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      ]
    },
    {
      title: 'Solar Panel 420WAll-Black',
      price: '360.00',
      oldPrice: '420.00',
      rating: 4.8,
      imageUrl: 'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      category: 'Solar Panels',
      brand: 'SunPower',
      description: 'Sleek 420W all-black solar panel with premium aesthetics and highe fficiency.',
      sizes: ['350W', '380W', '420W', '450W'],
      colors: ['Black'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
      ]
    },
    {
      title: 'Solar Panel 320W ThinFilm',
      price: '240.00',
      oldPrice: '290.00',
      rating: 4.4,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      category: 'Solar Panels',
      brand: 'Sharp Solar',
      description: 'Advanced 320W thin-film solar panel with excellent low-light performance.',
      sizes: ['280W', '300W', '320W', '350W'],
      colors: ['Black', 'Blue'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
        'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      ]
    },
    {
      title: 'Solar Panel 480W HighOutput',
      price: '410.00',
      oldPrice: '480.00',
      rating: 4.7,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
      category: 'Solar Panels',
      brand: 'RECSolar',
      description: 'High-output 480W solar panel with advanced cell technology and superior performance.',
      sizes: ['400W', '440W', '480W', '520W'],
      colors: ['Black', 'Silver'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      ]
    },
    {
      title: 'Solar Panel 180W MarineGrade',
      price: '200.00',
      oldPrice: '240.00',
      rating: 4.6,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
      category: 'Solar Panels',
      brand: 'Victron Energy',
      description: 'Marine-grade1 80W  solar panel with corrosion-resistant frame for boat installations.',
      sizes: ['120W', '150W', '180W', '220W'],
      colors: ['Blue', 'Black'],
      images: [
        'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      ]
    },
    {
      title: 'Solar Panel 650W MegaPower',
      price: '580.00',
      oldPrice: '650.00',
      rating: 4.9,
      imageUrl: 'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      category: 'Solar Panels',
      brand: 'SuntechPower',
      description: 'Ultra-high power 650W solar panel formaximum energy generation inlimited space.',
      sizes: ['550W', '600W', '650W', '700W'],
      colors: ['Black', 'Silver'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
      ]
    },
    {
      title: 'Solar Panel 270W Residential',
      price: '190.00',
      oldPrice: '230.00',
      rating: 4.5,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      category: 'Solar Panels',
      brand: 'KyoceraSolar',
      description: 'Reliable 270W residential solar panel with provent rack record and solid warranty.',
      sizes: ['240W', '270W', '300W', '330W'],
      colors: ['Blue', 'Black', 'Silver'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
        'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      ]
    },
    {
      title: 'Solar Panel 390W PremiumEfficiency',
      price: '330.00',
      oldPrice: '390.00',
      rating: 4.8,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
      category: 'Solar Panels',
      brand: 'PanasonicSolar',
      description: 'Premium 390W solar panel with industry-leading efficiency and temperature coefficient.',
      sizes: ['330W', '360W', '390W', '420W'],
      colors: ['Black', 'Silver'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      ]
    },
    {
      title: 'Solar Panel 125W Off-Grid',
      price: '110.00',
      oldPrice: '140.00',
      rating: 4.3,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
      category: 'Solar Panels',
      brand: 'AIMSPower',
      description: 'Compact 125W solar panel ideal for off-grid cabinsandsmall powery stems.',
      sizes: ['75W', '100W', '125W', '160W'],
      colors: ['Blue', 'Black'],
      images: [
        'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      ]
    },
    {
      title: 'Solar Panel 520W DualGlass',
      price: '460.00',
      oldPrice: '520.00',
      rating: 4.9,
      imageUrl: 'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      category: 'Solar Panels',
      brand: 'SeraphimSolar',
      description: 'Advanced 520W dual-glass solar panel with enhanced durability and 30-year warranty.',
      sizes: ['450W', '480W', '520W', '560W'],
      colors: ['Black', 'Silver'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-175.jpg',
      ]
    },
    {
      title: 'Solar Panel 340W Mid-Range',
      price: '260.00',
      oldPrice: '310.00',
      rating: 4.6,
      imageUrl: 'https://img.freepik.com/free-psd/solar-power-boards-roof-3d-realistic-render_625553-338.jpg',
      category: 'Solar Panels',
      brand: 'AstronergySolar',
      description: 'Well-balanced 340W solar panel offering good performance at competitive pricing.',
      sizes: ['300W', '320W', '340W', '370W'],
      colors: ['Black', 'Blue', 'Silver'],
      images: [
        'https://img.freepik.com/free-psd/solar-power-boards-3d-realistic-render_625553-173.jpg',
        'https://img.freepik.com/free-psd/highefficiency-solar-panel-array-clean-energy-solution_191095-79165.jpg',
      ]
    }
  ];

  // Insert Products with relations
  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        title: product.title,
        description: product.description,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        oldPrice: typeof product.oldPrice === 'string' ? parseFloat(product.oldPrice) : product.oldPrice,
        rating: product.rating,
        imageUrl: product.imageUrl,
        brand: product.brand,
        categoryId: solarPanelsCategory.id,
        images: {
          create: product.images.map((url) => ({ url })),
        },
        sizes: {
          create: product.sizes.map((size) => ({ size })),
        },
        colors: {
          create: product.colors.map((color) => ({ color })),
        },
      },
    });
    createdProducts.push(created);
    console.log(`✅ Created product: ${created.title}`);
  }




  // User-dependent seeding 
  const user = await prisma.user.findFirst();
  if (user) {
    await prisma.review.createMany({
      data: [
        {
          productId: createdProducts[0].id,
          userId: user.id,
          rating: 5,
          comment: "Excellent solar panel, powers my home perfectly!",
        },
        {
          productId: createdProducts[1].id,
          userId: user.id,
          rating: 4,
          comment: "Solid inverter, but a bit pricey.",
        },
      ],
    });

    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
        items: {
          create: [
            { productId: createdProducts[0].id, quantity: 2, size: "350W", color: "Black" },
            { productId: createdProducts[1].id, quantity: 1, size: "5kVA", color: "White" },
          ],
        },
      },
      include: { items: true },
    });

    console.log("🛒 Cart created:", cart.id);
  } else {
    console.log("⚠️ No user found, skipping reviews and cart.");
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
