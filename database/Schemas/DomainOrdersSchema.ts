const mongoose = require("mongoose");
const DomainOrdersSchema = new mongoose.Schema({
  domainName: String,
  peroid: String,
  term:{type:Number, default:1},
  autoRenew:{type: Boolean, default: false},
  renewalDate: {type:Date},
  extension: {
    type: mongoose.ObjectId,
    ref: "DomainExtensions",
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
  domainPrivacy: { type: Boolean, default: false },
});

export { DomainOrdersSchema };
