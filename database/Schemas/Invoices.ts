const mongoose = require("mongoose");

const InvoicesSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.ObjectId,
      ref: "Customers",
      required: true,
    },
    recurringPeroid: { type: String },
    useCoupon: { type: String },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "unpaid", "returned", "cancelled"],
      default: "pending",
    },
    type: {type: String, default: "general"},
    usePromotion: { type: Boolean, default: false },
    refundDate: {
      type: Date,
    },
    taxed: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    subTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    invoiceNumber: String,
    datePaid: {
      type: Date,
    },
    note: String,
    paymentMethod: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

InvoicesSchema.pre("save", function (this: any, next:any) {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().substr(-2);
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  const hour = ("0" + currentDate.getHours()).slice(-2);
  const minute = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);
  const invoiceNumber = `INV-${year}${month}${day}${hour}${minute}${seconds}`;
  // Use a type annotation for 'this'
  this.invoiceNumber = invoiceNumber;
  next();
});

export { InvoicesSchema };
