import _ from "lodash";
import { Cart, Products } from "../database";
import { NextApiRequest, NextApiResponse } from "next";
import collect from "collect.js";
import { getPercentageAmount } from "../utils/helpers";

function convertUsdToNgn(amountUsd: number, rate: number): number {
  const amountNgn = amountUsd * rate;
  return amountNgn * 100;
}

const getTotal = (cart: any): { total: number; subTotal: number } => {
  // getting cart total

  let productTotalPrice = cart?.product?.reduce((acc: any, prod) => {
    const SelectedPackage = collect(cart?.selectedPackage);

    let pa = SelectedPackage.firstWhere("productId", prod?.id);

    let Pricing = collect(prod?.pricing);
    let priced = Pricing.firstWhere("period", pa?.period);

    let amount: any = getPercentageAmount(priced?.amount, priced?.discount);

    let backup: number = cart?.backup
      ? parseFloat(`${cart?.product[0]?.backupAmount}`)
      : 0;

    return (
      acc +
      parseFloat(amount) +
      (parseFloat(`${cart?.ssl[0]?.price}`) || 0) +
      backup
    );
  }, 0);

  const totalRegisterPrice = cart?.domainSelected.reduce(
    (acc: any, tld: any) => {
      return (
        acc +
        tld.term * (tld.promo ? tld.promoRegisterPrice : tld.registerPrice)
      );
    },
    0
  );

  let subTotal = totalRegisterPrice + (productTotalPrice || 0);
  let total = totalRegisterPrice + (productTotalPrice || 0) + 0.99; // tax fee will be added later

  return { total, subTotal };
};

export const payStack = async (req?: NextApiRequest, res?: NextApiResponse) => {
  let cartId = req?.cookies["cart"] || null;

  return new Promise(async (resolve, reject) => {
    if (req?.cookies["cart"]) {
      let cart = await Cart.findById(cartId).populate([
        { path: "product", populate: "package" },
        { path: "ssl" },
      ]);


      const { total } = getTotal(cart);

      let amountInNGN = convertUsdToNgn(
        total,
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
