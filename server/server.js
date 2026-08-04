require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors"); 

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");

const app = express();
const PORT = process.env.PORT || 10000; 
const MONGO_URL = process.env.MONGO_URL;

// Path to the built frontend (when running as a single service)
const clientDistPath = path.join(__dirname, "../client/dist");

if (!MONGO_URL) {
  console.error("❌ MONGO_URL is not defined in .env file. Exiting...");
  process.exit(1);
}

// CORS configuration - filter out any undefined entries
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_BASE_URL,
  "https://shopez-ecommerce-website.onrender.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins, 
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });

// Test route - serves the frontend build if present (single-service mode),
// otherwise returns the API status JSON (two-service mode).
app.get("/", (req, res) => {
  const indexHtml = path.join(clientDistPath, "index.html");
  if (require("fs").existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  res.json({ success: true, message: "Shopez API is running" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Routes - ALL HAVE /api prefix
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

// Serve the built frontend (single-service deployment). If the client build exists,
// serve static assets and fall back to index.html for client-side routes (SPA).
if (require("fs").existsSync(clientDistPath)) {
  console.log("📦 Serving frontend build from", clientDistPath);
  app.use(express.static(clientDistPath));

  // SPA fallback: any non-API GET request that doesn't match a file gets index.html
  app.get(/^(?!\/api|\/assets).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () =>
  console.log(`🚀 Server is now running on port ${PORT}`)
);
