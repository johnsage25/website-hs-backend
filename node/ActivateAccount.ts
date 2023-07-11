import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import { Customers, Sessions } from "../database";

var JWT_SALT = process.env.JWT_SALT;
var jwt = require("jsonwebtoken");
import StringCrypto from "string-crypto";
import { serialize } from "cookie";
import { AuthCheck } from "./AuthCheck";
/// checking user session from database
var timezones = require("timezones-list");

export const ActivateAccount = async (context: any) => {
  const { decryptString } = new StringCrypto();

  const { code } = context.query;

  if (code) {
    let data = JSON.parse(decryptString(code, JWT_SALT)) || {};

    return await new Promise(async (resolve, reject) => {
      Customers.findOne({ _id: data._id })
        .then(async (customer: any) => {
          if (!customer.isEmailVerify) {
            let done = await customer.update({
              verificationString: "",
              isEmailVerify: true,
            });

            const { req, res }: any = context;

            let session: any = await AuthCheck(req, res);

            if (session) {

              context.res.setHeader(
                "Set-Cookie",
                serialize("_email_t1", "true", {
                  path: "/",
                  httpOnly: true,
                })
              );

            } else {
              context.res.setHeader(
                "Set-Cookie",
                serialize("_email_t2", "true", {
                  path: "/",
                  httpOnly: true,
                })
              );
            }

            resolve({ status: "valid" });
          } else {
            resolve({ status: "invalid" });
          }
        })
        .catch((err: any) => {
          resolve({ status: "invalid" });
        });
    });
  }
};
