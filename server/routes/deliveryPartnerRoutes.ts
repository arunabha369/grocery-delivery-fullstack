import express from "express";
import { cancelDelivery, completeDelivery, getDeliveryDetail, getMyDeliveries, loginPartner, updateDeliveryStatus, updateLocation } from "../controllers/deliveryPartnerController.js";
import deliveryAuth from "../middleware/deliveryAuth.js";
import rateLimit from "../middleware/rateLimit.js";

const deliveryPartnerRouter = express.Router();

deliveryPartnerRouter.post("/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), loginPartner);
deliveryPartnerRouter.get("/my-deliveries", deliveryAuth, getMyDeliveries);
deliveryPartnerRouter.get("/my-deliveries/:id", deliveryAuth, getDeliveryDetail);
deliveryPartnerRouter.put("/my-deliveries/:id/complete", deliveryAuth, completeDelivery);
deliveryPartnerRouter.put("/my-deliveries/:id/cancel", deliveryAuth, cancelDelivery);
deliveryPartnerRouter.put("/my-deliveries/:id/status", deliveryAuth, updateDeliveryStatus);
deliveryPartnerRouter.put("/my-deliveries/:id/location", deliveryAuth, updateLocation);

export default deliveryPartnerRouter;
