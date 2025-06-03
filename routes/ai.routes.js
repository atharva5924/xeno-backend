import express from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import {
  generateSegmentRules,
  generateMessageVariants,
  generateCampaignInsights,
} from "../services/aiService.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Generate segment rules from natural language
router.post("/generate-rules", validateToken, async (req, res) => {
  try {
    console.log("Received description:", req.body.description);
    const generatedRules = await generateSegmentRules(req.body.description);
    console.log("Generated rules:", generatedRules);
    const normalizedRules = Array.isArray(generatedRules)
      ? generatedRules.map((group) => ({
          condition: ["AND", "OR"].includes(group.condition)
            ? group.condition
            : "AND",
          rules: Array.isArray(group.rules)
            ? group.rules.filter(
                (rule) =>
                  rule.field && rule.operator && rule.value !== undefined
              )
            : [],
        }))
      : [{ condition: "AND", rules: [] }];
    res.json(normalizedRules);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Generate message variants
router.post("/generate-messages", validateToken, async (req, res) => {
  try {
    const messages = await generateMessageVariants(req.body.objective);
    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Generate campaign insights
router.post("/generate-insights", validateToken, async (req, res) => {
  try {
    const insights = await generateCampaignInsights(req.body.stats);
    res.json({ insights });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
