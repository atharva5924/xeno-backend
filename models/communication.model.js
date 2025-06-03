import mongoose, { Schema } from "mongoose";

const communicationLogSchema = new Schema({
  campaignId: { type: Schema.Types.ObjectId, ref: "Campaign" },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  message: String,
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
  sentAt: Date,
  failedAt: Date,
  errorMessage: String,
});

export const CommunicationLog =
  mongoose.models.CommunicationLog ||
  mongoose.model("CommunicationLog", communicationLogSchema);
