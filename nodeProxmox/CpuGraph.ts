import { ProxmoxClient } from "../lib/proxmox-client";
import * as pulumi from "@pulumi/pulumi";
import * as proxmox from "@muhlba91/pulumi-proxmoxve";
import { FirewallInterface } from "../Types/FirewallInterface";

export const CpuGraph = async (
  vmid: any,
  node: string,
  timeframe: string
) => {
  let baseURL = process.env.BASEURL;
  let user = process.env.PROXMOX_USER;
  let dpassword = process.env.PROXMOX_PASSWORD;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  let proxmox = new ProxmoxClient(`${baseURL}`, `${user}`, `${dpassword}`);

  return new Promise((resolve, reject) => {
    proxmox
      .get(`/nodes/${node}/qemu/${vmid}/rrddata?timeframe=${timeframe}`)
      .then((result: any) => {
        resolve(result);
      })
      .catch((err) => {
        console.log(err);

        reject(err);
      });
  });
};
