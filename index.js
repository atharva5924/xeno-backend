import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import cors from "cors";
import { connectRedis } from "./config/redis.js";
import processCampaigns from "./workers/campaignWorker.js";

import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import orderRoutes from "./routes/order.routes.js";
import segmentRoutes from "./routes/segment.routes.js";
import campaignRoutes from "./routes/campaign.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import setupSwaggerDocs from "./utils/swagger.js";

dotenv.config({
  path: "./.env",
});

const app = express();
setupSwaggerDocs(app);

app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies/auth headers
  })
);
app.use(express.json());

const startServer = async () => {
  try {
    connectDB()
      .then(() => {
        app.listen(process.env.PORT || 8000, () => {
          console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        });
      })
      .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
      });

    await connectRedis();

    // Start background workers
    processCampaigns();

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/customers", customerRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/segments", segmentRoutes);
    app.use("/api/campaigns", campaignRoutes);
    app.use("/api/ai", aiRoutes);
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
};

startServer();
