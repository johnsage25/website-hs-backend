import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _ from 'lodash'
import { ServerSideProps } from '../../Types/ServerInterface'
import { AuthCheck } from '../../node/AuthCheck'
import ProfileTab from '../_Layout/ProfileTab'
import { NextPage } from 'next'
import { useState } from 'react'
import { trpc } from '../../utils/trpc'
import Head from 'next/head'
import middleChecker from '../../node/middleChecker'

function Settings(props: NextPage | any) {
  const [mailNotification, setmailNotification] = useState(
    props.session.customer[0].mailNotification,
  )
  const [darkMode, setdarkMode] = useState(props.session.customer[0].darkMode)
  const [typeToConfirm, settypeToConfirm] = useState(
    props.session.customer[0].typeToConfirm,
  )

  /// mutation session

  const NotificationMutation = trpc.profile.enableEmailNotication.useMutation()
  const darkModenMutation = trpc.profile.enableDarkMode.useMutation()
  const typeToConfirmMutation = trpc.profile.enableTypeToConfirm.useMutation()


  return (
    <WithTheme props={props}>
      <ProfileTab
        title={'Settings & Notification'}
        buttonAction={<div className="h-[36px]"></div>}
      >
        <div className=" min-h-[40vh] mb-16">
          <div className="flex flex-col min-h-[200px] space-y-6">
            <Paper className="flex flex-col h-32 px-6 py-2 space-y-4 border">
              <Text size={18} fw={600} className="text-gray-700">
                Notifications
              </Text>
              <Switch
                size="md"
                checked={mailNotification}
                onChange={(event) => {
                  setmailNotification(event.currentTarget.checked)

                  NotificationMutation.mutate(
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
                label={
                  mailNotification
                    ? `Email alerts for account activity are enabled`
                    : `Email alerts for account activity are disabled`
                }
              />
            </Paper>

            <Paper className="flex flex-col h-32 px-6 py-2 space-y-4 border">
              <Text size={18} fw={600} className="text-gray-700">
                Dark Mode
              </Text>
              <Switch
                onChange={(event) => {
                  setdarkMode(event.currentTarget.checked)

                  darkModenMutation.mutate(
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
                size="md"
                label={darkMode ? 'Dark mode is enabled' : 'Dark mode is disabled'}
                checked={darkMode}
              />
            </Paper>

            <Paper className="flex flex-col px-6 py-6 space-y-4 border">
              <div className="space-y-2">
                <Text size={18} fw={600} className="text-gray-700">
                  Type-to-Confirm
                </Text>
                <Text className=" text-gray-500">
                  The &quot;type to confirm&quot; setting mandates inputting the
                  label before deleting for various products and services.
                </Text>
              </div>
              <Switch
                checked={typeToConfirm}
                size="md"
                onChange={(event) => {
                  settypeToConfirm(event.currentTarget.checked)

                  typeToConfirmMutation.mutate(
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
                label={
                  typeToConfirm
                    ? 'Type-to-confirm is enabled'
                    : 'Type-to-confirm is disabled'
                }
              />
            </Paper>
          </div>
        </div>
      </ProfileTab>
    </WithTheme>
  )
}

let pageLout = Settings

Settings.getLayout = function getLayout(page: any) {
  return (

    <>
      <Head>
        <title>Settings & Notification - HostSpacing</title>
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

  return {
    props: {
      session,
    },
  }
}
