import { prisma } from "./db/prisma.js";

async function main() {
 await prisma.product.createMany({
  data: [
    {
      title: "Monocrystalline Solar Panel 200W",
      price: 150,
      oldPrice: 200,
      rating: 4.5,
      imageUrl: "https://example.com/panel1.jpg",
      category: "Residential",
      brand: "SunPower",
      isNew: true,
      isPopular: true,
      efficiency: 21.5,
    },
    {
      title: "Portable Solar Charger 50W",
      price: 50,
      oldPrice: 80,
      rating: 4.2,
      imageUrl: "https://example.com/charger.jpg",
      category: "Portable",
      brand: "EcoCharge",
      efficiency: 20,
      isPortable: true,
      inStock: true,
    },
  ],
});
}

main()
  .then(() => {
    console.log("✅ Database seeded");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
