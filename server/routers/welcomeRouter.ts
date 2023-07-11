import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { CreateNodeInterface } from "../../Types/CreateNodeInterface";
import { VerifyCardBillingInterface } from "../../Types/VerifyCardBillingInterface";
import { Customers } from "../../database";
import { CustomerType } from "../../Types/CustomerType";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

function dollarsToCents(amount: number): number {
  return Math.round(amount * 100);
}

export const t = initTRPC.create();

export const welcomeRouter = t.router({
  verifyCard: procedure
    .input(z.custom<VerifyCardBillingInterface>())
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        let customer: CustomerType = ctx?.session?.customer;

        const customerStripeD = await stripe.customers.create({
          name: `${input.cardname}`,
          email: customer[0].email,
          address: {
            line1: input.address,
            line2: "",
            city: input.city,
            state: input.state,
            postal_code: input.postalcode,
            country: input.country,
          },
        });

        stripe.paymentIntents
          .create({
            amount: dollarsToCents(1),
            currency: "usd",
            customer: customerStripeD.id,
            payment_method_types: ["card"],
            payment_method: input.paymentId,
            confirm: true,
            confirmation_method: "manual",
            setup_future_usage: "off_session",
          })

          .then(async (result: any) => {
            let att = await stripe.paymentMethods.attach(input.paymentId, {
              customer: customerStripeD.id,
            });

            const refund = await stripe.refunds.create({
              payment_intent: result.id,
            });

            if (result.status == "succeeded") {
              await Customers.updateOne(
                { _id: customer[0]._id },
                {
                  paymentVerified: true,
                  stripeCustomerID: customerStripeD.id,
                }
              );
            }

            resolve({ status: true, message: "account verified" });
          })
          .catch((err: any) => {
            reject(new Error(err.message));
          });
      });
    }),
});
