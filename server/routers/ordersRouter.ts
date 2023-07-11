import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
  BillingAddress,
  Customers,
  Orders,
  ServerConnections,
  mongoose,
} from "../../database";
import { BillingType } from "../../Types/CustomerType";
import { SignUpBillingInterface } from "../../Types/SignUpBillingInterface";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { PaginationInterface } from "../../Types/PaginationInterface";
import { PanelServerPropsInterface } from "../../Types/PanelServerPropsInterface";
import pleskUserChart from "./utils/pleskUserChart";

export const t = initTRPC.create();
export const ordersRouter = router({
  hostingList: procedure
    .input(z.custom<PaginationInterface>())
    .query(({ ctx, input }: { ctx: any; input: PaginationInterface }) => {
      // console.log(ctx.session);

      return new Promise((resolve, reject) => {
        let id = ctx?.session?.customer[0]?._id;

        Orders.paginate(
          { customer: [id], productType: "hosting" },
          { ...input }
        )
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),

  domainList: procedure
    .input(z.custom<PaginationInterface>())
    .query(({ ctx, input }: { ctx: any; input: PaginationInterface }) => {
      // console.log(ctx.session);

      return new Promise((resolve, reject) => {
        let id = ctx?.session?.customer[0]?._id;

        Orders.paginate(
          { customer: [id], orderType: "Domain Names" },
          { ...input }
        )
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),

  updateChart: procedure
    .input(z.custom<PanelServerPropsInterface>())
    .query(({ input }) => {
      return new Promise(async (resolve, reject) => {
        let order: any = await Orders.findOne({ _id: input.order }).populate(
          "Products"
        );

        let serverConnect = await ServerConnections.findOne({
          _id: input?.server,
        });

        switch (serverConnect.type) {
          case "plesk":
            let plesk = await pleskUserChart(serverConnect, order?.domain);

            resolve(plesk);
            break;
          case "cpanel":
            resolve({});
            break;
          default:
            resolve({});
            break;
        }
      });
    }),

  asyncOrder: procedure
    .input(
      z.object({
        id: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      return await new Promise(async (resolve, reject) => {
        Orders.findOne({ _id: input?.id })
          .populate([
            { path: "Products", populate: ["connectionOption"] },
            { path: "customer" },
            { path: "invoice" },
            { path: "extension" },
            { path: "whois" },
            { path: "nslist" },
            { path: "hostMeta" },
          ])
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            // console.log(err);

            resolve({});
          });
      });
    }),
});
