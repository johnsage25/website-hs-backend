const mongoose = require("mongoose");

export const VmCreationStatusSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    order: {
      type: mongoose.ObjectId,
      ref: "Orders",
    },
    customer: {
      type: mongoose.ObjectId,
      ref: "Customers",
    },
    status: String,
    percent: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
