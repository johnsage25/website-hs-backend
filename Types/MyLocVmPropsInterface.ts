export interface MyLocVmPropsInterface {
  content: Content;
}

export interface Content {
  id: number;
  create_date: string;
  hostname: string;
  product: Product;
  status: string;
  bill_interval: string;
  interval_price: number;
  paid_until_date: string;
  possible_termination_date: string;
  termination_date: string;
  description: string;
  sub_contracts: SubContract[];
  readable_status: string;
  resources: any[];
  po_number: any;
  entity_type: string;
}

export interface Product {
  id: number;
  name: string;
  type: string;
}

export interface SubContract {
  id: number;
  create_date: string;
  hostname: any;
  product: Product2;
  status: string;
  bill_interval: string;
  interval_price: number;
  paid_until_date: string;
  possible_termination_date: any;
  termination_date: string;
  description: any;
  sub_contracts: any[];
  readable_status: string;
  resources: any[];
  po_number: any;
  entity_type: string;
  individual_inclusive_full_snapshot_count: any;
  individual_inclusive_incremental_snapshot_count: any;
  overuse_full_snapshot_price: any;
  overuse_incremental_snapshot_price: any;
  allow_overuse: any;
}

export interface Product2 {
  id: number;
  name: string;
  type: string;
}
