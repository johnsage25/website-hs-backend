import _ from "lodash";
import { Cart, Products } from "../database";
import { NextApiRequest, NextApiResponse } from "next";

export const getProduct = async (
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  let cartId = req?.cookies["cart"] || null;


  return new Promise((resolve, reject) => {

    if (req?.cookies["cart"]) {
      Cart.findOne({ _id: cartId }).populate([{path: 'product', populate: "pricing"}, 'ssl', 'customer'])
        .then((result: any) => {

          resolve(JSON.parse(JSON.stringify(result)));
        })
        .catch((err: any) => {
          resolve({});
        });
    }
    else{
        resolve({})
    }
  });
};
