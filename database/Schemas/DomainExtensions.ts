const mongoose = require("mongoose");

export const DomainExtensionSchema = mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    name: { type: String, unique: true, required: true },
    registerPrice: {type: Number, default: 0},
    IsDocumentRequired: Boolean,
    IsTransferable: Boolean,
    MaxCharacterCount: Number,
    IdProtection: { type: Boolean, default: false },
    NDSManagement: { type: Boolean, default: true },
    MaxRegistrationPeriod: Number,
    MinCharacterCount: Number,
    MinRegistrationPeriod: Number,
    RequiredDocumentInfo: String,
    renewPrice: {type: Number, default: 0},
    domainModule:String,
    transferPrice: {type: Number, default: 0},
    listOrder:{type: Number, default: 0},
    promoDate:Date,
    promo: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    promoRegisterPrice: {type: Number, default: 0},
    promoRenewPrice: {type: Number, default: 0},
    status: Boolean,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
