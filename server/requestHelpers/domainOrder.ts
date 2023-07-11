import collect from "collect.js";
import React from "react";
import {
  DomainOrders,
  InvoiceItems,
  Orders,
  WhoisRecords,
  mongoose,
} from "../../database";
var moment = require("moment");

const domainOrder = async (
  invoiceId?: string,
  cart?: any,
  customerId?: string,
  paymentMethod?: string,
  whois?: any
) => {
  return Promise.all(
    cart?.domainSelected?.map(async (item: any) => {
      let renewalDate = moment().add(item?.term, "year");

      return new Promise((resolve, reject) => {
        Orders.create({
          _id: mongoose.Types.ObjectId(),
          domain: item?.domainName,
          term: item?.term,
          peroid: "yearly",
          extension: [item?.tldId],
          customer: [customerId],
          invoice: [invoiceId],
          orderType: "Domain Names",
          paymentMethod,
          autoRenew: true,
          initAmount: item.promo ? item.promoRegisterPrice : item.registerPrice,
          amount: item.renewPrice,
          nameServerList: [
            { key: "ns1", number: 1, value: "ns1.serverspacing.com" },
            { key: "ns2", number: 2, value: "ns2.serverspacing.com" },
            { key: "ns3", number: 3, value: "" },
            { key: "ns4", number: 4, value: "" },
          ],
          renewalDate,
          domainPrivacy: item?.domainPrivacy,
        })
          .then(async (result) => {
            // console.log(whois, result._id);

            await WhoisRecords.create({
              ...whois,
              order: result._id,
              _id: mongoose.Types.ObjectId(),
            });

            InvoiceItems.create({
              _id: mongoose.Types.ObjectId(),
              description: `${item?.domainName} (Domain Registration) | Yearly`,
              quantity: 1,
              taxexempt: true, // tax will be included here
              amount: item.promo ? item.promoRegisterPrice : item.registerPrice,
              total_amount: item.promo
                ? item.promoRegisterPrice
                : item.registerPrice,
              invoice: [invoiceId],
              customer: [customerId],
              order: [result._id],
            });

            resolve(result);
          })
          .catch((err) => {
            // console.log(err);
            resolve({});
          });
      });
    })
  );
};

export default domainOrder;
