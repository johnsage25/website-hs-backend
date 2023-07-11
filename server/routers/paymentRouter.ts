import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
  BillingAddress,
  Cart,
  Customers,
  DomainOrders,
  Invoices,
  Orders,
  PaystackRefs,
  mongoose,
} from "../../database";
var moment = require("moment");
import { BillingType } from "../../Types/CustomerType";
import { SignUpBillingInterface } from "../../Types/SignUpBillingInterface";
import { procedure, router } from "../trpc";
import _ from "lodash";
import collect from "collect.js";
import productOrder from "../requestHelpers/productOrder";
import domainOrder from "../requestHelpers/domainOrder";
import sslOrder from "../requestHelpers/sslOrder";
import { PaystackVerificationResponse } from "../../Types/PaystackVerificationResponse";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import axios from "axios";
import { encryptText, getPercentageAmount } from "../../utils/helpers";
import { InvoiceCreated } from "../../mail/component/InvoiceCreated";
import checkIfCustomerExists from "../requestHelpers/checkStripeCustomer";
import { PaymentReceipt } from "../../mail/component/PaymentReciet";
const encryptor = require("simple-encryptor")(process.env.JWT_SALT);
export const t = initTRPC.create();

function dollarsToCents(amount: number): number {
  return Math.round(amount * 100);
}

const getTotal = (cart: any): { total: number; subTotal: number } => {
  // getting cart total

  let productTotalPrice = cart?.product?.reduce((acc: any, prod) => {
    const SelectedPackage = collect(cart?.selectedPackage);

    let pa = SelectedPackage.firstWhere("productId", prod?.id);

    let Pricing = collect(prod?.pricing);
    let priced = Pricing.firstWhere("period", pa?.period);
    let amount: any = getPercentageAmount(priced?.amount, priced?.discount);
    let backup: number = cart?.backup
      ? parseFloat(`${cart?.product[0]?.backupAmount}`)
      : 0;

    return (
      acc +
      parseFloat(amount) +
      (parseFloat(`${cart?.ssl[0]?.price}`) || 0) +
      backup
    );
  }, 0);

  const totalRegisterPrice = cart?.domainSelected.reduce(
    (acc: any, tld: any) => {
      return (
        acc +
        tld.term * (tld.promo ? tld.promoRegisterPrice : tld.registerPrice)
      );
    },
    0
  );

  let subTotal = totalRegisterPrice + (productTotalPrice || 0);
  let total = totalRegisterPrice + (productTotalPrice || 0) + 0.99; // tax fee will be added later

  return { total, subTotal };
};

