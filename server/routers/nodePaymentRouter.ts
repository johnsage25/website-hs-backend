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
  VmCart,
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
import { encryptText } from "../../utils/helpers";
import { InvoiceCreated } from "../../mail/component/InvoiceCreated";
import doVmsOrder from "../requestHelpers/doVmsOrder";
import { PaymentReceipt } from "../../mail/component/PaymentReciet";
import checkIfCustomerExists from "../requestHelpers/checkStripeCustomer";
export const t = initTRPC.create();

const encryptor = require("simple-encryptor")(process.env.JWT_SALT);

function dollarsToCents(amount: number): number {
  return Math.round(amount * 100);
}

export const nodePaymentRouter = t.router({
  stripePay: procedure
    // Getting payment id from Stripe payment then finalizing
    .input(
      z.object({
        paymentId: z.string(),
        backupMethod: z.boolean().nullable(),
        cartId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        /// access current cart details

        let sessionId = ctx?.req?.cookies["cart"] || null;

        let cart = await Cart.findById(sessionId).populate([
          { path: "product", populate: "package" },
          { path: "ssl" },
        ]);

        let customer: any = ctx?.session?.customer[0];

        if (_.isEmpty(ctx.session)) {
          resolve({ loginRequired: true });
        } else {
          /// getting stripe customer

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

          /// saving card after payment

          if (input.backupMethod) {
            let result = await stripe.paymentMethods.attach(input.paymentId, {
              customer: customerStripe.id,
            });

            if (!_.isEmpty(result)) {
              Customers.update({ _id: customer.id }, { cardConnected: true });
            }
          }

          /// creating cart for VM

          let cart: any = await VmCart.findById(input.cartId).populate([
            { path: "vm", populate: ["pricing"] },
            { path: "region" },
          ]);

          /// generate invoice here

          // get total to bill
          let quantity = cart?.quantity;
          let term = cart?.term;
          let price =
            cart?.vm[0]?.pricing.filter((item) => item.period == term)[0] || 0;

          await stripe.paymentIntents
            .create({
              payment_method: input.paymentId,
              customer: customerStripe.id,
              amount: dollarsToCents(price.amount * quantity), // The calculated in cents
              currency: "usd", // The currency of the payment
              confirmation_method: "manual",
              confirm: true,
            })
            .then(async (_rs: any) => {
              if (_.isEqual(_rs.status, "succeeded")) {
                let p: any = await doVmsOrder(input.cartId, customer, "card");

                const generateCode = () => {
                  const code = Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, "0");
                  const expiration = Date.now() + 60 * 1000; // set expiration time to 1 minute from now
                  return { code, expiration };
                };

                let transactionCode = {
                  invoiceId: p?.invoice?._id,
                  status: "success",
                  date: p?.invoice?.createdAt,
                  total: p?.total,
                  code: generateCode().code,
                  expiration: generateCode().expiration,
                };

                const encryptedText = encryptor.encrypt(transactionCode);

                resolve({
                  status: true,
                  action: `completed`,
                  token: encodeURIComponent(encryptedText),
                });
                console.log(_rs);
              } else {
                resolve(_rs);
              }
            })
            .catch((err: any) => {
              // console.log(err);
              resolve(err);
            });

          resolve({});

          // console.log(input);
        }
      });
    }),

  payStack: procedure
    // using zod schema to validate and infer input values
    .input(
      z.object({
        reference: z.string().nullable(),
        cartId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      // Here some login stuff would happen
      let sessionId = ctx?.req?.cookies["cart"] || null;
      let customer: any = ctx?.session?.customer[0];

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

            console.log("paystack====================================");
            console.log(check);
            console.log("====================================");

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
                  .then(async (result) => {
                    let p: any = await doVmsOrder(
                      input.cartId,
                      customer,
                      "paystack"
                    );

                    const generateCode = () => {
                      const code = Math.floor(Math.random() * 10000)
                        .toString()
                        .padStart(4, "0");
                      const expiration = Date.now() + 60 * 1000; // set expiration time to 1 minute from now
                      return { code, expiration };
                    };

                    let transactionCode = {
                      invoiceId: p?.invoice?._id,
                      status: "success",
                      date: p?.invoice?.createdAt,
                      total: p?.total,
                      code: generateCode().code,
                      expiration: generateCode().expiration,
                    };

                    const encryptedText = encryptor.encrypt(transactionCode);

                    resolve({
                      status: true,
                      action: `completed`,
                      token: encodeURIComponent(encryptedText),
                    });
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
