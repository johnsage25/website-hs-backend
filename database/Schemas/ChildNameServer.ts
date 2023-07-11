import { string } from "zod";

const mongoose = require("mongoose");

export const ChildNameServerSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    nsHost: { type: String, unique: true },
    nsIPs: { type: Array },
    order: {
      type: mongoose.ObjectId,
      ref: "Orders",
    },
  },
  {
    timestamps: true,
  }
);
