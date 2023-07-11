import { ProxmoxClient } from "../lib/proxmox-client";

export const vmTerminal = async (vmid: any, node: string) => {
  let baseURL = process.env.BASEURL;
  let user = process.env.PROXMOX_USER;
  let password = process.env.PROXMOX_PASSWORD;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  let proxmox = new ProxmoxClient(`${baseURL}`, `${user}`, `${password}`);

  return new Promise((resolve, reject) => {
    proxmox
      .get(`https://217.23.5.62:5001/api2/json/nodes/${node}/qemu/${vmid}/plainvncproxy`)
      .then((result: any) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
