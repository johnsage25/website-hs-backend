import collect from "collect.js";
import React from "react";
import { InvoiceItems, Orders, SSLOrders, mongoose } from "../../database";
var moment = require("moment");

const sslOrder = async (
  invoiceId?: string,
  cart?: any,
  customerId?: string,
  paymentMethod?:string
) => {
  return Promise.all(
    cart?.ssl?.map((item: any) => {
      let selectedDomain = cart?.domainSelected[0]?.domainName;
      let renewalDate = moment().add(1, "year");
      return new Promise((resolve, reject) => {
        Orders.create({
          _id: mongoose.Types.ObjectId(),
          domainName: selectedDomain,
          term: 1, // this might be updated in the future.
          sslCertificate: [item._id],
          customer: [customerId],
          orderType: "SSL Certificates",
          autoRenew: true,
          paymentMethod,
          invoice: [invoiceId],
          amount: item.price,
          renewalDate: renewalDate,
        })
          .then((result: any) => {
            InvoiceItems.create({
              _id: mongoose.Types.ObjectId(),
              description: `${item.name} (SSL Certificate) | Yearly`,
              quantity: 1,
              taxexempt: true, // tax will be included here
              amount: item.price,
              total_amount:item.price,
              invoice: [invoiceId],
              customer: [customerId],
              order: [result._id],
            });

            resolve(result);
          })
          .catch((err) => {
            resolve({});
          });
      });
    })
  );
};

export default sslOrder;
