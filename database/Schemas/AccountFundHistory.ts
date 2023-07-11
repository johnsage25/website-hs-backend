import { string } from "zod";

const mongoose = require("mongoose");

export const AccountFundHistory = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: {type : Date, default: Date.now},
    updatedAt: {type : Date, default: Date.now},
    default: Boolean,
    description: String,
    amount:String,
    type: String,
    method: String,
    customer: [
      {
        type: mongoose.ObjectId,
        ref: "Customers",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
