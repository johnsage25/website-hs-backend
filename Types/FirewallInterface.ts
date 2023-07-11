export interface FirewallInterface {
  type?: string;
  enable?: boolean;
  action?: string;
  proto?: string;
  sport?: number;
  pos?: never;
  digest?: string;
  dport?: number;
  orderId?: string;
}
