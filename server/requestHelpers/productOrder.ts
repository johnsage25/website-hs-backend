import collect, { Collection } from "collect.js";
import React from "react";
import { InvoiceItems, Orders, mongoose } from "../../database";
import _ from "lodash";
import { PackageTerms, getPercentageAmount } from "../../utils/helpers";
var moment = require("moment");

const productOrder = async (
  invoiceId?: string,
  cart?: any,
  customerId?: string,
  paymentMethod?: string
) => {
  return Promise.all(
    cart?.product?.map(async (item) => {
      const selectedPackage = collect(cart?.selectedPackage);
      let slected = selectedPackage.firstWhere("productId", item.id);
      let peroidD = collect(PackageTerms);
      // selecting current price
      const pricing = collect(item.pricing);

      var renewalDate = null;

      switch (slected?.period) {
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

      let domainName = !_.isEmpty(slected.domain)
        ? slected.domain
        : cart?.domainSelected[0]?.domainName;

      return new Promise(async (resolve, reject) => {
        let backupAmount = _.isEqual(cart?.backup, true)
          ? item.backupAmount
          : 0;

        let orderItem = {
          _id: mongoose.Types.ObjectId(),
          type: 1,
          period: slected?.period,
          renewalDate,
          productType: item?.productType,
          invoice: [invoiceId],
          customer: [customerId],
          withBackup: cart?.backup,
          paymentMethod: paymentMethod,
          orderType: "Hosting Packages",
          serviceName: item?.productName,
          preInstall: cart?.preinstall,
          amount:
            parseFloat(pricing.firstWhere("period", slected?.period).amount) +
            parseFloat(backupAmount),
          initAmount:
            parseFloat(pricing.firstWhere("period", slected?.period).amount) +
            parseFloat(backupAmount), // Here we calculate the promo value
          autoRenew: true,
          Products: [item.id],
          domain: !_.isEmpty(slected.domain) // generate domain
            ? slected.domain
            : cart?.domainSelected[0]?.domainName || "",
        };

        let amount: any = getPercentageAmount(
          pricing.firstWhere("period", slected?.period).amount,
          pricing.firstWhere("period", slected?.period)?.discount
        );
        await Orders.create(orderItem)
          .then((result: any) => {
            InvoiceItems.create({
              _id: mongoose.Types.ObjectId(),
              description: `${item.productName} (Cloud Hosting) ${
                _.isEqual(cart?.backup, true) ? "+ Backup" : ""
              } ${!_.isEmpty(domainName) ? `(${domainName})` : ""} | ${
                peroidD.firstWhere("value", slected?.period).label
              }`,
              quantity: 1,
              taxexempt: true, // tax will be included here
              amount: parseFloat(amount) + parseFloat(backupAmount),
              total_amount:
                parseFloat(
                  pricing.firstWhere("period", slected?.period).amount
                ) + parseFloat(backupAmount),
              invoice: [invoiceId],
              customer: [customerId],
              order: [result._id],
            });
            resolve(result);
          })
          .catch((err: any) => {
            console.log(err);

            resolve({});
          });

        resolve({});
      });
    })
  );
};

export default productOrder;
