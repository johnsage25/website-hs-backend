const mongoose = require("mongoose");

const HostMetaSchema = new mongoose.Schema({
  server: {
    type: String,
  },
  username: {
    type: String,
  },
  hostingId: { type: String },
  password: {
    type: String,
  },
  ServicePlan: {
    type: String,
  },
  maxSite: {
    type: String,
  },
  diskLimit: {
    type: String,
  },
  bandwidthLimit: {
    type: String,
  },
  emailLimit: {
    type: String,
  },
  databaseLimit: {
    type: String,
  },
  addonsLimit: {
    type: String,
  },
  subdomainLimit: {
    type: String,
  },
  ftpLimit: {
    type: String,
  },
  parkLimit: {
    type: String,
  },
  maxEmailPerHour: {
    type: String,
  },
  order: {
    type: mongoose.ObjectId,
    ref: "Orders",
  },
});

export default HostMetaSchema;
