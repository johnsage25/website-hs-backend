import React from "react";
import AxiosClient from "../lib/myloc";
import { ServerConnectInterface } from "../Types/ServerConnectInterface";

const shutdownVmMyloc = async (
  connection: ServerConnectInterface,
  contract_id: string
) => {
  let api = new AxiosClient(
    `https://${connection.hostAddress}/api`,
    connection.password
  );
  return new Promise((resolve, reject) => {
    api
      .get(`/vps/${contract_id}`)
      .then((result: any) => {
        resolve(result);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export default shutdownVmMyloc