import { ProxmoxClient } from "../lib/proxmox-client";

export const vmShutdown = async (vmid: any, node:string) => {
  let baseURL = process.env.BASEURL;
  let user = process.env.PROXMOX_USER;
  let password = process.env.PROXMOX_PASSWORD;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  let proxmox = new ProxmoxClient(`${baseURL}`, `${user}`, `${password}`);

  return new Promise((resolve, reject) => {
    proxmox
      .post(`/nodes/${node}/qemu/${vmid}/status/shutdown`, {
        node,
        vmid,
      })
      .then((result: any) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
