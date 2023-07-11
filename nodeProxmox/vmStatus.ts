import { ProxmoxClient } from "../lib/proxmox-client";

export const vmStatus = async (vmid: any, node: string) => {
  let baseURL = process.env.BASEURL;
  let user = process.env.PROXMOX_USER;
  let password = process.env.PROXMOX_PASSWORD;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  let proxmox = new ProxmoxClient(`${baseURL}`, `${user}`, `${password}`);

  return new Promise((resolve, reject) => {
    proxmox
      .get(`/nodes/${node}/qemu/${vmid}/status/current`)
      .then((result: any) => {
        resolve(result?.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
