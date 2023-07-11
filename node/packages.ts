import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import { PackageCategories, Packages, Products } from "../database";

export const getPackages = async (
  req?: NextApiRequest,
  res?: NextApiResponse,
  page?: string
) => {
  return new Promise((resolve, reject) => {
    PackageCategories.find({ pageBlock: page })
      .populate("products")
      .then((result: any) => {
        resolve({ category: JSON.parse(JSON.stringify(result)) });
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
