import { ProxmoxClient } from "../lib/proxmox-client";

export const vmPassword = async (
  vmid: any,
  node: string,
  username: string,
  password: string
) => {
  let baseURL = process.env.BASEURL;
  let user = process.env.PROXMOX_USER;
  let dpassword = process.env.PROXMOX_PASSWORD;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  let proxmox = new ProxmoxClient(`${baseURL}`, `${user}`, `${dpassword}`);

  return new Promise((resolve, reject) => {
    proxmox
      .post(`/nodes/${node}/qemu/${vmid}/config`, {
        cipassword: password,
      })
      .then((result: any) => {
        resolve(result?.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
