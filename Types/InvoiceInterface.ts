export interface InvoiceInterface {
  _id: string;
  customer: Customer;
  paymentStatus: string;
  usePromotion: boolean;
  taxed: number;
  invoiceNumber:string,
  subTotal: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  domainorders: any[];
  orders: Order[];
  sslorders: Sslorder[];
  id: string;
}

export interface Customer {
  isBlocked: boolean;
  defaultPayment: string;
  _id: string;
  email: string;
  username: string;
  password: string;
  isEmailVerify: boolean;
  isMobileVerify: boolean;
  verificationString: string;
  otp: string;
  secret2fa: string;
  country: string;
  encoding: string;
  tos: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  mobile: string;
  timezone: string;
  googleAuth: boolean;
  googleAuthId: string;
  githubAuth: boolean;
  githubAuthId: string;
  twoFactorEnabled: boolean;
  recoveryCodes: string[];
  mailNotification: boolean;
  darkMode: boolean;
  typeToConfirm: boolean;
  autoBackup: boolean;
  allowHostSpacing: boolean;
  accBalance: number;
  currency: string;
  status: string;
  language: string;
  BillingAddress: BillingAddress[];
  id: string;
}

export interface BillingAddress {
  _id: string;
  firstname: string;
  lastname: string;
  companyname: string;
  country: string;
  state: string;
  address: string;
  address2: string;
  city: string;
  postalcode: string;
  customer: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface Order {
  _id: string;
  status: string;
  period: string;
  renewalDate: string;
  autoRenew: boolean;
  withBackup: boolean;
  preInstall: string;
  Products: Products;
  domain: string;
  customer: string[];
  invoice: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface Products {
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
  productType: string;
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

export interface Sslorder {
  _id: string;
  peroid: string;
  term: number;
  autoRenew: boolean;
  renewalDate: string;
  createdAt:string,
  ssl: Ssl;
  customer: string[];
  invoice: string[];
  __v: number;
}

export interface Ssl {
  _id: string;
  status: boolean;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  orderform: boolean;
  sequence: any;
}
