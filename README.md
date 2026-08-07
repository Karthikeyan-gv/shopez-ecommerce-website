# ShopEZ — Modern Full-Stack E-Commerce Platform

Live Link: https://shopez-ecommerce-website.onrender.com
Project Report(Drive link): https://drive.google.com/drive/folders/1oOctg48svuHSVL19nglW-GU9bB3DBacC?usp=sharing

**ShopEZ** is a modern, high-performance full-stack MERN e-commerce application designed with an **Enterprise Obsidian Indigo & Glassmorphic UI**, instant cart synchronization, inline friction-free purchase workflows, and comprehensive order invoice capabilities.

---

## 🌟 Key Features

### 🛍️ Shopping Experience
- **Enterprise Design System**: Designed with an Ultra-Clean Slate & Obsidian Indigo color palette, featuring glassmorphic components and smooth 60FPS scroll performance.
- **Dark / Light Mode**: Seamless theme switcher persisted across user sessions.
- **Inline Purchase Workflow**: Unauthenticated visitors clicking *Add to Cart* or *Buy Now* are prompted with an inline auth modal, automatically resuming cart addition and redirecting to checkout upon login.
- **Instant Wishlist**: Save favorite items locally with real-time header badges.
- **Interactive Product Catalog**: Real-time category filtering (Men, Women, Kids, Footwear, Accessories), brand selection, price sorting, and instant search.
- **Product Details & Reviews**: Full dialog view with star rating breakdowns, image zoom, and live customer reviews.

### 💳 Checkout & Invoice System
- **Address Manager**: Add, edit, select, and manage shipping addresses.
- **Instant Order Checkout**: Simulated and Stripe/PayPal integration options with real-time order confirmation.
- **Printable Invoices**: Generate and download formatted PDF invoices directly from the Order Details view or payment success screen.

### 🔐 Authentication & Security
- Secure JWT-based authentication (Login, Register, Session check).
- Redux Toolkit state persistence with automatic token validation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, Tailwind CSS, Lucide React, Radix UI Primitives, React Toastify |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose ODM |
| **Storage & Auth** | JWT (JSON Web Tokens), Cloudinary (Image Uploads), bcryptjs |

---

## 📁 Repository Structure

```
ShopEz-Ecommerce-Website-main/
├── client/                      # Vite + React Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI & Shopping Components
│   │   │   ├── admin-view/      # Admin Dashboard Components
│   │   │   ├── common/         # Auth Modal, Forms, CheckAuth, Star Ratings
│   │   │   ├── shopping-view/  # Header, Footer, Tiles, Order Details, Invoice
│   │   │   └── ui/             # Radix UI Primitives (Button, Dialog, Sheet, etc.)
│   │   ├── pages/               # Application Pages (Home, Listing, Search, Account, Auth)
│   │   ├── store/               # Redux Slices (Auth, Cart, Products, Orders, Address)
│   │   └── index.css            # Enterprise CSS Design System & Utility Classes
│   └── package.json
└── server/                      # Express REST API Backend
    ├── controllers/             # Auth, Product, Cart, Order & Address Controllers
    ├── models/                  # Mongoose Schemas (User, Product, Cart, Order, Address)
    ├── routes/                  # Express API Routes
    ├── helpers/                 # Cloudinary Utilities
    ├── server.js                # Server Entry Point
    └── package.json
```

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas Connection URI)

---

### 1. Clone & Setup Environment

```bash
# Clone the repository
git clone https://github.com/Karthikeyan-gv/shopez-ecommerce-website.git
cd ShopEz-Ecommerce-Website-main
```

---

### 2. Configure Backend (`server`)

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shopez?retryWrites=true&w=majority
CLIENT_BASE_URL=http://localhost:5173
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
```

Install backend dependencies and start the API server:

```bash
cd server
npm install
npm start
# Server runs on http://localhost:5000
```

---

### 3. Configure Frontend (`client`)

Install frontend dependencies and start the Vite development server:

```bash
cd ../client
npm install
npm run dev
# App opens on http://localhost:5173
```

---

## 🔌 Primary API Endpoints

### 🔐 Auth Routes (`/api/auth`)
- `POST /api/auth/register` — Create a new user account
- `POST /api/auth/login` — Authenticate user and issue JWT token
- `GET /api/auth/check-auth` — Verify session status with Bearer token
- `POST /api/auth/logout` — Clear session token

### 🛍️ Shop Product Routes (`/api/shop/products`)
- `GET /api/shop/products/get` — Fetch product catalog with category/brand filters & sorting
- `GET /api/shop/products/get/:id` — Fetch detailed product information

### 🛒 Cart Routes (`/api/shop/cart`)
- `POST /api/shop/cart/add` — Add item to user cart
- `GET /api/shop/cart/get/:userId` — Fetch active cart contents
- `PUT /api/shop/cart/update-cart` — Update item quantity
- `DELETE /api/shop/cart/delete/:userId/:productId` — Remove item from cart

### 📦 Order Routes (`/api/shop/order`)
- `POST /api/shop/order/create` — Place a new order
- `GET /api/shop/order/list/:userId` — Fetch customer order history
- `GET /api/shop/order/details/:id` — Fetch specific order invoice details

---

## 🌐 Render Deployment Settings & Setup Guide

This project is configured with a **`render.yaml` Blueprint file** for zero-friction deployment on [Render.com](https://render.com).

### Method 1: Automatic Blueprint Deployment (Recommended)

1. **Push Code to GitHub**: Ensure your code is pushed to your GitHub repository.
2. **Log into Render**: Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** -> **Blueprints**.
3. **Connect Repository**: Select your GitHub repository (`Karthikeyan-gv/shopez-ecommerce-website`).
4. **Set Environment Variables**:
   - `MONGO_URL`: Your MongoDB Atlas Connection String (`mongodb+srv://...`).
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary Name.
   - `CLOUDINARY_API_KEY`: Cloudinary API Key.
   - `CLOUDINARY_API_SECRET`: Cloudinary API Secret.
5. **Click Apply**: Render will automatically build and deploy both the API Web Service (`shopez-api`) and Frontend Static Site (`shopez-storefront`).

---

### Method 2: Manual Dashboard Configuration

#### A. Backend Web Service (`shopez-api`)
- **Environment**: Node
- **Build Command**: `cd server && npm install`
- **Start Command**: `node server/server.js`
- **Health Check Path**: `/api/health`
- **Environment Variables**:
  - `PORT`: `10000`
  - `MONGO_URL`: `<your-mongodb-atlas-url>`
  - `JWT_SECRET`: `<your-jwt-secret>`
  - `CLIENT_BASE_URL`: `https://shopez-storefront.onrender.com` (Your Render Frontend URL)

#### B. Frontend Static Site (`shopez-storefront`)
- **Environment**: Static Site
- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `client/dist`
- **Rewrite Rules** (Single Page App routing):
  - **Source**: `/*`
  - **Destination**: `/index.html`
  - **Action**: Rewrite
- **Environment Variables**:
  - `VITE_API_URL`: `https://shopez-api.onrender.com` (Your Render API URL)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
