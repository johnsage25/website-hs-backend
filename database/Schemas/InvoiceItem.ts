const mongoose = require("mongoose");

export const InvoiceItemsSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    description: String,
    quantity: Number,
    taxexempt: { type: Boolean, default: false },
    amount: { type: Number, default: 0.0 },
    total_amount: { type: Number, default: 0.0 },
    type: { type: String, default: "hosting" },
    start: { type: Date, default: Date.now },
    end: { type: Date, default: Date.now },
    invoice: [
      {
        type: mongoose.ObjectId,
        ref: "Invoices",
      },
    ],
    customer: {
      type: mongoose.ObjectId,
      ref: "Customers",
      required: true,
    },
    order: [
      {
        type: mongoose.ObjectId,
        ref: "Orders",
      },
    ],
  },
  {
    timestamps: true,
  }
);
