import { ProxmoxClient } from "../lib/proxmox-client";
import * as pulumi from "@pulumi/pulumi";
import * as proxmox from "@muhlba91/pulumi-proxmoxve";

export const vmChangeHostname = async (
  vmid: any,
  node: string,
  hostname: string
) => {
  let baseURL = process.env.BASEURL;
  let user = process.env.PROXMOX_USER;
  let dpassword = process.env.PROXMOX_PASSWORD;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  let proxmox = new ProxmoxClient(`${baseURL}`, `${user}`, `${dpassword}`);

  return new Promise((resolve, reject) => {
    proxmox
      .post(`/nodes/${node}/qemu/${vmid}/config`, {
        name: hostname,
      })
      .then((result: any) => {
        resolve(result?.data);
      })
      .catch((err) => {
        console.log(err);

        reject(err);
      });
  });


};
