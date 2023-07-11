import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import {
  PackageCategories,
  Packages,
  Products,
  ServerRegions,
} from "../database";

export const ServerRegionsD = async (
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  return new Promise((resolve, reject) => {
    ServerRegions.find()
      .then((result: any) => {
        resolve(JSON.parse(JSON.stringify(result)));
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
