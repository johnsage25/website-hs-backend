import React from "react";
import AxiosClient from "../lib/myloc";
import { ServerConnectInterface } from "../Types/ServerConnectInterface";

const vncMylocVM = async (
  connection: ServerConnectInterface,
  contract: string
) => {
  let api = new AxiosClient(
    `https://${connection.hostAddress}/api`,
    connection.password
  );
  return new Promise((resolve, reject) => {
    api
      .post(`/vps/${contract}/openvnc`, {
        contract,
      })
      .then((result: any) => {
        console.log(result);

        resolve(result);
      })
      .catch((err: any) => {
        console.log(err);

        reject(err);
      });
  });
};

export default vncMylocVM;
