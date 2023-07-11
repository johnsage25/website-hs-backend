export interface CreateNodeInterface {
  vm?: string;
  osType?: string;
  region?: string;
  osVersion?: string;
  vmAuth?: string;
  term?:string,
  sshKey?: string;
  sskLabel?: string;
  hostdetails?: Hostdetail[];
  password?: string;
  quantity?: number;
  id?:string
}

export interface Hostdetail {
  tag: string;
  id: number;
  hostname: string;
}
