import { client } from "../config/redis.js";
import Campaign from "../models/campaign.model.js";

const updateCampaignStats = async () => {
  while (true) {
    try {
      // Get all campaign keys with pending updates in batches
      const keys = await client.keys("campaign:*:*");

      if (keys.length === 0) {
        console.log("⏳ No pending campaign updates found");
        await new Promise((resolve) => setTimeout(resolve, 10000));
        continue;
      }

      console.log(`🔍 Processing ${keys.length} campaign updates`);

      // Process updates in batches to avoid overwhelming the database
      const batchSize = 100;
      for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        const bulkOps = [];
        const keysToDelete = [];

        for (const key of batch) {
          try {
            const [_, campaignId, status] = key.split(":");
            const count = await client.get(key);

            if (!count || isNaN(parseInt(count))) {
              console.warn(`⚠️ Invalid count for key ${key}`);
              keysToDelete.push(key);
              continue;
            }

            const countValue = parseInt(count, 10);
            bulkOps.push({
              updateOne: {
                filter: { _id: campaignId },
                update: { $inc: { [`${status}Count`]: countValue } },
              },
            });
            keysToDelete.push(key);
          } catch (err) {
            console.error(`❌ Error processing key ${key}:`, err);
          }
        }

        // Execute bulk write operation if we have operations
        if (bulkOps.length > 0) {
          try {
            await Campaign.bulkWrite(bulkOps);
            console.log(`✅ Processed batch of ${bulkOps.length} updates`);
          } catch (err) {
            console.error("❌ Bulk write failed:", err);
          }
        }

        // Delete processed keys
        if (keysToDelete.length > 0) {
          try {
            await client.del(keysToDelete);
          } catch (err) {
            console.error("❌ Failed to delete Redis keys:", err);
          }
        }
      }

      // Wait before next check
      await new Promise((resolve) => setTimeout(resolve, 10000));
    } catch (err) {
      console.error("❌ Error in stats worker main loop:", err);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

export { updateCampaignStats };
