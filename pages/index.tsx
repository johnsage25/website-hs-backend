import { AppProps } from 'next/app'
import Head from 'next/head'
import Image from 'next/image'
import { AuthCheck } from '../node/AuthCheck'
import styles from '../styles/Home.module.css'
import { ServerSideProps } from '../Types/ServerInterface'
import { WithTheme } from './_Layout/HocLayout'
import _ from 'lodash'
import { useLayoutEffect, useState } from 'react'
import {
  Button,
  Modal,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import AccountCompletedVerification from '../Components/AccountCompletedVerification'
import { trpc } from '../utils/trpc'
import middleChecker from '../node/middleChecker'

interface WithThemeProps {
  primaryColor: string
}

function Home(props: AppProps | any | WithThemeProps) {
  const [mailCompleted, setMailCompleted] = useState(false)
  const theme = useMantineTheme()
  let removeEmailNoticeMutation = trpc.app.removeEmailNotice.useMutation()

  useLayoutEffect(() => {
    if (props?.session?.mail_completed == 'true') {
      setMailCompleted(true)
      setTimeout(() => {
        removeEmailNoticeMutation.mutate()
      }, 800)
    }
  }, [])

  return (
    <WithTheme props={props}>
      <div className=" min-h-screen">
        <Modal
          opened={mailCompleted}
          size={'lg'}
          onClose={() => {
            setMailCompleted(false)
          }}

          overlayProps={{
            color: theme.colorScheme === 'dark'
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
            opacity: 0.55,
            blur: 3
          }}

        >
          <div className="text-center object-cover space-y-5 px-10 pb-10">
            <AccountCompletedVerification className=" w-80 mx-auto" />
            <Text className="" size={30} fw={600}>
              Account Verified
            </Text>

            <Text size={20}>
              Congratulation, your account is now fully activated. You can start
              working on your project.
            </Text>

            <Button className=" bg-lochmara-400 mt-6" radius={"xl"} size="md">
              Start Building
            </Button>
          </div>
        </Modal>
      </div>
    </WithTheme>
  )
}

export default Home

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
