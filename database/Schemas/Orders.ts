const mongoose = require("mongoose");

const OrdersSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: [
        "inprogress",
        "active",
        "suspended",
        "overdue",
        "fraud",
        "building",
        "configuring",
        "cancelled",
      ],
      default: "inprogress",
    },
    period: {
      type: String,
    },
    initAmount: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    monthlyPrice: { type: Number, default: 0 },
    hourlyPrice: { type: Number, default: 0 },
    renewalDate: { type: Date, default: Date.now },
    renewedDate: { type: Date, default: Date.now },
    domainRegistrar: { type: String, default: "domainnameapi" },
    adminNote: { type: String },
    tldRegistered: { type: Boolean, default: false },
    packageType: { type: Number },
    autoRenew: { type: Boolean, default: false },
    productType: String,
    serviceName: String,
    vmid: String,
    paymentMethod: { type: String, default: "card" },
    withBackup: { type: Boolean, default: false },
    preInstall: { type: String, default: "default" },
    serverInstalled: { type: Boolean, default: false },
    nameServerList: {
      type: Array,
      default: [
        {
          ns1: "",
          ns2: "",
          ns3: "",
          ns4: "",
        },
      ],
    },
    term: { type: Number, default: 1 },
    orderType: { type: String },
    domainPrivacy: { type: Boolean, default: false },
    domainTransferLock: { type: Boolean, default: true },
    Products: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
    },
    extension: {
      type: mongoose.Types.ObjectId,
      ref: "DomainExtensions",
    },
    node: {
      type: mongoose.Types.ObjectId,
      ref: "Virtualizations",
    },
    region: [{ type: mongoose.Types.ObjectId, ref: "ServerRegions" }],
    osVersion: String,
    osType: String,
    vmAuth: String,
    resourceType: String,
    vmNumber: {
      type: Number,
    },
    password: String,
    privateIp: { type: String, default: "0.0.0.0" },
    publicIp: { type: String, default: "0.0.0.0" },
    publicIpv6: {
      type: String,
      default: "000:000:000:0000:0000:0000:0000:0000",
    },
    sshKey: {
      type: mongoose.Types.ObjectId,
      ref: "SSHKeys",
      default: null,
    },
    vmStatus: {
      type: String,
      enum: ["running", "stopped", "paused", "blocked", "shutoff"],
      default: "running",
    },
    vmOnline: { type: Boolean, default: false },
    tag: String,
    hostname: String,
    domain: String,
    vmProvider: String,
    connection: {
      type: mongoose.ObjectId,
      ref: "ServerConnections",
    },
    /* setting VM details */
    vCpu: { type: Number, default: 1 },
    storageType: String,
    bandwidth: { type: Number, default: 0 },
    storage: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    memoryType: String,
    sslCertificate: {
      type: mongoose.Types.ObjectId,
      ref: "SiteCertificate",
    },
    customer: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Customers",
      },
    ],
    invoice: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Invoices",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Pre-save middleware
// Define a pre-save middleware function
OrdersSchema.pre("save", async function (this: any, next: any) {
  // Generate the order number if it doesn't exist
  if (!this.vmNumber) {
    const maxOrder = await mongoose
      .model("Orders")
      .findOne()
      .sort("-orderNumber")
      .exec();
    const nextOrderNumber = maxOrder ? maxOrder.orderNumber + 1 : 100;

    // Set the order number for the current document
    this.vmNumber = nextOrderNumber;

    // Find the maximum order number in the collection
  }

  next();
});

export { OrdersSchema };
