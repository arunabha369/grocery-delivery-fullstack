import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import addressRouter from "./routes/addressRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import deliveryPartnerRouter from "./routes/deliveryPartnerRoutes.js";
import { stripeWebhook } from "./controllers/webhooks.js";

const app = express();

app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// Middleware
// Restrict the API to your own site(s) when CLIENT_URL is set, e.g.
// CLIENT_URL=https://yourstore.com,https://www.yourstore.com
const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

if (allowedOrigins.length === 0) {
    console.warn("CLIENT_URL is not set — the API accepts requests from any origin");
}

app.use(
    cors({
        origin: allowedOrigins.length === 0 ? true : allowedOrigins,
    })
);
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
    res.send("Server is Live!");
});
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/orders", orderRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/addresses", addressRouter);
app.use("/api/admin", adminRouter);
app.use("/api/delivery", deliveryPartnerRouter);

// Error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    // Don't hand internal details (query fragments, stack hints) to clients in production
    const message = process.env.NODE_ENV === "production" ? "Something went wrong. Please try again." : error.message;
    res.status(error.status || 500).json({ message });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
