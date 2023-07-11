import React from 'react'
import { AuthCheck } from '../../node/AuthCheck'
import _ from 'lodash'
import { ServerSideProps } from '../../Types/ServerInterface'
import { LogOut } from '../../node/LogOut'

function index() {
  return <div>....</div>
}

export default index

export async function getServerSideProps({ req, res }: ServerSideProps) {
  let session = await LogOut(req, res)

  // // console.log(session)

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  }

}