export const paymentRouter = t.router({
  stripePay: procedure
    // Getting payment id from Stripe payment then finalizing
    .input(
      z.object({
        paymentId: z.string(),
        backupMethod: z.boolean().nullable(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        /// access current cart details

        let sessionId = ctx?.req?.cookies["cart"] || null;

        let cart = await Cart.findById(sessionId).populate([
          { path: "product", populate: ["package", "pricing"] },
          { path: "ssl" },
        ]);

        const { total } = getTotal(cart);

        let customer = ctx?.session?.customer[0];

        if (_.isEmpty(ctx.session)) {
          resolve({ loginRequired: true });
        } else {
          /// saving customer token for recurring payment must be following the General Data Protection Regulation (GDPR) policy

          let customerStripe;

          customerStripe = await checkIfCustomerExists(
            customer?.stripeCustomerID
          );

          if (!customerStripe) {
            customerStripe = await stripe.customers.create({
              email: customer[0]?.email,
              description: `${customer?.firstname} ${customer?.lastname}`,
            });

            await Customers.updateOne(
              { _id: customer.id },
              {
                stripeCustomerID: customerStripe.id,
              }
            );
          }

          if (input.backupMethod) {
            let dataPstring = await new Promise(async (resolveD, rejectD) => {
              if (!_.some(customerStripe.data, { email: customer[0]?.email })) {
                //creating a new account

                const customerStripeD = await stripe.customers.create({
                  email: customer[0].email,
                });

                // const paymentMethod =
                //   await stripe.paymentMethods.retrieve(input.paymentId);
                let result = await stripe.paymentMethods.attach(
                  input.paymentId,
                  {
                    customer: customerStripeD.id,
                  }
                );

                if (!_.isEmpty(result)) {
                  Customers.update(
                    { _id: customer[0]._id },
                    { cardConnected: true }
                  );
                }

                resolveD(result);
              } else {
                // const paymentMethod =
                //   await stripe.paymentMethods.retrieve(input.paymentId);

                const attachedPaymentMethod =
                  await stripe.paymentMethods.attach(input.paymentId, {
                    customer: customerStripe.id,
                  });

                resolveD(attachedPaymentMethod);
              }
            });
          }

          await stripe.paymentIntents
            .create({
              payment_method: input.paymentId,
              customer: customerStripe.id,
              amount: dollarsToCents(total), // The calculated in cents
              currency: "usd", // The currency of the payment
              confirmation_method: "manual",
              confirm: true,
            })
            .then(async (_rs: any) => {
              if (_.isEqual(_rs.status, "succeeded")) {
                let result = await DoCreateOrder(ctx, "card");
                await Cart.deleteOne({ _id: sessionId });

                resolve(result);
              } else {
                resolve(_rs);
              }
            })
            .catch((err: any) => {
              // console.log(err);
              // console.log(err);
              resolve(err);
            });
        }
      });
    }),
  getSavedCards: procedure
    // using zod schema to validate and infer input values
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(async ({ ctx, input }: { ctx: any; input: any }) => {
      let customer = ctx?.session?.customer[0];

      return new Promise(async (resolve, reject) => {
        let customerStripe;
        // console.log( customer?.stripeCustomerID);

        stripe.paymentMethods
          .list({
            customer: customer?.stripeCustomerID,
            type: "card", // Only return card payment methods
          })
          .then((result: any) => {
            let defaultd = result.data[0].id;

            resolve({ ...result, defaultd: defaultd });
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),

  payStack: procedure
    // using zod schema to validate and infer input values
    .input(
      z.object({
        reference: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      // Here some login stuff would happen
      let sessionId = ctx?.req?.cookies["cart"] || null;
      return new Promise(async (resolve, reject) => {
        axios
          .get(
            `https://api.paystack.co/transaction/verify/${input.reference}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.secretKey}`,
              },
            }
          )
          .then(async (result: any) => {
            let res: PaystackVerificationResponse = result.data;

            let check = await PaystackRefs.exists({ refId: input.reference });

            if (!_.isEmpty(check)) {
              resolve({ status: false });
            } else {
              if (_.isEqual(res.data?.status, "success")) {
                let data = result.data;

                PaystackRefs.create({
                  _id: mongoose.Types.ObjectId(),
                  refId: input.reference,
                  status: "completed",
                })
                  .then(async (resultd) => {
                    let result = await DoCreateOrder(ctx, "paystack");
                    await Cart.deleteOne({ _id: sessionId });

                    resolve(result);
                  })
                  .catch((err) => {});
              } else {
                resolve({ error: true });
              }
            }
          })
          .catch((err: any) => {
            resolve({ error: true });
          });
      });
    }),
});

const DoCreateOrder = async (ctx: any, paymentChanel: string) => {
  let sessionId = ctx?.req?.cookies["cart"] || null;

  let cart = await Cart.findById(sessionId).populate([
    { path: "product", populate: ["package", "pricing"] },
    { path: "ssl" },
  ]);

  let customer = ctx?.session?.customer;

  // before creating order we have to create the invoice
  const { total, subTotal } = getTotal(cart);

  let invoiceCreated: any = await new Promise((resolved, rejectd) => {
    Invoices.create({
      _id: mongoose.Types.ObjectId(),
      customer: customer[0].id,
      subTotal: subTotal,
      total: total,
      type: "general",
      taxed: 0.99,
      paymentStatus: "paid",
      paymentMethod: paymentChanel || "card",
    })
      .then(async (invoice: any) => {
        /// creating product after invoice
        new Promise(async (resolve, reject) => {
          const generateCode = () => {
            const code = Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0");
            const expiration = Date.now() + 60 * 1000; // set expiration time to 1 minute from now
            return { code, expiration };
          };

          if (!_.isEmpty(cart?.product)) {
            // We have to create product from the cart created. Base on type of product.
            let _pr = await productOrder(
              invoice?.id,
              cart,
              customer[0].id,
              paymentChanel || "card"
            );
          }

          if (!_.isEmpty(cart?.domainSelected)) {
            let whois = ctx?.session.whoisData;
            /* The domain order will be create and the promo, will be check so that the customer can confirm it */
            let _dr = await domainOrder(
              invoice?.id,
              cart,
              customer[0].id,
              paymentChanel || "card",
              whois
            );
          }

          if (!_.isEmpty(cart?.ssl)) {
            let _ssl = await sslOrder(
              invoice?.id,
              cart,
              customer[0].id,
              paymentChanel || "card"
            );
          }

          let transactionCode = {
            invoiceId: invoice?.id,
            status: "success",
            date: invoice?.createAt,
            total,
            code: generateCode().code,
            expiration: generateCode().expiration,
          };

          const encryptedText = encryptor.encrypt(transactionCode);

          resolve({ code: encodeURIComponent(encryptedText), done: true });
        })
          .then(async (result: any) => {
            await PaymentReceipt(customer[0], `${invoice?.id}`, "");

            resolved(result);
          })
          .catch((err) => {});
      })
      .catch((err: any) => {
        rejectd(err);
      });
  });

  return invoiceCreated;
};
