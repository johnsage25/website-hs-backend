import { string } from "zod";

const mongoose = require("mongoose");

export const SSHKeysSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: {type : Date, default: Date.now},
    updatedAt: {type : Date, default: Date.now},
    default: Boolean,
    key: String,
    fingerprint:String,
    label: String,
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
