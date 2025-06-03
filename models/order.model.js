import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  orderDate: Date,
  amount: Number,
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
});

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
