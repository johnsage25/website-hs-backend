const mongoose = require("mongoose");
const EventsSchema = new mongoose.Schema(
  {
    customer: [
      {
        type: mongoose.ObjectId,
        ref: "Customers",
      },
    ],
    message: String,
    opened:Boolean,
    read: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export { EventsSchema };
