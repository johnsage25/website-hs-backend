export interface BillingType {
    _id?: string
    companyname?: string
    country?: string
    state?: string
    address?: string
    address2?: string
    city?: string
    addnew?:boolean,
    customer?: CustomerType[] | any,
    createdAt?: string
    updatedAt?: string
    postalcode?:string,
  }

  export interface CustomerType {
    _id?: string
    email?: string
    firstname?: string
    lastname?: string
    username?: string
    password?: string
    isEmailVerify?: boolean
    isMobileVerify?: boolean
    verificationString: string
    otp?: string
    BillingAddress: BillingType[],
    secret2fa?: string
    country?: string
    encoding?: string
    tos?: boolean
    createdAt?: string,
    autoRenewal?:boolean,
    updatedAt?: string
    mobile?: string
  }