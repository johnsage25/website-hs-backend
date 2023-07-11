export interface CartProductInterface {
  _id: string;
  ShortDescription: string;
  accountType: string;
  affiliate: boolean;
  backupAmount: number;
  backupEnabled: boolean;
  connectType: string;
  connectionOption: string[];
  createAutomatically: boolean;
  featured: boolean;
  freedomain: boolean;
  freessl: boolean;
  plan: string;
  pricing: Pricing[];
  productFeatures: ProductFeature[];
  productName: string;
  productRegion: string;
  serverBandwidth: string;
  serverCpu: string;
  serverDiskSpace: string;
  serverRaid: string;
  serverRam: string;
  serviceTransfer: boolean;
  tax: boolean;
  upgradeablePackages: any[][];
  status: boolean;
  package: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  stockLimit: number;
  id: string;
}

export interface Pricing {
  term: any;
  period: string;
  amount: string;
}

export interface ProductFeature {
  label: string;
  tdescription: string;
}
