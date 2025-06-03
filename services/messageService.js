import axios from "axios";
import { CommunicationLog } from "../models/communication.model.js";

const sendDummyMessage = async (campaignId, customerId, message) => {
  try {
    // Simulate vendor API call (90% success rate)
    const success = Math.random() < 0.9;

    if (success) {
      await CommunicationLog.create({
        campaignId,
        customerId,
        message,
        status: "sent",
        sentAt: new Date(),
      });

      // Simulate delivery receipt
      await axios.post(
        `${process.env.BACKEND_URL}/api/campaigns/${campaignId}/delivery`,
        {
          customerId,
          status: "sent",
        }
      );
    } else {
      await CommunicationLog.create({
        campaignId,
        customerId,
        message,
        status: "failed",
        failedAt: new Date(),
        errorMessage: "Failed to deliver message",
      });

      // Simulate delivery receipt
      await axios.post(
        `${process.env.BACKEND_URL}/api/campaigns/${campaignId}/delivery`,
        {
          customerId,
          status: "failed",
          errorMessage: "Failed to deliver message",
        }
      );
    }
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

export { sendDummyMessage };
