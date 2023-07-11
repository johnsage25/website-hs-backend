const mongoose = require("mongoose");

export const PricingSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    period: String,
    amount: Number,
    discount: Number,
    vm: {
      type: mongoose.Types.ObjectId,
      ref: "Virtualizations",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
