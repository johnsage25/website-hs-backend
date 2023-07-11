import Head from 'next/head'
import React, { useEffect, useRef } from 'react'
import HeaderOrder from '../order/Component/HeaderOrder'
import { Box, Container } from '@mantine/core'
import { ServerSideProps } from '../../Types/ServerInterface'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerRegionsD } from '../../node/ServerRegionsD'
import { Config } from '../../node/Config'
import { Button, Card, CardSection, Group, Text } from '@mantine/core'
import lottieImage from "../../public/lottie/96085-green-check.json"
import Lottie from "lottie-react";
import CurrencyFormat from 'react-currency-format'
import _ from 'lodash';
import { useRouter } from 'next/router'
import { decryptText } from '../../utils/helpers'
import OrderTab from './Component/OrderTab'
import { getProduct } from '../../node/getProduct'



const Complete = (props: any) => {

  // console.log(decryptText(`${router.query?.token}`, props?.JWT_SALT));

  const playLottie = useRef<any>()
  useEffect(() => {
    playLottie.current?.play();
  }, [])

  const trx = props?.trx


  return (
    <>
      <Head>
        <title>Payment Receipt</title>
      </Head>
      <HeaderOrder {...props} />
      <Box className='py-2 border-b border-b-gray-200 bg-white'>
        <Container>
          <OrderTab active={4} />
        </Container>
      </Box>
      <Container className='py-16'>
        <Card className='max-w-xl mx-auto p-10' radius="sm" withBorder>
          <CardSection className=' flex justify-center text-center w-full'>
            <Lottie ref={playLottie} style={{ height: "40%", width: "40%" }} animationData={lottieImage} loop={false} autoPlay={_.isEqual(trx?.status, "success")} />
          </CardSection>
          <CardSection className='mb-4 flex justify-center text-center w-full'>
            <Text size={25} fw={600} align='center'>Payment received</Text>
          </CardSection>

          <CardSection className='px-4 mb-6 text-center'>
            <Text>
              We are happy to confirm that we have received your payment of <strong><CurrencyFormat value={trx?.total || 0} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} /></strong>. Thank you for choosing our services!
            </Text>
          </CardSection>

          <CardSection className='px-4 text-center pb-6'>
            <Group spacing={10} position='center'>
              <Button variant="default" radius="xl">
                Download Receipt
              </Button>

              <Button component='a' href='/' className=' bg-azure-radiance-500 hover:bg-azure-radiance-600' radius="xl">
                Continue to Account
              </Button>
            </Group>
          </CardSection>

        </Card>
      </Container>
    </>
  )
}

export default Complete

export async function getServerSideProps(context: any) {
  const { req, res }: ServerSideProps = context;

  const moment = require('moment');
  const query = context.query;

  let session: any = await AuthCheck(req, res)
  let regions: any = await ServerRegionsD(req, res)
  // let virtualizations: any = await VirtualizationProducts(req, res)
  let config = await Config();
  var encryptor = require('simple-encryptor')(process.env.JWT_SALT);
  var trx = encryptor.decrypt(query.token.replace(/\s+/g, ''));


  let cart = await getProduct(req, res)


  if (new Date().getTime() > trx.expiration) {
    return {
      redirect: {
        destination: '/hosting',
        permanent: false,
      },
    }
  }

  // const currentTimestamp = moment().valueOf();

  // if (currentTimestamp > trx?.expiration) {
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   }
  // }

  let customer = session.customer[0]


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
      trx,
      JWT_SALT: process.env.JWT_SALT,
      config,
      query,
      regions
    },
  }
}
