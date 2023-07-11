import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/dist/server/api-utils";

const middleChecker = (
  req: NextApiRequest | any,
  res: NextApiResponse | any,
  customer: any
) => {

    // console.log(customer);

  if (!_.isEqual(req?.url, "/register")) {
    if (_.isEqual(customer?.isMobileVerify, false)) {
      redirect(res, "/mobile-verify?incomplete=true");
    }
  }

  if (!_.isEqual(req?.url, "/welcome/billing")) {
    if (_.isEqual(customer.paymentVerified, false)) {
      redirect(res, "/welcome/billing");
    }
  }

  if (_.isEqual(req?.url, "/welcome/billing")) {
    if (_.isEqual(customer.paymentVerified, true)) {
      redirect(res, "/");
    }
  }
};

export default middleChecker;
