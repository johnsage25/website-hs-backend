const mongoose = require("mongoose");

export const SessionSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    customer_id: String,
    createdAt: {type : Date, default: Date.now},
    updatedAt: {type : Date, default: Date.now},
    browser_signature: String,
    range: Array,
    country: String,
    region: String,
    timezone: String,
    ip: String,
    city: String,
    area: String,
    latitude: Array,
    os: String,
    device:String,
    browser:String,
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
