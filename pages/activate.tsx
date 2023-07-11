import React from 'react'
import { ActivateAccount } from '../node/ActivateAccount'
import { ServerSideProps } from '../Types/ServerInterface'
import _ from 'lodash'
import { AuthCheck } from '../node/AuthCheck'

const Activate = () => {
  return <div>...</div>
}

export default Activate

export async function getServerSideProps(context: ServerSideProps) {
  let activate: any = await ActivateAccount(context)
  const { req, res }: any = context
  let session: any = await AuthCheck(req, res)

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}
