import { Customers, Orders } from "../database";
import { loadJsonFile } from "load-json-file";

export const Config = async () => {
  return await new Promise((resolve, reject) => {
    loadJsonFile("./configuration.json").then((db) => {
      resolve(db);
    });
  });
};
