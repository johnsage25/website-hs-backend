import { Box, Button, Container, Paper, Text, Title } from '@mantine/core'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _ from 'lodash'
import { ServerSideProps } from '../../Types/ServerInterface'
import { AuthCheck } from '../../node/AuthCheck'
import ProfileTab from '../_Layout/ProfileTab'
import Head from 'next/head'
import { NextPage } from 'next'
import middleChecker from '../../node/middleChecker'

function Referrals(props: NextPage) {
  return (
    <WithTheme props={props}>
      <ProfileTab
        title={'Referrals'}
        buttonAction={<div className="h-[36px]"></div>}
      >
        <div className=" min-h-[40vh] mb-16">
          <div className="flex flex-col min-h-[200px]">
            <Paper className="flex flex-col min-h-[200px] border">


            </Paper>
          </div>
        </div>
      </ProfileTab>
    </WithTheme>
  )
}

let pageLout = Referrals

Referrals.getLayout = function getLayout(page: any) {
  return (

    <>
      <Head>
        <title>Referrals - HostSpacing</title>
      </Head>

      {page}
    </>


  )
}

export default pageLout

export async function getServerSideProps({ req, res }: ServerSideProps) {
  let session: any = await AuthCheck(req, res)

  if (_.isEmpty(session)) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  let customer = session.customer[0]
  middleChecker(req, res, customer)

  var gravatar = require('gravatar')
  let image_url = gravatar.url(session?.customer[0].email, {
    s: '200',
    r: 'pg',
    d: '404',
  })


  return {
    props: {
      session,
      image_url,
    },
  }
}
