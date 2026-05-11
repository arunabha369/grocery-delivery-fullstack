<![CDATA[<div align="center">

# 🛒 InstaCart — Full-Stack Grocery Delivery Platform

A production-ready, end-to-end grocery delivery application with **three role-based portals** — Customer, Admin, and Delivery Partner — featuring real-time order tracking, Stripe payments, automated rider assignment, and email notifications.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [Project Structure](#-project-structure)
- [Background Jobs (Inngest)](#-background-jobs-inngest)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**InstaCart** is a full-stack grocery delivery platform that simulates a real-world e-commerce delivery system. It provides three distinct user interfaces:

| Portal | Description |
|--------|-------------|
| 🛍️ **Customer** | Browse products, search, add to cart, manage addresses, checkout via Stripe or COD, and track orders in real-time on an interactive map |
| 🔧 **Admin** | Dashboard with analytics, full product CRUD with image uploads, order management, delivery partner onboarding, and assignment |
| 🚚 **Delivery Partner** | Dedicated portal to view assigned deliveries, update order status, share live location, and complete delivery via OTP verification |

---

## ✨ Features

### 🛍️ Customer Portal
- **User Authentication** — Secure registration & login with JWT tokens (30-day expiry)
- **Product Browsing** — Browse by category (Fruits & Vegetables, Dairy & Eggs, Bakery, Beverages, Pantry Staples)
- **Search & Filter** — Real-time product search with category and organic filters
- **Shopping Cart** — Persistent cart with add/remove/quantity controls via slide-out sidebar
- **Flash Deals** — Dedicated page for discounted products with original vs. sale price display
- **Address Management** — Full CRUD for delivery addresses with geocoded lat/lng coordinates, map picker, and default address support
- **Checkout** — Dual payment support:
  - 💳 **Card (Stripe)** — Secure Stripe Checkout Sessions with webhook verification
  - 💵 **Cash on Delivery** — Direct order placement
- **My Orders** — Order history with status filters (All, Placed, Assigned, Out for Delivery, Delivered, Cancelled)
- **Real-Time Order Tracking** — Live map tracking via Leaflet with delivery partner location, status timeline, and delivery OTP display
- **Protected Routes** — Auth-gated pages for checkout, orders, and addresses

### 🔧 Admin Panel (`/admin`)
- **Dashboard Analytics** — At-a-glance stats: total orders, users, products, out-of-stock count, delivery partners, and recent orders
- **Product Management** — Create, edit, and delete products with:
  - Image upload via Cloudinary
  - Category, unit, price, original price, stock, organic flag, rating & review count
- **Order Management** — View all orders with customer & delivery partner details, assign riders, update order status
- **Delivery Partner Management** — Create partner accounts, toggle active/inactive status, edit partner profiles
- **Role-Based Access** — Admin status determined by email whitelist in environment variables (supports multiple admins)

### 🚚 Delivery Partner Portal (`/delivery`)
- **Partner Authentication** — Separate login flow with role-based JWT
- **Active Deliveries** — View assigned/in-progress orders with customer details
- **Status Updates** — Transition orders through: Assigned → Packed → Out for Delivery → Delivered
- **OTP Verification** — Complete delivery only after entering customer's OTP
- **Live Location Sharing** — Real-time GPS location updates pushed to the order
- **Delivery Cancellation** — Cancel with reason tracking in status history
- **Delivery History** — View completed and cancelled past deliveries

### ⚙️ Backend Automation (Inngest)
- **Auto-Assign Rider** — 5 minutes after order placement, automatically assigns an available delivery partner and generates a 6-digit OTP
- **Low Stock Alerts** — Sends styled HTML email to admin(s) when product stock falls below 10 units
- **Monthly Promotional Emails** — Cron job (1st of every month at 10 AM) sends personalized deal emails to all users, batched in groups of 10

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI library with latest hooks & concurrent features |
| TypeScript | 6.0 | Type safety across the entire frontend |
| Vite | 8 | Lightning-fast dev server & optimized builds |
| TailwindCSS | 4 | Utility-first CSS framework |
| React Router DOM | 7 | Client-side routing with nested layouts |
| Axios | 1.15 | HTTP client for API communication |
| Leaflet + React Leaflet | 1.9 / 5.0 | Interactive maps for order tracking |
| Lucide React | 1.8 | Beautiful, consistent icon library |
| React Hot Toast | 2.6 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 5 | Web framework for REST API |
| TypeScript | 6.0 | Type safety across the entire backend |
| Prisma ORM | 7 | Type-safe database access & migrations |
| Neon (PostgreSQL) | — | Serverless Postgres database |
| Stripe | 22 | Payment processing & webhooks |
| Cloudinary | 2.9 | Image upload & CDN hosting |
| Inngest | 4.2 | Background jobs, cron tasks & event-driven workflows |
| Nodemailer | 8.0 | Email delivery (SMTP via Brevo) |
| JWT (jsonwebtoken) | 9.0 | Authentication tokens |
| bcrypt | 6.0 | Password hashing |
| Multer | 2.1 | Multipart file upload handling |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vite + React 19)               │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   Customer   │  │    Admin     │  │   Delivery Partner     │ │
│  │   Portal     │  │    Panel     │  │   Portal               │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬─────────────┘ │
└─────────┼─────────────────┼─────────────────────┼───────────────┘
          │    Axios HTTP   │                     │
          ▼                 ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express 5 + TypeScript)             │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐   │
│  │  Auth    │  │ Products │  │  Orders  │  │   Delivery     │   │
│  │  Routes  │  │  Routes  │  │  Routes  │  │   Routes       │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬─────────┘   │
│       │              │             │               │             │
│       ▼              ▼             ▼               ▼             │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                   Controllers Layer                      │    │
│  └──────────────────────────┬───────────────────────────────┘    │
│                             │                                    │
│         ┌───────────────────┼──────────────────┐                 │
│         ▼                   ▼                  ▼                 │
│  ┌────────────┐     ┌─────────────┐    ┌──────────────┐         │
│  │  Prisma    │     │   Inngest   │    │   Stripe     │         │
│  │  (Neon DB) │     │  (Jobs)     │    │  (Payments)  │         │
│  └────────────┘     └─────────────┘    └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Cloudinary  │  │  Nodemailer  │  │    Multer    │           │
│  │  (Images)    │  │  (Emails)    │  │  (Uploads)   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

The application uses **PostgreSQL (Neon)** with **Prisma ORM**. Below is the entity-relationship model:

```
┌──────────────┐       ┌──────────────┐       ┌───────────────────┐
│     User     │       │    Address   │       │  DeliveryPartner  │
├──────────────┤       ├──────────────┤       ├───────────────────┤
│ id       (PK)│──┐    │ id       (PK)│       │ id           (PK) │
│ name         │  │    │ userId   (FK)│       │ name              │
│ email (uniq) │  ├───>│ label        │       │ email (uniq)      │
│ password     │  │    │ address      │       │ password          │
│ phone        │  │    │ city         │       │ phone             │
│ avatar       │  │    │ state        │       │ avatar            │
│ createdAt    │  │    │ zip          │       │ vehicleType       │
│ updatedAt    │  │    │ isDefault    │       │ isActive          │
└──────────────┘  │    │ lat          │       │ createdAt         │
                  │    │ lng          │       │ updatedAt         │
                  │    │ createdAt    │       └────────┬──────────┘
                  │    │ updatedAt    │                │
                  │    └──────────────┘                │
                  │                                    │
                  │    ┌──────────────┐                │
                  │    │    Order     │                │
                  │    ├──────────────┤                │
                  └───>│ userId   (FK)│                │
                       │ deliveryPartnerId (FK)│<──────┘
                       │ items      (JSON)     │
                       │ shippingAddress (JSON) │
                       │ paymentMethod         │
                       │ subtotal              │
                       │ deliveryFee           │
                       │ tax                   │
                       │ total                 │
                       │ status                │
                       │ statusHistory  (JSON) │
                       │ deliveryOtp           │
                       │ liveLocation   (JSON) │
                       │ isPaid                │
                       └──────────────┘

┌──────────────┐
│   Product    │
├──────────────┤
│ id       (PK)│
│ name         │
│ description  │
│ price        │
│ originalPrice│
│ image        │
│ category     │
│ unit         │
│ stock        │
│ isOrganic    │
│ rating       │
│ reviewCount  │
│ createdAt    │
│ updatedAt    │
└──────────────┘
```

### Order Status Flow

```
Placed → Confirmed → Assigned → Packed → Out for Delivery → Delivered
                                                           ↘ Cancelled
```

---

## 📡 API Reference

All routes are prefixed with `/api`.

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login and get JWT token | ❌ |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/products` | Get all products (with search, category, filter) | ❌ |
| `GET` | `/products/:id` | Get single product | ❌ |
| `POST` | `/products` | Create product (admin) | 🔒 Admin |
| `PUT` | `/products/:id` | Update product (admin) | 🔒 Admin |
| `DELETE` | `/products/:id` | Delete product (admin) | 🔒 Admin |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/orders` | Create order (COD or Stripe) | 🔒 User |
| `GET` | `/orders` | Get user's orders (with status filter) | 🔒 User |
| `GET` | `/orders/:id` | Get single order | 🔒 User |
| `GET` | `/orders/:id/location` | Get delivery live location | 🔒 User |
| `GET` | `/orders/all` | Get all orders (admin) | 🔒 Admin |
| `PUT` | `/orders/:id/status` | Update order status (admin) | 🔒 Admin |

### Addresses
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/addresses` | Get user's addresses | 🔒 User |
| `POST` | `/addresses` | Create address | 🔒 User |
| `PUT` | `/addresses/:id` | Update address | 🔒 User |
| `DELETE` | `/addresses/:id` | Delete address | 🔒 User |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/stats` | Get dashboard statistics | 🔒 Admin |
| `GET` | `/admin/delivery-partners` | List all delivery partners | 🔒 Admin |
| `POST` | `/admin/delivery-partners` | Create delivery partner | 🔒 Admin |
| `PUT` | `/admin/delivery-partners/:id` | Update delivery partner | 🔒 Admin |
| `PUT` | `/admin/orders/:id/assign` | Assign rider to order | 🔒 Admin |

### Delivery Partner
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/delivery/login` | Delivery partner login | ❌ |
| `GET` | `/delivery/my-deliveries` | Get assigned deliveries | 🔒 Partner |
| `GET` | `/delivery/my-deliveries/:id` | Get delivery detail | 🔒 Partner |
| `PUT` | `/delivery/my-deliveries/:id/status` | Update delivery status | 🔒 Partner |
| `PUT` | `/delivery/my-deliveries/:id/complete` | Complete with OTP | 🔒 Partner |
| `PUT` | `/delivery/my-deliveries/:id/cancel` | Cancel delivery | 🔒 Partner |
| `PUT` | `/delivery/my-deliveries/:id/location` | Update live location | 🔒 Partner |

### Uploads
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/upload` | Upload image to Cloudinary | 🔒 Admin |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/stripe` | Stripe payment webhook (handles `payment_intent.succeeded`, `payment_intent.canceled`, `payment_intent.payment_failed`) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **PostgreSQL** database ([Neon](https://neon.tech/) recommended for serverless)
- **Stripe** account for payment processing
- **Cloudinary** account for image hosting
- **Inngest** account for background job processing
- **Brevo (Sendinblue)** account for transactional emails (or any SMTP provider)

### Environment Variables

#### Server (`/server/.env`)

```env
# JWT Secret
JWT_SECRET="your_jwt_secret_here"

# Admin emails (comma-separated for multiple admins)
ADMIN_EMAILS="admin@example.com"

# Neon Database (PostgreSQL)
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Inngest
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"

# SMTP Credentials (Brevo / Sendinblue)
SENDER_EMAIL="your_sender_email"
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_password"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### Client (`/client/.env`)

```env
VITE_CURRENCY_SYMBOL="$"
VITE_BASE_URL="http://localhost:5000/api"
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arunabha369/grocery-delivery-fullstack.git
   cd grocery-delivery-fullstack
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Database Setup

1. **Generate Prisma client**
   ```bash
   cd server
   npx prisma generate
   ```

2. **Push schema to database**
   ```bash
   npx prisma db push
   ```

3. **Seed the database** (populates 27 sample grocery products)
   ```bash
   npm run seed
   ```

### Running Locally

1. **Start the backend server** (runs on `http://localhost:5000`)
   ```bash
   cd server
   npm run server    # development with nodemon hot-reload
   # or
   npm start         # production mode
   ```

2. **Start the frontend** (runs on `http://localhost:5173`)
   ```bash
   cd client
   npm run dev
   ```

3. **Start Inngest Dev Server** (for background jobs — optional)
   ```bash
   npx inngest-cli@latest dev
   ```

4. **Set up Stripe Webhooks** (for card payments — optional)
   ```bash
   stripe listen --forward-to localhost:5000/api/stripe
   ```

---

## 📁 Project Structure

```
grocery-delivery-fullstack/
│
├── client/                          # Frontend (React + Vite + TypeScript)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, icons, static files
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.tsx           # Navigation with search, cart & user menu
│   │   │   ├── Footer.tsx           # Site footer
│   │   │   ├── Banner.tsx           # Hero/promotional banner
│   │   │   ├── CartSidebar.tsx      # Slide-out shopping cart
│   │   │   ├── ProductCard.tsx      # Product display card
│   │   │   ├── FilterPanel.tsx      # Category & filter controls
│   │   │   ├── AddressCard.tsx      # Address display component
│   │   │   ├── AddressForm.tsx      # Address create/edit form
│   │   │   ├── ProtectedRoute.tsx   # Auth route guard
│   │   │   ├── Loading.tsx          # Loading spinner
│   │   │   ├── Home/               # Homepage sub-components
│   │   │   ├── Checkout/           # Checkout sub-components
│   │   │   ├── OrderTracking/      # Order tracking sub-components
│   │   │   └── Delivery/           # Delivery partner sub-components
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.tsx      # Authentication state & methods
│   │   │   └── CartContext.tsx      # Shopping cart state & methods
│   │   ├── config/                  # API client configuration
│   │   ├── pages/                   # Page-level components
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Products.tsx         # Product listing with filters
│   │   │   ├── ProductPage.tsx      # Single product detail page
│   │   │   ├── SearchResults.tsx    # Search results page
│   │   │   ├── FlashDeals.tsx       # Discounted products page
│   │   │   ├── Login.tsx            # User authentication page
│   │   │   ├── Checkout.tsx         # Order checkout page
│   │   │   ├── MyOrders.tsx         # Order history page
│   │   │   ├── OrderTracking.tsx    # Real-time order tracking page
│   │   │   ├── Addresses.tsx        # Address management page
│   │   │   ├── AppLayout.tsx        # Main layout wrapper
│   │   │   ├── admin/              # Admin panel pages
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminProducts.tsx
│   │   │   │   ├── AdminProductForm.tsx
│   │   │   │   ├── AdminOrders.tsx
│   │   │   │   └── AdminDeliveryPartners.tsx
│   │   │   └── delivery/          # Delivery partner pages
│   │   │       ├── DeliveryLayout.tsx
│   │   │       ├── DeliveryLogin.tsx
│   │   │       └── DeliveryDashboard.tsx
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── App.tsx                  # Root component with routing
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html                   # HTML template
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── vercel.json                  # Vercel deployment config
│   └── package.json
│
├── server/                          # Backend (Express + TypeScript)
│   ├── config/                      # Configuration modules
│   │   ├── prisma.ts                # Prisma client instance (Neon adapter)
│   │   ├── cloudinary.ts            # Cloudinary SDK setup
│   │   └── nodemailer.ts            # Email transporter (Brevo SMTP)
│   ├── controllers/                 # Route handlers / business logic
│   │   ├── authController.ts        # Register, login, admin check
│   │   ├── productController.ts     # Product CRUD
│   │   ├── orderController.ts       # Order creation, retrieval, status
│   │   ├── addressController.ts     # Address CRUD
│   │   ├── adminController.ts       # Dashboard stats, partner mgmt
│   │   ├── deliveryPartnerController.ts # Partner auth, delivery ops
│   │   └── webhooks.ts              # Stripe webhook handler
│   ├── middleware/                   # Express middlewares
│   │   ├── auth.ts                  # JWT verification (user)
│   │   ├── admin.ts                 # Admin role check
│   │   └── deliveryAuth.ts          # Delivery partner JWT
│   ├── routes/                      # Express route definitions
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── addressRoutes.ts
│   │   ├── adminRoutes.ts
│   │   ├── deliveryPartnerRoutes.ts
│   │   └── uploadRoutes.ts
│   ├── inngest/
│   │   └── index.ts                 # Background functions (auto-assign, alerts, cron)
│   ├── prisma/
│   │   └── schema.prisma            # Database schema definition
│   ├── generated/                   # Prisma generated client (auto-generated)
│   ├── types/                       # Custom TypeScript type extensions
│   ├── seed.ts                      # Database seed script (27 products)
│   ├── server.ts                    # Express app entry point
│   ├── prisma.config.ts             # Prisma configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── vercel.json                  # Vercel deployment config
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔄 Background Jobs (Inngest)

The application uses [Inngest](https://www.inngest.com/) for event-driven background processing:

| Function | Trigger | Description |
|----------|---------|-------------|
| **Auto-Assign Rider** | `order/placed` event | Waits 5 minutes, then finds an available delivery partner (not currently on a delivery), assigns them to the order, and generates a 6-digit OTP for delivery verification |
| **Low Stock Alert** | `inventory/stock.updated` event | Checks if product stock fell below 10 units and sends a styled HTML alert email to all admin emails |
| **Monthly Offers** | Cron: `0 10 1 * *` (1st of each month, 10 AM) | Fetches top 6 discounted products and sends personalized promotional emails to all registered users in batches of 10 |

---

## 🌐 Deployment

Both the client and server include `vercel.json` configurations for seamless deployment on [Vercel](https://vercel.com/).

### Client Deployment
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_BASE_URL` to your deployed server URL

### Server Deployment
- Runtime: Node.js
- Entry: `server.ts`
- Set all environment variables in Vercel dashboard
- Configure Stripe webhook endpoint to `https://your-server.vercel.app/api/stripe`
- Set up Inngest webhook endpoint at `https://your-server.vercel.app/api/inngest`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<div align="center">

**Built with ❤️ using React, Express, Prisma & Stripe**

</div>
]]>
