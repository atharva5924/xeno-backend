import mongoose, { Schema } from "mongoose";

const ruleSchema = new Schema({
  field: String,
  operator: String,
  value: Schema.Types.Mixed,
});

const segmentSchema = new Schema({
  name: String,
  description: String,
  rules: [
    {
      condition: { type: String, enum: ["AND", "OR"] },
      rules: [ruleSchema],
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  customerCount: Number,
});

export const Segment =
  mongoose.models.Segment || mongoose.model("Segment", segmentSchema);
