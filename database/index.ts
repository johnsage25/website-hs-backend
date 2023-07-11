import { BillingAddressSchema } from "./Schemas/BillingAddress";
import { CartSchema } from "./Schemas/Cart";
import { ChildNameServerSchema } from "./Schemas/ChildNameServer";
import { customerSchema } from "./Schemas/Customers";
import { DomainExtensionSchema } from "./Schemas/DomainExtensions";
import { DomainOrdersSchema } from "./Schemas/DomainOrdersSchema";
import { EventsSchema } from "./Schemas/EventNotification";
import HostMetaSchema from "./Schemas/HostMeta";
import { InvoiceItemsSchema } from "./Schemas/InvoiceItem";
import { InvoicesSchema } from "./Schemas/Invoices";
import { PackageCategorySchema } from "./Schemas/PackageCategory";
import { PackagesSchema } from "./Schemas/Packages";
import { ProductsSchema } from "./Schemas/Products";
import { SSHKeysSchema } from "./Schemas/SSHKeys";
import { SSLCertificateSchema } from "./Schemas/SSLCertificate";
import { SSLOrderSchema } from "./Schemas/SSLOrders";
import { SavedCardsSchema } from "./Schemas/SavedCards";
import { ServerConnectionSchema } from "./Schemas/ServerConnection";
import { SessionSchema } from "./Schemas/Session";
import { ServerRegionsSchema } from "./Schemas/ServerRegions";
import { WhoisRecordSchema } from "./Schemas/WhoisRecords";
import { VirtualizationSchema } from "./Schemas/Virtualization";
import VmCartSchema from "./Schemas/VmCart";
import { PaystackRefsSchema } from "./Schemas/PaystackRefs";
import { VmCreationStatusSchema } from "./Schemas/VmCreationStatus";
import { PricingSchema } from "./Schemas/Pricing";
import { OrdersSchema } from "./Schemas/Orders";
const createOrUpdate = require("mongoose-create-or-update");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_LNK);
WhoisRecordSchema.plugin(createOrUpdate);
SSHKeysSchema.plugin(createOrUpdate);
customerSchema.plugin(mongoosePaginate);
InvoicesSchema.plugin(mongoosePaginate);
OrdersSchema.plugin(mongoosePaginate);
VirtualizationSchema.plugin(mongoosePaginate);
ServerRegionsSchema.plugin(mongoosePaginate);
OrdersSchema.plugin(mongoosePaginate);

// delete mongoose.models.Customers;
delete mongoose.models.Orders;
delete mongoose.models.Order;

InvoicesSchema.virtual("items", {
  ref: "InvoiceItems",
  localField: "_id",
  foreignField: "invoice",
});

PackagesSchema.virtual("product", {
  ref: "Products",
  localField: "_id",
  foreignField: "package",
});

customerSchema.virtual("session", {
  ref: "Sessions",
  localField: "_id",
  foreignField: "customer",
});

customerSchema.virtual("BillingAddress", {
  ref: "BillingAddress",
  localField: "_id",
  foreignField: "customer",
});

InvoicesSchema.virtual("domainorders", {
  ref: "DomainOrders",
  localField: "_id",
  foreignField: "invoice",
});

InvoicesSchema.virtual("orders", {
  ref: "Orders",
  localField: "_id",
  foreignField: "invoice",
});

InvoicesSchema.virtual("sslorders", {
  ref: "SSLOrders",
  localField: "_id",
  foreignField: "invoice",
});

PackageCategorySchema.virtual("products", {
  ref: "Products",
  localField: "_id",
  foreignField: "category",
});

customerSchema.virtual("whois", {
  ref: "WhoisRecords",
  localField: "_id",
  foreignField: "customer",
});

OrdersSchema.virtual("whois", {
  ref: "WhoisRecords",
  localField: "_id",
  foreignField: "order",
});

OrdersSchema.virtual("nslist", {
  ref: "ChildNameServer",
  localField: "_id",
  foreignField: "order",
});

OrdersSchema.virtual("vmcreationstatus", {
  ref: "VmCreationStatus",
  localField: "_id",
  foreignField: "order",
});

