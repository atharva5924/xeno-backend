// routes/orders.js
import express from "express";
import { Order } from "../models/order.model.js";

const router = express.Router();

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email") // Populate customer details
      .sort({ orderDate: -1 }); // Newest first

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
