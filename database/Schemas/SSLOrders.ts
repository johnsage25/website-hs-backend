const mongoose = require("mongoose");
const SSLOrderSchema = new mongoose.Schema(
  {
    domainName: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    peroid: { type: String, enum: ["yearly", "monthly"], default: "yearly" },
    term: { type: Number, default: 1 },
    autoRenew: { type: Boolean, default: false },
    renewalDate: { type: Date },
    ssl: {
      type: mongoose.ObjectId,
      ref: "SiteCertificate",
    },
    customer: [
      {
        type: mongoose.ObjectId,
        ref: "Customers",
      },
    ],
    invoice: [
      {
        type: mongoose.ObjectId,
        ref: "Invoices",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export { SSLOrderSchema };
