const mongoose = require("mongoose");
const selectedDomainSchema = new mongoose.Schema({
  domainName: String,
  term: Number,
  tldId: String,
  registerPrice: Number,
  maxPeriod:Number,
  renewPrice:Number,
  domainPrivacy:{type: Boolean, default: false},
  promo: Boolean,
  promoRegisterPrice: Number,
});

const selectedPackage = new mongoose.Schema({
  productId: String,
  period: String,
  domain:String,
});

const CartSchema = new mongoose.Schema(
  {
    customer: [
      {
        type: mongoose.ObjectId,
        ref: "Customers",
      },
    ],
    product: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    ssl: [
      {
        type: mongoose.ObjectId,
        ref: "SiteCertificate",
      },
    ],
    tldExt: [
      {
        type: mongoose.ObjectId,
        ref: "DomainExtensions",
      },
    ],
    selectedPackage: [selectedPackage],
    domainSelected: [selectedDomainSchema],
    backup: Boolean,
    sslName: String,
    term: String,
    preinstall: { type: String, default: "default" },
    createdAt: { type: Date, default: Date.now, expires: "24h" },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);


export { CartSchema };
