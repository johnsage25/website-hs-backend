import React, { createContext } from 'react'
import { trpc } from '../utils/trpc'


interface Customer {
  _id: string
  email: string
  username: string
  password: string
  isEmailVerify: boolean
  isMobileVerify: boolean
  verificationString: string
  otp: string
  secret2fa: string
  country: string
  encoding: string
  tos: boolean
  createdAt: string
  updatedAt: string
  __v: number
  mobile: string
}


export const AppCtx = createContext<Customer | undefined>(undefined)
// Take in a component as argument WrappedComponent
const UserAuthProvider = ({children}: {children: any}) => {
  // And return another component
    let userSession = trpc.app.user.useQuery({text: ""})

  return (
    <AppCtx.Provider value={userSession?.data}>{children}</AppCtx.Provider>
  )

}

export default UserAuthProvider
