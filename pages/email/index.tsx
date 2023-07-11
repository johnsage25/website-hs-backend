import React from 'react'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import _ from 'lodash'
import Head from 'next/head'
import { WithTheme } from '../_Layout/HocLayout'
import { Button, Container, Paper, Text, ThemeIcon } from '@mantine/core'
import HostingIcon from '../../Components/icons/HostingIcon'
import { Constance } from '../_Util/Constance'
import middleChecker from '../../node/middleChecker'

type Props = {}

const Index = (props: Props) => {
  const utilConst = Constance

  return (
    <>
      <Head>
        <title>Hosting</title>
      </Head>

      <WithTheme props={props}>
        <div className="">
          <Container size={'xl'} className="px-12 space-y-4">
            {/* <Paper className="py-32"></Paper> */}
            <div className=" flex justify-center flex-col text-center space-y-4 max-w-lg mt-20 mx-auto py-6">
              <div className="mx-auto bg-azure-radiance-500 w-28 h-28 p-5 rounded-full">
                <HostingIcon className=" w-full h-full mx-auto" />
              </div>
              <Text fw={600} size={30}>
                Hosting
              </Text>
              <Text size={18} fw={500}>
                Cloud-based Shared Hosting
              </Text>
              <Text size={16} className=" text-gray-600 mb-8">
                Use a scalable and dependable platform to host your websites,
                applications, or any other cloud-based workloads.
              </Text>
              <Button
                radius={'xl'}
                component="a"
                href={`${utilConst.frontUrl}/web-hosting`}
                className=" bg-azure-radiance-500 hover:bg-azure-radiance-600 w-60 mx-auto mt-6"
                fullWidth={false}
              >
                Order New
              </Button>
            </div>
          </Container>
        </div>
      </WithTheme>
    </>
  )
}

export default Index

export async function getServerSideProps({ req, res }: ServerSideProps) {
  let session: any = await AuthCheck(req, res)

  let customer = session.customer[0]
  middleChecker(req, res, customer)

  if (_.isEmpty(session)) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
