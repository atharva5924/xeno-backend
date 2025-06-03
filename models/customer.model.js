import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    totalSpent: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    lastPurchaseDate: Date,
    firstPurchaseDate: Date,
    tags: [String],
  },
  { timestamps: true }
);

export const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);
