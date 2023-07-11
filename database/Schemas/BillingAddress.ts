const mongoose = require("mongoose");

export const BillingAddressSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: {type : Date, default: Date.now},
    updatedAt: {type : Date, default: Date.now},
    companyname: String,
    country: String,
    state: String,
    address: String,
    address2: String,
    city: String,
    postalcode: String,
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
