import { client } from "../config/redis.js";
import { sendDummyMessage } from "../services/messageService.js";
import { Campaign } from "../models/campaign.model.js";

const processCampaigns = async () => {
  while (true) {
    try {
      const campaignStr = await client.brPop("campaigns", 0);
      const { campaignId, customers, message } = JSON.parse(
        campaignStr.element
      );

      // Process each customer
      for (const customerId of customers) {
        await sendDummyMessage(
          campaignId,
          customerId,
          message.replace("{name}", customerId.name)
        );
      }

      // Update campaign status
      await Campaign.findByIdAndUpdate(campaignId, {
        status: "sent",
        sentAt: new Date(),
      });
    } catch (err) {
      console.error("Error processing campaign:", err);
    }
  }
};

export default processCampaigns;
