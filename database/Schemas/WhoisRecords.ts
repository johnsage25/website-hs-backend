const mongoose = require("mongoose");
const WhoisRecordSchema = new mongoose.Schema(
  {
    email: { type: String },
    mobile: { type: String },
    address: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    company: { type: String },
    city: { type: String },
    postalcode: { type: String },
    country: { type: String },
    state: { type: String },
    Fax: { type: String },
    FaxCountryCode: { type: String },
    order: {
      type: mongoose.ObjectId,
      ref: "Orders",
    },
  },
  {
    timestamps: true,
  }
);

export { WhoisRecordSchema };
