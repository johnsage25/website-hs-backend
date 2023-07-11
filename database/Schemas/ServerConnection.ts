import { string } from "zod";

const mongoose = require("mongoose");

export const ServerConnectionSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    type: String,
    name: String,
    apiKey: String,
    hostAddress: String,
    ipAddress: String,
    panel: String,
    port: Number,
    noAccount: Number,
    username: String,
    password: String,
    status: Boolean,
    method: String,
  },
  {
    timestamps: true,
  }
);
