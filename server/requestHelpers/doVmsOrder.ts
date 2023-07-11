import collect, { Collection } from "collect.js";
import React from "react";
import {
  InvoiceItems,
  Invoices,
  Orders,
  VmCart,
  mongoose,
} from "../../database";
import _ from "lodash";
import { PackageTerms } from "../../utils/helpers";
import { CustomerType } from "../../Types/CustomerType";
import { PaymentReceipt } from "../../mail/component/PaymentReciet";
import axios from "axios";
import { createVmRequest } from "../../node/createVmRequest";
var moment = require("moment");

const doVmsOrder = async (
  cartId?: string,
  customer?: CustomerType,
  paymentMethod?: string
) => {
  let cart: any = await VmCart.findById(cartId).populate([
    { path: "vm", populate: ["pricing"] },
    { path: "region" },
  ]);

  let renewalDate;

  switch (cart.term) {
    case "q":
      renewalDate = moment().add(3, "month");
      break;
    case "s":
      renewalDate = moment().add(6, "month");
      break;
    case "a":
      renewalDate = moment().add(1, "year");
      break;
    case "b":
      renewalDate = moment().add(2, "years");
      break;
    case "h":
      renewalDate = moment().add(1, "hour");
      break;
    default:
      renewalDate = moment().add(1, "month");
      break;
  }

  const quantityArray: number[] = Array.from(
    { length: cart?.quantity },
    (_, i) => i + 1
  );

  let price =
    cart?.vm[0]?.pricing.filter((item) => item.period == cart.term)[0] || 0;

  let subTotal = price.amount * cart.quantity;
  let total = price.amount * cart.quantity; // include tax here

  return new Promise((resolve, reject) => {
    Invoices.create({
      _id: mongoose.Types.ObjectId(),
      customer: customer?._id,
      subTotal: subTotal,
      total: total,
      taxed: 0.0,
      type: "vm",
      paymentStatus: "paid",
      paymentMethod: paymentMethod,
    }).then(async (invoice: any) => {
      // creating order

      const timestamp = new Date().getTime();
      const vmId = timestamp.toString().substring(0, 9);

      console.log(cart?.vm[0]);

      let cartsIterate = await Promise.all(
        quantityArray.map(async (number) => {
          return {
            _id: mongoose.Types.ObjectId(),
            type: 3,
            customer: customer?._id,
            paymentMethod: paymentMethod,
            orderType: "vminstance",
            renewalDate: renewalDate,
            node: cart?.vm[0]?._id,
            region: cart?.region[0]._id,
            tag: cart?.tag,
            hostname:
              cart.quantity > 1
                ? `${cart?.hostname}-${number}`
                : cart?.hostname,
            osType: cart?.osType,
            sshKey: cart?.sshKey,
            password: cart.password,
            osVersion: cart?.osVersion,
            vmAuth: cart?.vmAuth,
            connection: cart?.vm[0].connection,
            resourceType: cart?.vm[0].type,
            productType: "vm",
            invoice: invoice._id,
            amount: price.amount,
            vCpu: cart?.vm[0].vcpu,
            storageType: cart?.vm[0].storageType,
            bandwidth: cart?.vm[0].bandwidth,
            storage: cart?.vm[0].storage,
            vmid: vmId,
            memory: cart?.vm[0].memory,
            memoryType: cart?.vm[0].memoryType,
            initAmount: price.amount, // tax will be included in the future
            withBackup: true,
            period: cart.term,
            number,
            autoRenew: customer?.autoRenewal,
          };
        })
      );

      // inserting orders to database
      Orders.insertMany(cartsIterate)
        .then(async (result: any) => {
          let inc = await Promise.all(
            result.map(async (item, key) => {
              return {
                _id: mongoose.Types.ObjectId(),
                description: `${cart?.osType}-${cart?.vm[0].vcpu}vcpu-${
                  cart?.vm[0].memory
                }${cart?.vm[0].memoryType}-${
                  cart?.region[0]?.locationName
                }-${cart?.region[0]?.name.toLowerCase()}-${key + 1}`,
                quantity: 1,
                taxexempt: true, // tax will be included here
                amount: parseFloat(price.amount),
                total_amount: parseFloat(price.amount),
                type: "vm",
                end: renewalDate,
                invoice: invoice._id,
                customer: customer?._id,
                order: item._id,
              };
            })
          );

          // creating invoice items
          let iItem = await InvoiceItems.insertMany(inc)
            .then(async (result: any) => {
              await PaymentReceipt(customer, `${invoice._id}`, "");
              await VmCart.deleteOne({ _id: cartId });
            })
            .catch((err) => {
              reject(err);
            });

          resolve({ invoice, total });
        })
        .catch((err: any) => {
          console.log(err);

          reject(err);
        });
    });
  });
};

export default doVmsOrder;
