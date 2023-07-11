export interface ServerConnectInterface {
  _id: string;
  type: string;
  name: string;
  hostAddress: string;
  ipAddress:string;
  noAccount: number;
  port:number,
  username: string;
  password: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
