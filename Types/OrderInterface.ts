export interface OrderInterface {
    domainRegistrar?: string
    adminNote?: string
    _id?: string
    status: string
    initAmount?: number
    amount?: number
    renewalDate?: Date
    autoRenew?: boolean
    withBackup?: boolean
    preInstall?: string
    term?: number
    paymentMethod?: string
    orderType?: string
    domainPrivacy?: boolean,
    serviceName?:string,
    domain?: string
    createdAt?: Date
    updatedAt?: Date
    renewedDate?: Date
    id?: string
    dueDate?: Date
  }

  export interface Extension {
    name?: string
    registerPrice?: number
    IsDocumentRequired?: boolean
    IsTransferable?: boolean
    MaxCharacterCount?: number
    IdProtection?: boolean
    NDSManagement?: boolean
    MaxRegistrationPeriod?: number
    MinCharacterCount?: number
    MinRegistrationPeriod?: number
    RequiredDocumentInfo?: string
    renewPrice?: number
    domainModule?: string
    transferPrice?: number
    listOrder?: number
    promo?: boolean
    promoPrice?: number
    status?: boolean
    createdAt?: string
    updatedAt?: string
    promoDate?: string
    promoRegisterPrice?: number
    promoRenewPrice?: number
    featured?: boolean
    id?: string
  }



  export interface Invoice {
    _id: string
    customer: string
    paymentStatus: string
    usePromotion: boolean
    taxed: number
    subTotal: number
    total: number
    paymentMethod: string
    createdAt: string
    updatedAt: string
    invoiceNumber: string
    __v: number
    id: string
  }
