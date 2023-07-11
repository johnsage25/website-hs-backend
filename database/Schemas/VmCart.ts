const mongoose = require("mongoose");
const VmCartSchema = new mongoose.Schema(
  {
    customer: [
      {
        type: mongoose.ObjectId,
        ref: "Customers",
      },
    ],
    vm: [{ type: mongoose.ObjectId, ref: "Virtualizations" }],
    region: [{ type: mongoose.ObjectId, ref: "ServerRegions" }],
    osType: { type: String, default: "ubuntu" },
    osVersion: { type: String, default: "22.04.x64" },
    vmAuth: String,
    sshKey: {
      type: mongoose.ObjectId,
      ref: "SSHKeys",
    },
    term: { type: String, default: "m" },
    sskLabel: String,
    tag: String,
    hostname: String,
    password: String,
    quantity: Number,
    createdAt: { type: Date, default: Date.now, expires: "24h" },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default VmCartSchema;
