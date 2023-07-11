import { TRPCError, initTRPC } from "@trpc/server";
import _ from "lodash";
import { Customers, Sessions } from "../database";
import { BillingAddress } from "../Types/InvoiceInterface";
import { CustomerType } from "../Types/CustomerType";
import { verifyJwt } from "../node/JwtAuth";
var JWT_SALT = process.env.JWT_SALT;
var jwt = require("jsonwebtoken");
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create();

const cookieSession = t.middleware(
  async ({ ctx, next }: { ctx: any; next: any }) => {
    const { req, res } = ctx;

    if (_.isUndefined(req?.cookies["hostspacing-session"])) {
      return next({
        ctx: {
          ...ctx,
          session: null,
        },
      });
    }

    let _customerSession = await new Promise((resolve, reject) => {
      if (!_.isEmpty(req?.cookies["hostspacing-session"])) {
        verifyJwt(req?.cookies["hostspacing-session"], JWT_SALT)
          .then(async (result: any) => {

            const { session_id } = result?.payload;

            let session = await Sessions.findOne({
              _id: session_id,
            }).populate([{ path: "customer", populate: "BillingAddress" }]);

            let b: BillingAddress = session?.customer[0]?.BillingAddress[0];
            let c: CustomerType = session?.customer[0];

            let whoisData =
              {
                email: c?.email,
                mobile: c?.mobile,
                address: b?.address,
                firstname: c?.firstname,
                lastname: c?.lastname,
                company: b?.companyname,
                city: b?.city,
                postalcode: b?.postalcode,
                country: b?.country,
                state: b?.state,
                Fax: "",
                FaxCountryCode: "",
              } || {};

            let compine = _.extend(session, { whoisData });

            resolve(compine);
          })
          .catch((err: any) => {});
      }
    });

    return next({
      ctx: {
        ...ctx,
        session: _customerSession,
      },
    });
  }
);

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure.use(cookieSession);
