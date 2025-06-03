import express from "express";
import { Campaign } from "../models/campaign.model.js";
import { CommunicationLog } from "../models/communication.model.js";
import { Segment } from "../models/segment.model.js";
import { Customer } from "../models/customer.model.js";
import { validateToken } from "../middlewares/auth.middleware.js";
import { sendDummyMessage } from "../services/messageService.js";
import { client } from "../config/redis.js";
import { buildMongoQueryFromRules } from "../utils/segmentBuilder.js";
const router = express.Router();
// Create campaign
router.post("/", validateToken, async (req, res) => {
  try {
    const campaign = new Campaign({
      ...req.body,
      createdBy: req.user._id,
      status: "sending",
    });

    const newCampaign = await campaign.save();

    // Get segment customers
    const segment = await Segment.findById(req.body.segmentId);
    const query = buildMongoQueryFromRules(segment.rules);
    const customers = await Customer.find(query);

    // Update campaign counts
    newCampaign.totalCount = customers.length;
    await newCampaign.save();

    // Add to Redis queue for async processing
    await client.lPush(
      "campaigns",
      JSON.stringify({
        campaignId: newCampaign._id,
        customers: customers.map((c) => c._id),
        message: req.body.message,
      })
    );

    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all campaigns
router.get("/", validateToken, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("segmentId");
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get campaign stats
router.get("/:id/stats", validateToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const logs = await CommunicationLog.find({ campaignId: campaign._id });
    const sentCount = logs.filter((l) => l.status === "sent").length;
    const failedCount = logs.filter((l) => l.status === "failed").length;

    res.json({
      ...campaign.toObject(),
      sentCount,
      failedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delivery receipt webhook
router.post("/:id/delivery", async (req, res) => {
  try {
    const { customerId, status, errorMessage } = req.body;

    await CommunicationLog.findOneAndUpdate(
      { campaignId: req.params.id, customerId },
      {
        status,
        [status === "sent" ? "sentAt" : "failedAt"]: new Date(),
        errorMessage: status === "failed" ? errorMessage : undefined,
      }
    );

    // Batch update campaign stats in background
    client.incr(`campaign:${req.params.id}:${status}`);

    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
