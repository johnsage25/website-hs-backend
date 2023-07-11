import { string } from "zod";

const mongoose = require("mongoose");

export const SSLCertificateSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: Boolean,
    name: String,
    sequence:Number,
    orderform:Boolean,
    description: String,
    price: {type: Number, default: 0.00 }
  },
  {
    timestamps: true,
  }
);
