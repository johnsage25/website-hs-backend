export interface ProductVmInterface {
    _id: string
    status: string
    period: string
    initAmount: number
    amount: number
    monthlyPrice: number
    hourlyPrice: number
    renewalDate: string
    domainRegistrar: string
    tldRegistered: boolean
    autoRenew: boolean
    productType: string
    vmid: string
    paymentMethod: string
    withBackup: boolean
    preInstall: string
    serverInstalled: boolean
    nameServerList: NameServerList[]
    term: number
    orderType: string
    domainPrivacy: boolean
    domainTransferLock: boolean
    node: Node
    region: Region[]
    osVersion: string
    osType: string
    vmAuth: string
    resourceType: string
    password: string
    privateIp: string
    publicIp: string
    publicIpv6: string
    sshKey: SshKey
    vmStatus: string
    vmOnline: boolean
    tag: string
    hostname: string
    connection: Connection
    vCpu: number
    storageType: string
    bandwidth: number
    storage: number
    memory: number
    memoryType: string
    customer: Customer[]
    invoice: string[]
    createdAt: string
    updatedAt: string
    renewedDate: string
    __v: number
    id: string
  }

  export interface NameServerList {
    ns1: string
    ns2: string
    ns3: string
    ns4: string
  }

  export interface Node {
    _id: string
    bandwidth: number
    bandwidthType: string
    cpuType: string
    hourlyPrice: number
    memory: number
    memoryType: string
    monthlyPrice: number
    storage: number
    storageType: string
    storageFormat: string
    vcpu: number
    createdAt: string
    updatedAt: string
    __v: number
    region: string
    status: boolean
    isHidden: boolean
    isfree: boolean
    title: string
    category: string
    type: string
    connection: string
    id: string
  }

  export interface Region {
    _id: string
    name: string
    unitId: string
    rackId: string
    locationName: string
    locationId: string
    createdAt: string
    updatedAt: string
    __v: number
    id: string
  }

  export interface SshKey {
    _id: string
    key: string
    fingerprint: string
    label: string
    customer: string[]
    createdAt: string
    updatedAt: string
    __v: number
  }

  export interface Connection {
    _id: string
    type: string
    name: string
    hostAddress: string
    ipAddress: string
    panel: string
    port: number
    noAccount: any
    username: string
    password: string
    status: boolean
    createdAt: string
    updatedAt: string
    __v: number
  }

  export interface Customer {
    _id: string
    email: string
    username: string
    password: string
    isEmailVerify: boolean
    isMobileVerify: boolean
    verificationString: string
    accBalance: number
    otp: string
    status: string
    language: string
    currency: string
    isBlocked: boolean
    secret2fa: string
    twoFactorEnabled: boolean
    autoBackup: boolean
    connectedCard: any
    allowHostSpacing: boolean
    recoveryCodes: any[]
    mailNotification: boolean
    darkMode: boolean
    typeToConfirm: boolean
    autoRenewal: boolean
    country: string
    encoding: string
    defaultPayment: string
    stripeCustomerID: string
    paymentVerified: boolean
    tos: boolean
    createdAt: string
    updatedAt: string
    __v: number
    firstname: string
    lastname: string
    mobile: string
    id: string
  }
