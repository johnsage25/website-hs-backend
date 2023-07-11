import React from "react";
import AxiosClient from "../lib/myloc";
import { ServerConnectInterface } from "../Types/ServerConnectInterface";

const vmRebootMyloc = async (
  connection: ServerConnectInterface,
  contract: string
) => {
  let api = new AxiosClient(
    `https://${connection.hostAddress}/api`,
    connection.password
  );
  return new Promise((resolve, reject) => {

    api
      .post(`/vps/${contract}/restart`, {
        contract
      })
      .then((result: any) => {
        resolve(result);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export default vmRebootMyloc;
