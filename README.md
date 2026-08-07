# 🛒 ShopEZ - Full Stack MERN E-Commerce Application

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern full-stack E-Commerce application built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. ShopEZ provides a complete online shopping experience with secure authentication, responsive UI, product management, shopping cart functionality, order processing, and an admin dashboard.

---

## 🔗 Live Demo

🌐 **Application**

https://shopez-ecommerce-website.onrender.com

📄 **Project Documentation**

https://drive.google.com/drive/folders/1oOctg48svuHSVL19nglW-GU9bB3DBacC

---

# 📖 Table of Contents

- Introduction
- Project Overview
- Features
- Technology Stack
- System Architecture
- Project Structure
- Installation
- Environment Variables
- Running the Application
- API Endpoints
- Authentication
- Deployment
- Screenshots
- Testing
- Future Enhancements
- License

---

# 📌 Introduction

## Project Title

**ShopEZ - MERN E-Commerce Application**

ShopEZ is a secure, scalable, and responsive full-stack e-commerce platform that enables users to browse products, search and filter items, manage shopping carts, place orders, and download invoices. Administrators can efficiently manage products, users, and customer orders through a dedicated admin dashboard.

---

# 🎯 Project Objectives

- Build a complete MERN Stack application.
- Implement secure JWT authentication.
- Provide a responsive shopping experience.
- Simplify product and order management.
- Deliver a modern and intuitive user interface.
- Follow REST API architecture and best development practices.

---

# ✨ Features

## Customer Features

- User Registration
- Secure Login (JWT Authentication)
- User Profile Management
- Browse Products
- Search Products
- Category Filtering
- Brand Filtering
- Product Sorting
- Product Details
- Shopping Cart
- Wishlist
- Address Management
- Checkout Process
- Order Placement
- Order History
- Download PDF Invoice
- Dark / Light Theme
- Responsive Design

---

## Admin Features

- Admin Dashboard
- Product Management
- Category Management
- User Management
- Order Management
- Protected Admin Routes

---

## Security Features

- JWT Authentication
- Password Encryption using bcrypt
- Protected Routes
- Token Validation
- Role-Based Authorization

---

# 🛠 Technology Stack

## Frontend

- React 18
- Vite
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS
- React Toastify
- Lucide React
- Radix UI

---

## Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcryptjs
- Cloudinary

---

## Database

- MongoDB Atlas
- Mongoose ODM

---

# 🏗 System Architecture

```
React + Vite
       │
       │ Axios API Calls
       ▼
Express REST API
       │
JWT Authentication
       │
Mongoose ODM
       │
MongoDB Atlas
```

---

# 📂 Project Structure

```
ShopEZ-Ecommerce-Website
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── store
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── utils
│   │   ├── assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── helpers
│   ├── uploads
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙ Installation

## Prerequisites

- Node.js (v18+ Recommended)
- npm
- MongoDB Atlas Account
- Git

---

## Clone Repository

```bash
git clone https://github.com/Karthikeyan-gv/shopez-ecommerce-website.git

cd shopez-ecommerce-website
```

---

## Backend Setup

```bash
cd server

npm install
```

Create a **.env**

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

CLIENT_BASE_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Start backend

```bash
npm start
```

Backend runs at

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 🔐 Authentication

Authentication is implemented using **JSON Web Tokens (JWT).**

Authentication Flow

1. User Registration
2. Password Hashing using bcrypt
3. User Login
4. JWT Token Generation
5. Token Storage
6. Protected Route Verification
7. Authorization Middleware
8. Role-Based Access Control

Roles

- Customer
- Administrator

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint | Description |
|----------|-----------------------------|-------------------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| GET | /api/auth/check-auth | Validate JWT |
| POST | /api/auth/logout | Logout |

---

## Products

| Method | Endpoint |
|----------|---------------------------|
| GET | /api/shop/products/get |
| GET | /api/shop/products/get/:id |

---

## Cart

| Method | Endpoint |
|----------|------------------------------|
| POST | /api/shop/cart/add |
| GET | /api/shop/cart/get/:userId |
| PUT | /api/shop/cart/update-cart |
| DELETE | /api/shop/cart/delete/:userId/:productId |

---

## Orders

| Method | Endpoint |
|----------|------------------------------|
| POST | /api/shop/order/create |
| GET | /api/shop/order/list/:userId |
| GET | /api/shop/order/details/:id |

---

# 🚀 Deployment

The project is deployed on **Render**.

## Backend

- Node Environment
- Express Server
- MongoDB Atlas
- Cloudinary

## Frontend

- Static Site
- React + Vite

---

# 🧪 Testing

Testing Performed

- Functional Testing
- API Testing
- Authentication Testing
- UI Testing
- Integration Testing
- Manual Testing

Tools

- Postman
- MongoDB Atlas
- Visual Studio Code
- Google Chrome

---

# 📸 Screenshots

Add screenshots here.

Example

```
screenshots/
│
├── Home.png
├── Login.png
├── Product.png
├── Cart.png
├── Checkout.png
├── Orders.png
├── AdminDashboard.png
```

---

# 🚀 Future Enhancements

- AI Product Recommendation
- Inventory Analytics
- Mobile Application
- Multi-language Support
- Social Login
- Live Order Tracking
- Sales Dashboard
- Multi-vendor Marketplace
- Payment Gateway Enhancements

---

# 📄 Project Report

https://drive.google.com/drive/folders/1oOctg48svuHSVL19nglW-GU9bB3DBacC

---

# 💻 GitHub Repository

https://github.com/Karthikeyan-gv/shopez-ecommerce-website

---

# 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Karthikeyan G**

GitHub

https://github.com/Karthikeyan-gv
