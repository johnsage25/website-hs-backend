import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { BillingAddress, Customers, Invoices, mongoose } from "../../database";
import { BillingType } from "../../Types/CustomerType";
import { SignUpBillingInterface } from "../../Types/SignUpBillingInterface";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { PaginationInterface } from "../../Types/PaginationInterface";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

function dollarsToCents(amount: number): number {
  return Math.round(amount * 100);
}

export const t = initTRPC.create();
export const accountRouter = router({
  enableAutoBackup: procedure
    .input(
      z.object({
        enable: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise((resolve, reject) => {
        Customers.update(
          { _id: ctx?.session.customer[0]._id },
          { autoBackup: input.enable }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  enableAutoRenewal: procedure
    .input(
      z.object({
        enable: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise((resolve, reject) => {
        Customers.update(
          { _id: ctx?.session.customer[0]._id },
          { autoRenewal: input.enable }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),
  enableHostSpacing: procedure
    .input(
      z.object({
        enable: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise((resolve, reject) => {
        Customers.update(
          { _id: ctx?.session.customer[0]._id },
          { allowHostSpacing: input.enable }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  billingHistory: procedure
    .input(z.custom<PaginationInterface>())
    .query(async ({ ctx, input }: { ctx: any; input: any }) => {

      let customer = ctx?.session?.customer;

      // console.log( customer[0]._id);


      return new Promise((resolve, reject) => {
        Invoices.paginate({customer: customer[0]._id}, { ...input })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
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
      let customer = ctx?.session?.customer;

      return new Promise(async (resolve, reject) => {
        const customerStripe = await stripe.customers.list({
          email: customer[0].email,
          limit: 1, // Only return one customer object
        });

        stripe.paymentMethods
          .list({
            customer: customerStripe.data[0]?.id,
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

  addCardWithStripe: procedure
    .input(
      z.object({
        paymentId: z.string(),
        tos: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      let customer = ctx?.session?.customer;

      return new Promise(async (resolve, reject) => {
        const customerStripe = await stripe.customers.list({
          email: customer[0]?.email,
          limit: 1, // Only return one customer object
        });

        resolve({});

        const paymentIntent = await stripe.paymentIntents.create({
          customer: customerStripe.data[0].id,
          // setup_future_usage: "off_session",
          amount: dollarsToCents(0.50),
          currency: "usd",
          confirm: true,
          off_session: true,
          payment_method: input.paymentId,
          automatic_payment_methods: { enabled: true },
          return_url: "http://localhost/return"
        });

        // console.log(paymentIntent);

        // await stripe.paymentIntents
        //   .create({
        //     payment_method: input.paymentId,
        //     customer: customerStripe.data[0].id,
        //     amount: 0.0, // The calculated in cents
        //     currency: "usd", // The currency of the payment
        //     confirmation_method: "manual",
        //     confirm: true,
        //   })
        //   .then(async (_rs: any) => {
        //     if (_.isEqual(_rs.status, "succeeded")) {
        //       // console.log(_rs);

        //       resolve(_rs);
        //     } else {
        //       resolve(_rs);
        //     }
        //   })
        //   .catch((err: any) => {
        //     // console.log(err);
        //     resolve(err);
        //   });
      });

      return {
        user: {
          role: "ADMIN",
        },
      };
    }),
});
