import _ from "lodash";
import { Cart, Products, VmCart } from "../database";
import { NextApiRequest, NextApiResponse } from "next";
import collect from "collect.js";
import { getPercentageAmount } from "../utils/helpers";

function convertUsdToNgn(amountUsd: number, rate: number): number {
  const amountNgn = amountUsd * rate;
  return amountNgn * 100;
}

export const PayStackVM = async (context: any) => {
  return new Promise(async (resolve, reject) => {
    const query = context.query;

    if (!_.isEmpty(query)) {
      let cart: any = await VmCart.findById(query.id).populate([
        { path: "vm", populate: ["pricing"] },
        { path: "region" },
      ]);

      const pricing = cart?.vm[0]?.pricing.filter(
        (item) => item.period == cart?.term
      );

      let amount: any = getPercentageAmount(pricing[0]?.amount, pricing[0]?.discount);

      let amountInNGN = convertUsdToNgn(
        amount * cart?.quantity,
        parseInt(`${process.env.NGNRATE}`)
      );

      let config = {
        reference: new Date().getTime().toString(),
        amount: parseInt(amountInNGN.toFixed(2)),
        publicKey: process.env.publicKey,
      };
      resolve(config);
    } else {
      resolve({});
    }
  });
};
