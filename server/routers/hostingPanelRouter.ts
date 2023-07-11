import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
  BillingAddress,
  Customers,
  HostMetas,
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
import pleskSession from "./utils/pleskSession";
import pleskEmailList from "./utils/pleskPasswordUpdate";
import pleskPasswordUpdate from "./utils/pleskPasswordUpdate";

const Order = (orderId: string) => {
  return new Promise((resolve, reject) => {
    Orders.findOne({ _id: orderId })
      .populate([
        { path: "Products", populate: ["connectionOption"] },
        { path: "customer", populate: ["BillingAddress"] },
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
        reject(err);
      });
  });
};

export const t = initTRPC.create();
export const hostingPanelRouter = router({
  createSession: procedure
    .input(
      z.object({
        orderId: z.string(),
        type: z.string(),
      })
    )
    .mutation(({ input }) => {
      return new Promise(async (resolve, reject) => {
        let order: any = await Order(input.orderId);

        let connection = order?.Products?.connectionOption[0];

        switch (connection.type) {
          case "plesk":
            let plesk: any = await pleskSession(connection, order, input.type);
            resolve(plesk);

            break;

          default:
            break;
        }

        resolve(order);
      });
    }),

  emailSession: procedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .mutation(({ input }) => {
      return new Promise(async (resolve, reject) => {
        let order: any = await Order(input.orderId);
        let connection = order?.Products?.connectionOption[0];

        switch (connection.type) {
          case "plesk":
            let domain = order.domain?.replace(/^https?:\/\/(www\.)?/, "");

            resolve({ status: true, url: `https://webmail.${domain}` });

            break;

          default:
            break;
        }

        resolve(order);
      });
    }),

  panelAction: procedure
    .input(
      z.object({
        orderId: z.string(),
        type: z.string(),
      })
    )
    .mutation(({ input }) => {
      return new Promise(async (resolve, reject) => {
        let order: any = await Order(input.orderId);
        let connection = order?.Products?.connectionOption[0];

        switch (connection.type) {
          case "plesk":
            let plesk: any = await pleskSession(connection, order, input.type);
            resolve(plesk);

            break;

          default:
            break;
        }

        resolve(order);
      });
    }),

  passwordUpdate: procedure
    .input(
      z.object({
        orderId: z.string(),
        password: z.string(),
      })
    )
    .mutation(({ input }) => {
      return new Promise(async (resolve, reject) => {
        let order: any = await Order(input.orderId);
        let connection = order?.Products?.connectionOption[0];

        switch (connection.type) {
          case "plesk":

            let plesk: any = await pleskPasswordUpdate(
              connection,
              order,
              input.password
            );

            if (_.isEqual(plesk.status, true)) {
              await HostMetas.updateOne({
                order: order.id,
                password: input.password,
              });
              resolve(plesk);
            } else {
              reject(new Error("Password update failed."));
            }

            break;

          default:
            break;
        }

        resolve(order);
      });
    }),
});
