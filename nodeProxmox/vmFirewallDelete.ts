import { ProxmoxClient } from "../lib/proxmox-client";
import * as pulumi from "@pulumi/pulumi";
import * as proxmox from "@muhlba91/pulumi-proxmoxve";
import { FirewallInterface } from "../Types/FirewallInterface";

export const vmFirewallDelete = async (
  vmid: any,
  node: string,
  data: FirewallInterface
) => {
  let baseURL = process.env.BASEURL;
  let user = process.env.PROXMOX_USER;
  let dpassword = process.env.PROXMOX_PASSWORD;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  let proxmox = new ProxmoxClient(`${baseURL}`, `${user}`, `${dpassword}`);

  return new Promise((resolve, reject) => {
    proxmox
      .delete(`/nodes/${node}/qemu/${vmid}/firewall/rules/${data?.pos}`, {
        pos: data?.pos,
        digest: data?.digest,
      })
      .then((result: any) => {
        // console.log(result);

        resolve(result);
      })
      .catch((err) => {
        // console.log(err);

        reject(err);
      });
  });
};
