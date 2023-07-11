const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    mobile: String,
    isEmailVerify: Boolean,
    isMobileVerify: Boolean,
    verificationString: String,
    accBalance: { type: Number, default: 0.0 },
    otp: String,
    timezone: String,
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive", "disabled"],
    },
    language: { type: String, default: "en" },
    currency: { type: String, default: "usd" },
    isBlocked: { type: Boolean, default: false },
    secret2fa: String,
    twoFactorEnabled: { type: Boolean, default: false },
    googleAuth: Boolean,
    googleAuthId: String,
    autoBackup: { type: Boolean, default: false },
    connectedCard: { type: Boolean, default: null },
    allowHostSpacing: { type: Boolean, default: false },
    recoveryCodes: Array,
    mailNotification: { type: Boolean, default: false },
    paymentId: String,
    clientPaymentSecret: String,
    paymentMethod: String,
    darkMode: { type: Boolean, default: false },
    typeToConfirm: { type: Boolean, default: true },
    githubAuth: Boolean,
    githubAuthId: String,
    autoRenewal: { type: Boolean, default: true },
    country: String,
    encoding: String,
    defaultPayment: { type: String, default: "none" },
    stripeCustomerID: { type: String, default: null },
    paymentVerified: { type: Boolean, default: false },
    tos: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

customerSchema.index({
  firstname: "text",
  lastname: "text",
  mobile: "text",
  email: "text",
  username: "text",
});

export { customerSchema };
