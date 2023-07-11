const mongoose = require("mongoose");

export const PaystackRefsSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    refId: String,
    status: {
      type: String,
      enum: [
        "completed",
        "inprocess",
      ],
      default: "inprocess",
    },
    customer: [
      {
        type: mongoose.ObjectId,
        ref: "Customers",
      },
    ],
  },
  {
    timestamps: true,
  }
);
