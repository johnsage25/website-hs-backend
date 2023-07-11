export type VirtualizationInterface = {
  memory?: number;
  vcpu?: number;
  bandwidth?: number;
  storage?: number;
  monthlyPrice?: number;
  hourlyPrice?: number;
  memoryType?: string;
  bandwidthType?: string;
  storageType?: string;
  storageFormat?:string,
  status?:boolean,
  cpuType?: string;
  _id?:string,
};
