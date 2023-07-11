import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import {
  PackageCategories,
  Packages,
  Products,
  ServerRegions,
  Virtualizations,
} from "../database";

export const VirtualizationProducts = async (context: any) => {
  return new Promise((resolve, reject) => {
    const { id } = context.query;
    Virtualizations.findOne({ _id: id }).populate(['pricing'])
      .then((result: any) => {
        resolve(JSON.parse(JSON.stringify(result)));
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
