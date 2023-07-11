import {
  Anchor,
  Button,
  Container,
  Divider,
  Drawer,
  Paper,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useState } from 'react'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _ from 'lodash'
import { NextPage } from 'next'
import ContactBlock from '../_blocks/ContactBlock'
import PaymentMethods from '../_blocks/PaymentMethods'
import PaymentHistory from '../_blocks/PaymentHistory'
import Head from 'next/head'
import { loadStripe } from '@stripe/stripe-js'
import { Elements} from '@stripe/react-stripe-js';
import middleChecker from '../../node/middleChecker'

function Billing(props: any) {


  const stripePromise = loadStripe(props.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return (
    <div className="space-y-6 mb-16">
      <SimpleGrid cols={2}>
        <Paper py={10} p="md" className=' border'>
          <div className="pb-2 flex justify-between border-b border-b-gray-200">
            <Title order={5} fw={400}>
              Account Balance
            </Title>
            <Anchor size={14}>Add a promo code</Anchor>
          </div>
          <div className="py-2 space-y-2">
            <div className=" text-gray-500 text-sm">
              <span>You have no balance at this time.</span>
            </div>
            <div className=" text-lochmara-500">
              <Text fw={400} size={18}>
                $0.00
              </Text>
            </div>
          </div>
        </Paper>
        <Paper py={10} p="md" className=' border'>
          <div className="pb-2 flex justify-between border-b border-b-gray-200">
            <Title order={5} fw={400}>
              Accumulated Fees
            </Title>
          </div>

          <div className="py-2 space-y-2">
            <div className=" text-gray-500 text-sm">
              <span>After the last invoice</span>
            </div>
            <div className=" text-lochmara-500">
              <Text fw={400} size={18}>
                $0.00
              </Text>
            </div>
          </div>
        </Paper>
      </SimpleGrid>

      <SimpleGrid cols={2} className="place-items-stretch grid-cols-2">
        <ContactBlock />
        <Elements stripe={stripePromise}>
          <PaymentMethods {...props?.session} />
        </Elements>
      </SimpleGrid>

      <div>
        <PaymentHistory />
      </div>
    </div>
  )
}

let pageLout = Billing

Billing.getLayout = function getLayout(page: any) {
  return (
    <WithTheme props={page.props}>
      <Head>
        <title>Account Billing - HostSpacing</title>
      </Head>
      <TabLayout
        title={'Account Billing'}
        buttonAction={<div className="h-[36px]"></div>}
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
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      image_url,
    },
  }
}
