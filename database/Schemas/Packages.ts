const mongoose = require("mongoose");

export const PackagesSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    name: String,
    type: String,
    description: String,
    packageType:Number,
    status: { type: Boolean, default: true },
    isHidden: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
