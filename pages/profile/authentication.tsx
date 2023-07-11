import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Text,
  Title,
} from '@mantine/core'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _ from 'lodash'
import { ServerSideProps } from '../../Types/ServerInterface'
import { AuthCheck } from '../../node/AuthCheck'
import ProfileTab from '../_Layout/ProfileTab'
import SocialAuthencation from '../_blocks/SocialAuthencation'
import { NextPage } from 'next'
import ProfileSecurityBlock from '../_blocks/ProfileSecurityBlock'
import MobileSecurityBlock from '../_blocks/MobileSecurityBlock'
import SMSMessageBlock from '../_blocks/SMSMessageBlock'
import Head from 'next/head'
import middleChecker from '../../node/middleChecker'
var speakeasy = require('speakeasy')
var QRCode = require('qrcode')

function Authentication(props: NextPage) {
  return (
    <WithTheme props={props}>
      <ProfileTab
        title={'Login & Authentication'}
        buttonAction={<div className="h-[36px]"></div>}
      >
        <div className=" min-h-screen mb-16">
          <div className="flex flex-col min-h-[200px] space-y-6">
            <SocialAuthencation {...props} />
            <Paper className="flex flex-col px-6 py-6 space-y-4 min-h-[180px] border ">
              <Text size={18} fw={500} className="text-gray-700">
                Security Settings
              </Text>
              <Divider className=" border-gray-200" />
              <div className=' flex flex-col divide-y '>
                <ProfileSecurityBlock {...props} />
                <MobileSecurityBlock {...props} />
                {/* <SMSMessageBlock {...props}/> */}
              </div>
            </Paper>
          </div>
        </div>
      </ProfileTab>
    </WithTheme>
  )
}

let pageLout = Authentication

Authentication.getLayout = function getLayout(page: any) {
  return (

    <>
      <Head>
        <title>Login & Authentication - HostSpacing</title>
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


  var twofaurlcode = speakeasy.otpauthURL({
    secret: session.customer[0].secret2fa,
    label: `HostSpacing (${session.customer[0].email})`,
    algorithm: 'SHA512',
  })

  let image2fa = await new Promise((resolve, reject) => {
    QRCode.toDataURL(twofaurlcode, function (err: any, url: any) {
      if (!err) {
        resolve(url)
      } else {
        resolve('')
      }
    })
  })

  return {
    props: {
      session,
      image2fa,
    },
  }
}
