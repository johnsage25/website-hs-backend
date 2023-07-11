import {
  Anchor,
  Button,
  Container,
  Paper,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _ from 'lodash'
import { useForm } from '@mantine/form'
import Head from 'next/head'
import { NextPage } from 'next'
import { useState } from 'react'
import { trpc } from '../../utils/trpc'
import middleChecker from '../../node/middleChecker'

function AccountSettings(props: NextPage | any) {
  const [autoBackup, setautoBackup] = useState(
    props.session.customer[0].autoBackup,
  )
  const [allowHostSpacing, setallowHostSpacing] = useState(
    props.session.customer[0].allowHostSpacing,
  )

  const [autoRenewal, setautorenewal] = useState(
    props.session.customer[0].autoRenewal,
  )

  // console.log( props.session.customer[0]);


  // mutations
  const autoBackMutation = trpc.account.enableAutoBackup.useMutation()
  const hostAdminMutation = trpc.account.enableHostSpacing.useMutation()
  const autoRenewalMutation = trpc.account.enableAutoRenewal.useMutation()

  return (
    <div className=" min-h-[40vh] mb-16">
      <div className=' space-y-6'>
        <Paper className="flex flex-col px-6 py-6 space-y-2 border">
          <Text size={18} fw={500} className="text-gray-700">
            Enable Auto Backup
          </Text>
          <Text size={15} className="text-gray-500 block space-y-2">
            This determines whether all services are first setup with
            HostSpacing Backups enabled by default. Your account will be charged
            the additional hourly cost specified on the Backups price page for
            any service that has Backups enabled.{' '}
            <Anchor size={15} href="#">
              Backups pricing page
            </Anchor>
          </Text>
          <Switch
            size="md"
            checked={autoBackup}
            onChange={(event) => {
              setautoBackup(event.currentTarget.checked)

              autoBackMutation.mutate(
                { enable: event.currentTarget.checked },
                {
                  onSuccess(data, variables, context) {
                    // console.log(data)
                  },
                  onError(error, variables, context) {
                    // console.log(error)
                  },
                },
              )
            }}
            label="Enable Auto-Backup"
          />
        </Paper>

        <Paper className="flex flex-col px-6 py-6 space-y-2 border">
          <Text size={18} fw={500} className="text-gray-700">
            Pay-As-You-Go
          </Text>
          <Text size={15} className="text-gray-500 block space-y-2">
            Enabling this option will automatically bill your card for HostSpacing services at the end of each month. If you choose to disable this feature, you will be prompted to pay when creating a new node and your service will not auto-renew on the due date.
          </Text>
          <Switch
            size="md"
            checked={autoRenewal}
            onChange={(event) => {
              setautorenewal(event.currentTarget.checked)

              autoRenewalMutation.mutate(
                { enable: event.currentTarget.checked },
                {
                  onSuccess(data, variables, context) {
                    // console.log(data)
                  },
                  onError(error, variables, context) {
                    // console.log(error)
                  },
                },
              )
            }}
            label="Enable Auto-Renewal"
          />
        </Paper>


        <Paper className="flex flex-col px-6 py-6 space-y-2 border">
          <Text size={18} fw={500} className="text-gray-700">
            Allow Hostpacing to Manage Account.
          </Text>
          <Text size={15} className="text-gray-500 space-x-2">
            This allows HostSpacing team to manage account.{' '}
            <Anchor size={15} href="#">
              Learn more
            </Anchor>
          </Text>
          <Switch
            size="md"
            onChange={(event) => {
              setallowHostSpacing(event.currentTarget.checked)

              hostAdminMutation.mutate(
                { enable: event.currentTarget.checked },
                {
                  onSuccess(data, variables, context) {
                    // console.log(data)
                  },
                  onError(error, variables, context) {
                    // console.log(error)
                  },
                },
              )
            }}
            checked={allowHostSpacing}
            label="Manage My Account"
          />
        </Paper>

        <Paper className="flex flex-col px-6 py-6 space-y-2 border">
          <Text size={18} fw={500} className="text-gray-700">
            Deactivate Account
          </Text>
          <Text size={15} className="text-gray-500">
            Before you can deactivate your account, you will need to delete any
            teams you own or transfer ownership of them to another user.
          </Text>
          <div className="py-2">
            <Button className=" bg-red-500 hover:bg-red-600">Deactivate</Button>
          </div>
        </Paper>
      </div>
    </div>
  )
}

let pageLout = AccountSettings

AccountSettings.getLayout = function getLayout(page: any) {
  return (
    <WithTheme props={page.props}>
      <Head>
        <title>Account Settings - HostSpacing</title>
      </Head>
      <TabLayout
        buttonAction={<div className="h-[36px]"></div>}
        title={'Account Settings'}
      >
        {page}
      </TabLayout>
    </WithTheme>
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
