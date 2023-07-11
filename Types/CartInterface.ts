export interface CartInterface {
  _id: string;
  customer: any[];
  product: Product[];
  ssl: any[];
  tldExt: string[];
  domainSelected: DomainSelected[];
  preinstall: string;
  backup: boolean;
  selectedPackage: SelectedPackage[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
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
  diskSpace: string;
  mailAccountLimit: string;
  domainsLimit: string;
  bandWidthLimit: string;
  diskSpaceUnit: string;
  bandWidthUnit: string;
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

export interface DomainSelected {
  domainName: string;
  term: number;
  tldId: string;
  registerPrice: number;
  maxPeriod: number;
  renewPrice: number;
  domainPrivacy: boolean;
  promo: boolean;
  promoRegisterPrice: number;
  _id: string;
}

export interface SelectedPackage {
  productId: string;
  period: string;
  domain: string;
  _id: string;
}
