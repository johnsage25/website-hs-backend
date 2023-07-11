const mongoose = require("mongoose");

export const PackageCategorySchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: {type : Date, default: Date.now},
    updatedAt: {type : Date, default: Date.now},
    name: String,
    description:String,
    pageBlock: {type:String, default: "none"},
    status: {type:Boolean, default: true},
  },
  {
    timestamps: true,
  }
);
