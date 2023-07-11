import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import {
  Orders,
  PackageCategories,
  Packages,
  Products,
  ServerRegions,
  Virtualizations,
} from "../database";

export const VmDetails = async (context: any) => {
  const { id } = context.query;
  return await new Promise((resolve, reject) => {
    Orders.findOne({ _id: id })

      .sort({ createdAt: -1 })
      .populate([
        { path: "node" },
        { path: "region" },
        { path: "customer" },
        { path: "connection" },
        { path: "sshKey" },
      ])
      .limit(25)
      .then((result: any) => {
        // // console.log(result);

        resolve(JSON.parse(JSON.stringify(result)));
      })
      .catch((err: any) => {
        resolve({});
      });
  });
};
