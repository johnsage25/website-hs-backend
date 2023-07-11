export interface VmListInterface {
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
    paymentMethod: string
    withBackup: boolean
    preInstall: string
    serverInstalled: boolean
    nameServerList: NameServerList[]
    term: number
    orderType: string
    domainPrivacy: boolean
    domainTransferLock: boolean
    node: string
    region: string[]
    osVersion: string
    osType: string
    vmAuth: string
    password: string
    privateIp: string
    publicIp: string
    sshKey: string
    tag: string
    hostname: string
    customer: string[]
    invoice: any[]
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