OrdersSchema.virtual("hostMeta", {
  ref: "HostMetas",
  localField: "_id",
  foreignField: "order",
});

VirtualizationSchema.virtual("pricing", {
  ref: "Pricing",
  localField: "_id",
  foreignField: "vm",
});

ProductsSchema.virtual("pricing", {
  ref: "Pricing",
  localField: "_id",
  foreignField: "product",
});

const BillingAddress =
  mongoose.models.BillingAddress ||
  mongoose.model("BillingAddress", BillingAddressSchema);

const Sessions =
  mongoose.models.Sessions || mongoose.model("Sessions", SessionSchema);

const Customers =
  mongoose.models.Customers || mongoose.model("Customers", customerSchema);

const EventsNotification =
  mongoose.models.Events || mongoose.model("Events", EventsSchema);

const SSHKeys =
  mongoose.models.SSHKeys || mongoose.model("SSHKeys", SSHKeysSchema);

const Packages =
  mongoose.models.Packages || mongoose.model("Packages", PackagesSchema);

const Products =
  mongoose.models.Products || mongoose.model("Products", ProductsSchema);
const PackageCategories =
  mongoose.models.PackageCategories ||
  mongoose.model("PackageCategories", PackageCategorySchema);

const ServerRegions =
  mongoose.models.ServerRegions ||
  mongoose.model("ServerRegions", ServerRegionsSchema);

const VmCreationStatus =
  mongoose.models.VmCreationStatus ||
  mongoose.model("VmCreationStatus", VmCreationStatusSchema);

const Pricing =
  mongoose.models.Pricing || mongoose.model("Pricing", PricingSchema);

const Invoices =
  mongoose.models.Invoices || mongoose.model("Invoices", InvoicesSchema);
const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
const DomainExtensions =
  mongoose.models.DomainExtensions ||
  mongoose.model("DomainExtensions", DomainExtensionSchema);
const DomainOrders =
  mongoose.models.DomainOrders ||
  mongoose.model("DomainOrders", DomainOrdersSchema);
const SSLOrders =
  mongoose.models.SSLOrders || mongoose.model("SSLOrders", SSLOrderSchema);
const SavedCards =
  mongoose.models.SavedCards || mongoose.model("SavedCards", SavedCardsSchema);

const InvoiceItems =
  mongoose.models.InvoiceItems ||
  mongoose.model("InvoiceItems", InvoiceItemsSchema);

const SSLCertificate =
  mongoose.models.SiteCertificate ||
  mongoose.model("SiteCertificate", SSLCertificateSchema);

const HostMetas =
  mongoose.models.HostMetas || mongoose.model("HostMetas", HostMetaSchema);

const WhoisRecords =
  mongoose.models.WhoisRecords ||
  mongoose.model("WhoisRecords", WhoisRecordSchema);

const ChildNameServer =
  mongoose.models.ChildNameServer ||
  mongoose.model("ChildNameServer", ChildNameServerSchema);

const VmCart = mongoose.models.VmCart || mongoose.model("VmCart", VmCartSchema);

const ServerConnections =
  mongoose.models.ServerConnections ||
  mongoose.model("ServerConnections", ServerConnectionSchema);

const Virtualizations =
  mongoose.models.Virtualizations ||
  mongoose.model("Virtualizations", VirtualizationSchema);

const PaystackRefs =
  mongoose.models.PaystackRefs ||
  mongoose.model("PaystackRefs", PaystackRefsSchema);

const Orders = mongoose.models.Orders || mongoose.model("Orders", OrdersSchema);

export {
  mongoose,
  Customers,
  Packages,
  WhoisRecords,
  ServerConnections,
  ServerRegions,
  Orders,
  SSLOrders,
  Sessions,
  PaystackRefs,
  Virtualizations,
  Pricing,
  DomainExtensions,
  VmCreationStatus,
  HostMetas,
  InvoiceItems,
  ChildNameServer,
  SavedCards,
  Cart,
  DomainOrders,
  PackageCategories,
  Invoices,
  Products,
  VmCart,
  BillingAddress,
  EventsNotification,
  SSLCertificate,
  SSHKeys,
};
