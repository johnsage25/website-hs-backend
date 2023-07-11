import React from 'react'
import { AuthCheck } from '../../node/AuthCheck'
import _ from 'lodash'
import { ServerSideProps } from '../../Types/ServerInterface'

function index() {
  return <div>....</div>
}

export default index

export async function getServerSideProps({ req, res }: ServerSideProps) {
  let session = await AuthCheck(req, res)

  // // console.log(session)

  if (_.isEmpty(session)) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: '/account/billing',
      permanent: false,
    },
  }
}
