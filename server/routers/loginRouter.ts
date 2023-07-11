import { procedure, router } from "../trpc";
import { z } from "zod";
import { LoginInterface } from "../../Types/LoginInterface";
import { Customers, mongoose, Sessions } from "../../database";
var geoip = require("geoip-lite");
const bcrypt = require("bcrypt");
var randomstring = require("randomstring");
const jwt = require("jose").jwt;
import { serialize } from "cookie";
import * as trpc from "@trpc/server";
import { browser } from "process";
import { signJwt } from "../../node/JwtAuth";
var useragent = require("useragent");
const requestIp = require("request-ip");
var randomip = require("random-ip");

export const loginRouter = router({
  doEmail: procedure
    .input(z.custom<LoginInterface>())
    .mutation(async ({ ctx, input }: { ctx: any; input: LoginInterface }) => {
      const { req } = ctx;
      var agent = useragent.parse(req.headers["user-agent"]);

      const clientIp = requestIp.getClientIp(req);

      let ip = clientIp == "::1" ? randomip("216.131.108.1", 24) : clientIp;

      let geo = geoip.lookup(ip);

      const customer = await Customers.findOne({
        $or: [{ email: input.email }, { username: input.email }],
      });
      var JWT_SALT = process.env.JWT_SALT;

      let compare = await new Promise((resolve, reject) => {
        bcrypt.compare(
          input.password,
          customer.password,
          function (err: any, result: any) {
            resolve(result);
          }
        );
      });

      if (compare) {
        const session: any = await new Promise((resolve, reject) => {
          // set email message sent to use after login

          Sessions.create({
            _id: mongoose.Types.ObjectId(),
            customer: customer._id,
            createdAt: new Date(),
            updatedAt: new Date(),
            browser_signature: "",
            browser: agent.toAgent(),
            os: agent.os.toString(),
            ip: ip,
            device: agent.device.toString(),
            ...geo,
            latitude: geo.ll,
          })
            .then(async (result: any) => {

              let token = await signJwt(
                {
                  session_id: result._id,
                  customer_id: customer._id,
                  created_at: new Date(),
                },
                JWT_SALT,
                "30d"
              );

              resolve(token);
            })
            .catch((err: any) => {
              // console.log(err);
            });
        });

        if (session) {
          if (input.trust_device) {
            ctx.res.setHeader(
              "Set-Cookie",
              serialize("hostspacing-session", session, {
                path: "/",
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
              })
            );
          } else {
            ctx.res.setHeader(
              "Set-Cookie",
              serialize("hostspacing-session", session, {
                path: "/",
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
              })
            );
          }
        }

        return {
          status: true,
        };
      } else {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid login credential, please check and try again.",
          // optional: pass the original error to retain stack trace
          cause: "Invalid login",
        });
      }

      return {};
    }),
});
