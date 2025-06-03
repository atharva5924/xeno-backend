  import express from "express";
  import { Segment } from "../models/segment.model.js";
  import { Customer } from "../models/customer.model.js";
  import { validateToken } from "../middlewares/auth.middleware.js";
  import { buildMongoQueryFromRules } from "../utils/segmentBuilder.js";

  const router = express.Router();
  // Create segment
  router.post("/", validateToken, async (req, res) => {
    try {
      const query = buildMongoQueryFromRules(req.body.rules);
      const customerCount = await Customer.countDocuments(query);

      const segment = new Segment({
        ...req.body,
        customerCount,
        createdBy: req.user._id,
      });

      const newSegment = await segment.save();
      res.status(201).json(newSegment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Get all segments
  router.get("/", validateToken, async (req, res) => {
    try {
      const segments = await Segment.find({ createdBy: req.user._id });
      res.json({
        success: true,
        count: segments.length,
        segments, // This ensures consistent structure
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get segment customers
  router.get("/:id/customers", validateToken, async (req, res) => {
    try {
      const segment = await Segment.findById(req.params.id);
      if (!segment) return res.status(404).json({ message: "Segment not found" });

      const query = buildMongoQueryFromRules(segment.rules);
      const customers = await Customer.find(query);

      res.json(customers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  export default router;
