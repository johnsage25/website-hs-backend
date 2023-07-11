import { vmTerminal } from "../nodeProxmox/vmTerminal";

export const ProxmoxVmTerminal = async (
  vmid: any,
  locationId: string,
  vmProvider: string
) => {
  return await new Promise((resolve, reject) => {
    switch (vmProvider) {
      case "proxmox":
        vmTerminal(vmid, locationId)
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            // console.log(err);
            resolve(err);
          });
        break;

      default:
        break;
    }
  });
};
