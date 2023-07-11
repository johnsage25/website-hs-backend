import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { BillingAddress, Customers, mongoose } from "../../database";
import { BillingType } from "../../Types/CustomerType";
import { SignUpBillingInterface } from "../../Types/SignUpBillingInterface";
import { procedure, router } from "../trpc";
import _ from "lodash";

export const t = initTRPC.create();

export const billingRouter = t.router({
  // BillingAddress
  billingAddress: procedure
    .input(
      z.object({
        text: z.string().nullable(),
      })
    )
    .query(async ({ ctx, input }: { ctx: any; input: any }) => {
      return await new Promise((resolve, reject) => {

        Customers.findOne({ _id: [ctx?.session?.customer[0]._id] })
          .populate("BillingAddress")
          .then((result: any) => {
            if (result) {

              resolve(result);
            } else {
              reject({});
            }
          })
          .catch((err: any) => {
            reject({});
          });
      });
    }),

  // mutation

  updateBilling: procedure
    // using zod schema to validate and infer input values
    .input(z.custom<BillingType>())
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      if (_.isUndefined(input._id)) {
        return new Promise(async (resolve, reject) => {
          let c = await Customers.updateOne(
            { _id: ctx?.session.customer[0]._id },
            {
              firstname: input?.firstname,
              lastname: input?.lastname,
            }
          );

          BillingAddress.create({
            _id: mongoose.Types.ObjectId(),
            customer: ctx?.session.customer[0]._id,
            ...input,
          })
            .then((result: any) => {
              resolve(result);
            })
            .catch((err: any) => {
              reject(err);
            });
        });
      } else {
        return await new Promise( async (resolve, reject) => {
          let c = await Customers.updateOne(
            { _id: ctx?.session.customer[0]._id },
            {
              firstname: input?.firstname,
              lastname: input?.lastname,
            }
          );

          BillingAddress.updateOne({ _id: input._id }, { ...input })
            .then((result: any) => {
              resolve(result);
            })
            .catch((err: any) => {
              reject(err);
            });
        });
      }
    }),
});
