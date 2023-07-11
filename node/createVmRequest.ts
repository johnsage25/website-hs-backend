import axios from "axios";
import { Customers, Orders } from "../database";
import { loadJsonFile } from "load-json-file";

export const createVmRequest = async (orders: object) => {
  console.log(JSON.stringify(orders));

  return await new Promise((resolve, reject) => {
    axios
      .post("http://localhost:3000/creation-task/add", { ...orders })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
