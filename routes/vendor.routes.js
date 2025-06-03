import express from "express";
const router = express.Router();
import axios from "axios";
import Campaign from "../models/Campaign.js"; // Import your Campaign model

// Configuration
const DELIVERY_SUCCESS_RATE = 0.9; // 90% success rate
const DELIVERY_DELAY_MS = 1000; // 1 second delay
const MAX_RETRIES = 3;

// Mock vendor API that simulates message delivery
router.post("/send", async (req, res) => {
  const { campaignId, customerId, message } = req.body;

  // Validate required fields
  if (!campaignId || !customerId || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: campaignId, customerId, or message",
    });
  }

  try {
    const success = Math.random() < DELIVERY_SUCCESS_RATE;
    const status = success ? "sent" : "failed";
    const errorMessage = success ? undefined : "Failed to deliver message";

    // Simulate async delivery receipt with retry logic
    const sendDeliveryReceipt = async (attempt = 1) => {
      try {
        await axios.post(
          `${process.env.BACKEND_URL}/api/campaigns/${campaignId}/delivery`,
          { customerId, status, errorMessage },
          { timeout: 5000 } // 5 second timeout
        );
      } catch (err) {
        if (attempt < MAX_RETRIES) {
          console.warn(
            `Retry ${attempt} for delivery receipt failed, retrying...`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          return sendDeliveryReceipt(attempt + 1);
        }
        console.error("Final delivery receipt attempt failed:", err.message);
      }
    };

    // Process with delay
    setTimeout(() => {
      sendDeliveryReceipt().catch(console.error);
    }, DELIVERY_DELAY_MS);

    // Immediate response
    res.json({
      success,
      message: success
        ? "Message accepted for delivery"
        : "Message delivery failed",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Vendor API error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

export default router;
