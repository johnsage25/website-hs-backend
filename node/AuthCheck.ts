import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import { Sessions } from "../database";
import { verifyJwt } from "./JwtAuth";
const cookie = require("cookie");
var JWT_SALT = process.env.JWT_SALT;
var jwt = require("jsonwebtoken");

/// checking user session from database
var timezones = require("timezones-list");
export const AuthCheck = async (
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  return await new Promise((resolve, reject) => {
    if (_.isUndefined(req?.cookies["hostspacing-session"])) {
      resolve(null);
    }

    if (!_.isEmpty(req?.cookies["hostspacing-session"])) {
      verifyJwt(req?.cookies["hostspacing-session"], JWT_SALT)
        .then(async (result: any) => {
          const { session_id } = result?.payload;

          let session = await Sessions.findOne({
            _id: session_id,
          }).populate([
            {
              path: "customer",
              populate: {
                path: "BillingAddress",
                model: "BillingAddress",
              },
            },
          ]);

          let mail_completed = req?.cookies["_email_t1"] || "false";
          let customer = session?.customer[0];
          // forcing page to redirect to another page

          if (session) {
            var gravatar = require("gravatar");
            let image_url = gravatar.url(session?.customer[0].email, {
              s: "200",
              r: "pg",
            });

            resolve({
              ...JSON.parse(JSON.stringify(session)),
              timezones,
              image_url,
              mail_completed,
            });
          } else {
            resolve({});
          }
        })
        .catch((err: any) => {
          res?.setHeader("Set-Cookie", [
            cookie.serialize("hostspacing-session", "", {
              expires: new Date(0),
              path: "/",
            }),
          ]);

          resolve({});
        });
    }
  });
};
