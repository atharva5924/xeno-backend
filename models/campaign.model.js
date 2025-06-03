import mongoose, { Schema } from "mongoose";

const campaignSchema = new Schema({
  name: String,
  segmentId: { type: Schema.Types.ObjectId, ref: "Segment" },
  message: String,
  status: {
    type: String,
    enum: ["draft", "sending", "sent", "failed"],
    default: "draft",
  },
  sentCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  sentAt: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});


export const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
