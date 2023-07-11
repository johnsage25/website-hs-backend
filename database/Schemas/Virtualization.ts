const mongoose = require("mongoose");

export const VirtualizationSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    bandwidth: Number,
    bandwidthType: String,
    cpuType: String,
    memory: Number,
    memoryType: String,
    storage: Number,
    storageType: String,
    title: String,
    storageFormat: String,
    connection: {
      type: mongoose.ObjectId,
      ref: "ServerConnections",
    },
    region: {
      type: mongoose.ObjectId,
      ref: "ServerRegions",
    },
    isfree: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    category: { type: String, default: "" },
    type: { type: String, default: "" },
    status: { type: Boolean, default: false },
    vcpu: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
