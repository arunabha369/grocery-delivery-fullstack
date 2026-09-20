import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const uploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image uploads are allowed"));
        cb(null, true);
    },
});

// Admin only: uploads cost money and are public, so customers must not reach this
uploadRouter.post("/", auth, admin, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "grocery-del",
            resource_type: "auto",
        });

        res.json({ url: result.secure_url });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Turn multer rejections (too large / not an image) into clear 400s
uploadRouter.use((error: any, _req: any, res: any, next: any) => {
    if (!error) return next();
    const message = error.code === "LIMIT_FILE_SIZE" ? "Image must be 5MB or smaller" : error.message || "Upload failed";
    res.status(400).json({ message });
});

export default uploadRouter;
