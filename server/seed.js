/**
 * Seed script for ShopEZ Ecommerce
 * Creates admin user, sample products, and feature images
 *
 * Usage: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
const Feature = require("./models/Feature");

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ MONGO_URL is not defined in .env file. Exiting...");
  process.exit(1);
}

const ADMIN = {
  userName: "admin",
  email: "admin@gmail.com",
  password: "admin",
  role: "admin",
};

const SAMPLE_PRODUCTS = [
  // ==================== MEN ====================
  {
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    title: "Nike Dri-FIT Training Tee",
    description:
      "Moisture-wicking training t-shirt with breathable mesh panels for all-day comfort during intense workouts.",
    category: "men",
    brand: "nike",
    price: 34.99,
    salePrice: 24.99,
    totalStock: 120,
  },
  {
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80",
    title: "Nike Club Fleece Joggers",
    description:
      "Relaxed-fit joggers made from soft brushed-back fleece with elastic cuffs and side pockets.",
    category: "men",
    brand: "nike",
    price: 59.99,
    salePrice: 44.99,
    totalStock: 85,
  },
  {
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    title: "Adidas Originals Hoodie",
    description:
      "Classic pullover hoodie with kangaroo pocket, adjustable drawstring hood, and soft cotton blend fabric.",
    category: "men",
    brand: "adidas",
    price: 69.99,
    salePrice: 49.99,
    totalStock: 95,
  },
  {
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80",
    title: "Adidas Tiro Track Pants",
    description:
      "Iconic track pants with slim tapered fit, zippered ankles, and moisture-absorbing AEROREADY technology.",
    category: "men",
    brand: "adidas",
    price: 44.99,
    salePrice: 34.99,
    totalStock: 110,
  },
  {
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80",
    title: "Puma Essentials Sweatshirt",
    description:
      "Cozy crew-neck sweatshirt with raglan sleeves and a soft fleece lining, perfect for casual wear.",
    category: "men",
    brand: "puma",
    price: 39.99,
    salePrice: 0,
    totalStock: 75,
  },
  {
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80",
    title: "Puma TeamLIGA Training Shorts",
    description:
      "Lightweight mesh shorts with elastic waistband and side vents for maximum mobility during training.",
    category: "men",
    brand: "puma",
    price: 24.99,
    salePrice: 17.99,
    totalStock: 140,
  },
  {
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    title: "Levi's 501 Original Fit Jeans",
    description:
      "The iconic straight-leg jeans in durable denim with a timeless five-pocket styling.",
    category: "men",
    brand: "levi",
    price: 79.99,
    salePrice: 59.99,
    totalStock: 90,
  },
  {
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80",
    title: "Levi's Trucker Denim Jacket",
    description:
      "The classic denim trucker jacket with chest pockets and adjustable waist tabs, built to last.",
    category: "men",
    brand: "levi",
    price: 89.99,
    salePrice: 0,
    totalStock: 55,
  },
  {
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    title: "Zara Men's Slim Fit Blazer",
    description:
      "Sharp slim-fit blazer crafted from premium stretch fabric, perfect for office and evening wear.",
    category: "men",
    brand: "zara",
    price: 129.99,
    salePrice: 99.99,
    totalStock: 35,
  },
  {
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    title: "H&M Men's Linen Shirt",
    description:
      "Breathable pure linen shirt with a relaxed fit, ideal for warm weather and smart-casual looks.",
    category: "men",
    brand: "h&m",
    price: 29.99,
    salePrice: 19.99,
    totalStock: 130,
  },

  // ==================== WOMEN ====================
  {
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
    title: "Nike Pro Women's Leggings",
    description:
      "High-waist leggings with Dri-FIT fabric and a compressive fit that moves with you through every rep.",
    category: "women",
    brand: "nike",
    price: 54.99,
    salePrice: 39.99,
    totalStock: 100,
  },
  {
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80",
    title: "Nike Women's Dri-FIT Sports Bra",
    description:
      "Medium-support sports bra with adjustable straps and moisture-wicking fabric for training sessions.",
    category: "women",
    brand: "nike",
    price: 42.99,
    salePrice: 32.99,
    totalStock: 80,
  },
  {
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    title: "Adidas Women's Training Top",
    description:
      "Breathable training top with a flattering silhouette and stretch fabric for freedom of movement.",
    category: "women",
    brand: "adidas",
    price: 36.99,
    salePrice: 26.99,
    totalStock: 95,
  },
  {
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a4e7d8?w=600&q=80",
    title: "Puma Women's Essentials Joggers",
    description:
      "Soft fleece joggers with an adjustable drawstring waist and tapered leg for relaxed comfort.",
    category: "women",
    brand: "puma",
    price: 44.99,
    salePrice: 0,
    totalStock: 70,
  },
  {
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
    title: "Levi's Women's Skinny Jeans",
    description:
      "Flattering high-rise skinny jeans in stretch denim that holds its shape all day long.",
    category: "women",
    brand: "levi",
    price: 74.99,
    salePrice: 54.99,
    totalStock: 85,
  },
  {
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    title: "Zara Floral Midi Dress",
    description:
      "Elegant floral midi dress with a flattering A-line cut and delicate details, perfect for any occasion.",
    category: "women",
    brand: "zara",
    price: 79.99,
    salePrice: 59.99,
    totalStock: 60,
  },
  {
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80",
    title: "Zara Women's Silk Blouse",
    description:
      "Luxurious silk-feel blouse with a relaxed fit and elegant drape, easily dressed up or down.",
    category: "women",
    brand: "zara",
    price: 49.99,
    salePrice: 0,
    totalStock: 65,
  },
  {
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    title: "H&M Women's Cardigan",
    description:
      "Cozy long-sleeve cardigan in a soft knit with button-front closure and ribbed trims.",
    category: "women",
    brand: "h&m",
    price: 34.99,
    salePrice: 24.99,
    totalStock: 105,
  },
  {
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&q=80",
    title: "H&M Ribbed Tank Top",
    description:
      "Essential ribbed tank top with a fitted silhouette, perfect for layering or solo wear.",
    category: "women",
    brand: "h&m",
    price: 12.99,
    salePrice: 9.99,
    totalStock: 200,
  },
  {
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a4e7d8?w=600&q=80",
    title: "Zara Satin Midi Skirt",
    description:
      "Sleek satin midi skirt with a high waist and smooth flow, adding polish to any outfit.",
    category: "women",
    brand: "zara",
    price: 59.99,
    salePrice: 44.99,
    totalStock: 50,
  },

  // ==================== KIDS ====================
  {
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
    title: "H&M Kids Graphic Tee",
    description:
      "Fun and colorful graphic t-shirt for kids made from soft organic cotton, machine washable.",
    category: "kids",
    brand: "h&m",
    price: 12.99,
    salePrice: 9.99,
    totalStock: 150,
  },
  {
    image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600&q=80",
    title: "Adidas Kids Tracksuit",
    description:
      "Comfy 2-piece tracksuit with moisture-wicking fabric and a sporty look kids will love.",
    category: "kids",
    brand: "adidas",
    price: 44.99,
    salePrice: 34.99,
    totalStock: 80,
  },
  {
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600&q=80",
    title: "Nike Kids Running Shoes",
    description:
      "Lightweight, flexible kids running shoes with a hook-and-loop strap for easy on and off.",
    category: "kids",
    brand: "nike",
    price: 54.99,
    salePrice: 39.99,
    totalStock: 75,
  },
  {
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=80",
    title: "Adidas Kids Football",
    description:
      "Durable size-4 football with machine-stitched panels for great feel and control on the pitch.",
    category: "kids",
    brand: "adidas",
    price: 19.99,
    salePrice: 14.99,
    totalStock: 120,
  },
  {
    image: "https://images.unsplash.com/photo-1559454403-b8fb46f8b0ba?w=600&q=80",
    title: "H&M Soft Plush Teddy Bear",
    description:
      "Extra-soft plush teddy bear with embroidered eyes, safe for all ages and perfect for cuddles.",
    category: "kids",
    brand: "h&m",
    price: 24.99,
    salePrice: 0,
    totalStock: 90,
  },
  {
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
    title: "Levi's Kids Denim Overall",
    description:
      "Classic kid-friendly denim overalls with adjustable straps and roomy pockets for adventure.",
    category: "kids",
    brand: "levi",
    price: 39.99,
    salePrice: 29.99,
    totalStock: 60,
  },
  {
    image: "https://images.unsplash.com/photo-1595498045019-6021b7a08241?w=600&q=80",
    title: "Zara Kids Casual Dress",
    description:
      "Charming casual dress for girls with a playful print and soft breathable fabric.",
    category: "kids",
    brand: "zara",
    price: 29.99,
    salePrice: 22.99,
    totalStock: 70,
  },
{
    image: "https://images.unsplash.com/photo-1612196808214-b7e239e5e6b6?w=600&q=80",
    title: "H&M Kids Pajama Set",
    description:
      "Snug and soft pajama set with a playful pattern, keeping little ones comfy all night.",
    category: "kids",
    brand: "h&m",
    price: 17.99,
    salePrice: 12.99,
    totalStock: 110,
  },
{
    image: "https://images.unsplash.com/photo-1560339760-6502ccb6b0ec?w=600&q=80",
    title: "Puma Kids Slip-On Sneakers",
    description:
      "Easy on-and-off slip-on sneakers for kids with a flexible sole and cushioned collar for all-day play.",
    category: "kids",
    brand: "puma",
    price: 34.99,
    salePrice: 24.99,
    totalStock: 85,
  },
  {
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&q=80",
    title: "Nike Kids Hooded Jacket",
    description:
      "Warm and cozy hooded jacket for kids with a soft fleece lining and durable water-repellent shell.",
    category: "kids",
    brand: "nike",
    price: 49.99,
    salePrice: 39.99,
    totalStock: 65,
  },

  // ==================== FOOTWEAR ====================
  {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    title: "Nike Air Zoom Pegasus 40",
    description:
      "Responsive everyday running shoe with Nike Air Zoom cushioning and a breathable mesh upper.",
    category: "footwear",
    brand: "nike",
    price: 129.99,
    salePrice: 99.99,
    totalStock: 60,
  },
  {
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    title: "Nike Revolution 6 Running Shoes",
    description:
      "Soft and smooth running shoes with plush foam cushioning and a lightweight knit upper.",
    category: "footwear",
    brand: "nike",
    price: 74.99,
    salePrice: 54.99,
    totalStock: 85,
  },
  {
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    title: "Adidas Ultraboost Light",
    description:
      "Premium running shoes with energy-returning BOOST cushioning and a sock-like Primeknit fit.",
    category: "footwear",
    brand: "adidas",
    price: 179.99,
    salePrice: 139.99,
    totalStock: 40,
  },
  {
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    title: "Adidas Samba Classic Sneakers",
    description:
      "Timeless clean white leather sneakers with the iconic gum sole and low-profile silhouette.",
    category: "footwear",
    brand: "adidas",
    price: 99.99,
    salePrice: 79.99,
    totalStock: 55,
  },
  {
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
    title: "Puma RS-X Retro Sneakers",
    description:
      "Chunky retro-inspired sneakers with premium materials and all-day cloud comfort.",
    category: "footwear",
    brand: "puma",
    price: 94.99,
    salePrice: 74.99,
    totalStock: 65,
  },
  {
    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&q=80",
    title: "Puma Slipstream Lo Sneakers",
    description:
      "Vintage basketball-inspired low-top sneakers in rich leather with clean classic lines.",
    category: "footwear",
    brand: "puma",
    price: 84.99,
    salePrice: 0,
    totalStock: 45,
  },
  {
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    title: "Zara Block Heel Sandals",
    description:
      "Elegant block heel sandals with a cushioned footbed and modern ankle strap design.",
    category: "footwear",
    brand: "zara",
    price: 64.99,
    salePrice: 49.99,
    totalStock: 50,
  },
  {
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
    title: "Zara Pointed Toe Heels",
    description:
      "Sophisticated pointed toe heels with a sleek silhouette, perfect for formal occasions.",
    category: "footwear",
    brand: "zara",
    price: 54.99,
    salePrice: 39.99,
    totalStock: 70,
  },
  {
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80",
    title: "H&M Leather Loafers",
    description:
      "Classic slip-on loafers in smooth leather with a versatile design that goes with everything.",
    category: "footwear",
    brand: "h&m",
    price: 49.99,
    salePrice: 0,
    totalStock: 55,
  },
  {
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
    title: "H&M Summer Sandals",
    description:
      "Comfortable everyday sandals with adjustable straps and cushioned soles for long walks.",
    category: "footwear",
    brand: "h&m",
    price: 19.99,
    salePrice: 14.99,
    totalStock: 130,
  },

  // ==================== ACCESSORIES ====================
  {
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    title: "Nike Heritage Backpack",
    description:
      "Durable everyday backpack with padded laptop sleeve, zip pockets, and a roomy main compartment.",
    category: "accessories",
    brand: "nike",
    price: 49.99,
    salePrice: 39.99,
    totalStock: 90,
  },
  {
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    title: "Nike Sportswear Cap",
    description:
      "Classic low-profile cap with a curved brim and adjustable snapback closure.",
    category: "accessories",
    brand: "nike",
    price: 24.99,
    salePrice: 19.99,
    totalStock: 140,
  },
  {
    image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600&q=80",
    title: "Adidas Classic Duffel Bag",
    description:
      "Spacious duffel bag for gym and travel with a ventilated shoe compartment and adjustable strap.",
    category: "accessories",
    brand: "adidas",
    price: 59.99,
    salePrice: 44.99,
    totalStock: 60,
  },
  {
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80",
    title: "Puma Logo Baseball Cap",
    description:
      "Sporty baseball cap in breathable woven fabric with embroidered Puma logo detailing.",
    category: "accessories",
    brand: "puma",
    price: 19.99,
    salePrice: 14.99,
    totalStock: 160,
  },
  {
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80",
    title: "Levi's Genuine Leather Belt",
    description:
      "Classic genuine leather belt with a brushed metal buckle, available in multiple sizes.",
    category: "accessories",
    brand: "levi",
    price: 34.99,
    salePrice: 0,
    totalStock: 100,
  },
  {
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    title: "Zara Leather Handbag",
    description:
      "Structured leather handbag with a top zip closure, interior pockets, and detachable strap.",
    category: "accessories",
    brand: "zara",
    price: 89.99,
    salePrice: 69.99,
    totalStock: 40,
  },
  {
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    title: "Zara Aviator Sunglasses",
    description:
      "Stylish aviator sunglasses with UV400 protection and a lightweight metal frame.",
    category: "accessories",
    brand: "zara",
    price: 29.99,
    salePrice: 22.99,
    totalStock: 110,
  },
  {
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
    title: "H&M Knitted Beanie Hat",
    description:
      "Warm knitted beanie in a soft acrylic blend, perfect for keeping cozy in cold weather.",
    category: "accessories",
    brand: "h&m",
    price: 14.99,
    salePrice: 9.99,
    totalStock: 150,
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    title: "H&M Classic Wrist Watch",
    description:
      "Minimalist analog wristwatch with a stainless steel case and genuine leather strap.",
    category: "accessories",
    brand: "h&m",
    price: 39.99,
    salePrice: 29.99,
    totalStock: 55,
  },
  {
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    title: "Adidas Training Water Bottle",
    description:
      "BPA-free 750ml sports bottle with a leak-proof cap and easy-grip silicone sleeve.",
    category: "accessories",
    brand: "adidas",
    price: 14.99,
    salePrice: 11.99,
    totalStock: 200,
  },
  {
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80",
    title: "Nike Everyday Cushioned Socks (3-Pack)",
    description:
      "Moisture-wicking crew socks with targeted cushioning, reinforced heel, and toe for lasting comfort.",
    category: "accessories",
    brand: "nike",
    price: 16.99,
    salePrice: 12.99,
    totalStock: 180,
  },
  {
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80",
    title: "Levi's Canvas Tote Bag",
    description:
      "Everyday canvas tote with a reinforced base and interior pocket, sturdy enough for groceries.",
    category: "accessories",
    brand: "levi",
    price: 22.99,
    salePrice: 0,
    totalStock: 95,
  },
];

const SAMPLE_FEATURES = [
  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB Connected");

    // Clear existing data (safe to re-run)
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Feature.deleteMany({}),
      require("./models/Cart").deleteMany({}),
      require("./models/Address").deleteMany({}),
      require("./models/Order").deleteMany({}),
      require("./models/Review").deleteMany({}),
    ]);
    console.log("🧹 Cleared existing data");

    // Create admin user
    const hashPassword = await bcrypt.hash(ADMIN.password, 12);
    await User.create({
      userName: ADMIN.userName,
      email: ADMIN.email,
      password: hashPassword,
      role: ADMIN.role,
    });
    console.log("👤 Admin user created:", ADMIN.email, "/", ADMIN.password);

// Drop any stale unique index (e.g. sku) that may conflict with the current schema
    try {
      await Product.collection.dropIndex("sku_1");
      console.log("🧹 Dropped stale sku unique index");
    } catch (e) {
      // index may not exist; ignore
    }

    // Create sample products
    await Product.insertMany(SAMPLE_PRODUCTS);
    console.log(`📦 Created ${SAMPLE_PRODUCTS.length} sample products`);

    // Create feature images
    await Feature.insertMany(SAMPLE_FEATURES);
    console.log(`🖼️  Created ${SAMPLE_FEATURES.length} feature images`);

    console.log("\n✅ Seed completed successfully!");
    console.log("Admin login -> email:", ADMIN.email, "| password:", ADMIN.password);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
