import { procedure, router } from "../trpc";
import { z } from "zod";
var JWT_SALT = process.env.JWT_SALT;
var jwt = require("jsonwebtoken");
import _ from "lodash";
import { BillingAddress, Customers, Sessions } from "../../database";
import { verifyJwt } from "../../node/JwtAuth";
const cookie = require("cookie");

export const appRouter = router({
  user: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(async ({ ctx, input }: { ctx: any; input: any }) => {
      const { req, res } = ctx;

      return await new Promise((resolve, reject) => {
        if (_.isUndefined(req?.cookies["hostspacing-session"])) {
          resolve(null);
        }

        if (!_.isEmpty(req?.cookies["hostspacing-session"])) {
          verifyJwt(req?.cookies["hostspacing-session"], JWT_SALT)
            .then(async (result: any) => {
              // console.log(result?.payload);

              const { customer_id } = result?.payload;
              let customer = await Customers.findOne({
                _id: customer_id,
              });

              resolve(customer);
            })
            .catch((err: any) => {
              reject(null);
            });
        }
      });
    }),

  // Logout

  logout: procedure.mutation(
    async ({ ctx, input }: { ctx: any; input: any }) => {
      return await Sessions.deleteOne({ _id: ctx?.session._id })
        .then((re: any) => {
          ctx?.res.setHeader("Set-Cookie", [
            cookie.serialize("hostspacing-session", "", {
              expires: new Date(0),
              path: "/",
            }),
          ]);
          return {
            status: true,
            error: false,
          };
        })
        .catch(() => {
          return {
            status: false,
            error: true,
          };
        });
    }
  ),

  removeEmailNotice: procedure.mutation(
    ({ ctx, input }: { ctx: any; input: any }) => {
      if (ctx?.session) {
        ctx?.res.setHeader("Set-Cookie", [
          cookie.serialize("_email_t1", "", {
            expires: new Date(0),
            path: "/",
          }),
        ]);
      } else {
        ctx?.res.setHeader("Set-Cookie", [
          cookie.serialize("_email_t2", "", {
            expires: new Date(0),
            path: "/",
          }),
        ]);
      }

      return {
        status: true,
      };
    }
  ),
});
