import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Chip,
  Container,
  Flex,
  Group,
  Header,
  HoverCard,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import React, { useState } from 'react'
import LogoW from '../../Components/LogoW'
import OrderTab from './Component/OrderTab'
import { BsArrowUpShort, BsCart, BsCartDash } from 'react-icons/bs'
import { ImageCheckboxes } from './Component/ImageCheckboxes'
import { SSLCheckBox } from './Component/SSLCheckBox'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import _ from 'lodash'
import { getProduct } from '../../node/getProduct'
import { AppProps } from 'next/app'
import { CheckboxCard } from './Component/CheckboxCard'
import { ProductInterface } from '../../Types/ProductInterface'
import { getSSLProduct } from '../../node/getSSLProduct'
import { SSLProductInterface } from '../../Types/SSLProductInterface'
import { useRouter } from 'next/router'
import { useLocalStorage, useSetState } from '@mantine/hooks';
import { CartInterface } from '../../Types/CartInterface'
import CurrencyFormat from 'react-currency-format';
import { trpc } from '../../utils/trpc'
import collect from 'collect.js'
import { PackageTerms } from '../../options'
import { Ucword } from '../../Components/TextFormatter'
import { HiOutlineTrash } from 'react-icons/hi'
import CartPReview from './Component/CartPReview'
import { PricingBox } from './Component/PricingBox'
import { UserSection1 } from '../_Layout/UserSection1'
import CartHeader from './Component/CartHeader'
import Head from 'next/head'
import HeaderOrder from './Component/HeaderOrder'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { TermsList } from '../../utils/helpers'
import { useForm } from '@mantine/form'


const Webcloud = (props: AppProps | any) => {

  const [cart, setCartState] = useSetState<CartInterface>(props?.cart);



  const sslProduct: SSLProductInterface[] = props?.sslProduct
  const [appState, setappState] = useState(cart?.preinstall)
  const [selectedSSL, setselectedSSL] = useState<SSLProductInterface>(cart?.ssl[0] || sslProduct?.filter((item) => item.sequence == 1)[0])
  const [termUpdate, settermUpdate] = useState("m")

  let connections = collect(PackageTerms)
  const updateCartMutation = trpc.cart.updateApp.useMutation()
  const updateSSLMutation = trpc.cart.updateSSL.useMutation()
  const updateBackupMutation = trpc.cart.updateBackup.useMutation()
  const updateProductPricing = trpc.cart.updateProductPricing.useMutation()
  const utils = trpc.useContext()


  const router = useRouter()
  const [active, setActive] = useState(0)
  const [preInstalled, setpreInstalled] = useState<any>('none')
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current))
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current))



  const pricing = cart?.product[0]?.pricing

  const filteredArray = TermsList.filter((element) => {
    return pricing?.some((includedElement) => includedElement.period === element.value);
  });

  const form = useForm({
    initialValues: {
      term: `${termUpdate}`,
      preinstall: "default",
      ssl: selectedSSL?._id
    }
  });


  trpc.cart.cartMiniBox.useQuery({}, {
    keepPreviousData: true, onSettled(data: any, error) {

      console.log(data?.selectedPackage[0]);

      setselectedSSL(data?.ssl[0])
      setappState(data?.preinstall)
      settermUpdate(data?.selectedPackage[0]?.period)

      form.setValues({
        term: data?.selectedPackage[0]?.period
      })
    },
  })



  let discount: any = cart?.product[0]?.pricing?.filter((item) => item?.period == termUpdate) || []

  return (
    <>
      <Head>
        <title>Cart - HostSpacing</title>
      </Head>
      <div>
        <HeaderOrder {...props} />
        <Box className='py-2  border-b border-b-gray-200 bg-white'>
          <Container>
            <OrderTab active={1} />
          </Container>
        </Box>

        <Container size={"lg"} className=' py-20 px-8 '>
          <div className="flex justify-between mb-8">
            <Title order={1} className=" font-medium text-3xl text-gray-800">
              Configure your Webspace
            </Title>
          </div>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Flex gap={20}>

              <Box className="w-3/4">
                <Paper className="bg-white min-h-[400px] border border-gray-200 space-y-4">
                  <Box className='px-6 py-4 border-b rounded-none shadow-md '>
                    <Group position="apart">

                      <Flex gap={10} align={"center"}>
                        <Text size={19} fw={600}>{cart?.product[0]?.productName}</Text>
                        {!_.isEmpty(discount) &&
                          <>
                            {discount[0].discount > 0 ? <> <Text className="tag">{discount[0]?.discount}% Off</Text></> : <></>}</>
                        }

                      </Flex>
                      <SimpleGrid cols={3}>
                        <Stack spacing={0} align='center'>
                          {!_.isEmpty(cart?.product[0]?.diskSpace) && <>
                            <Text size={14} className=' text-gray-700'>
                              Disk space
                            </Text>
                            <Text fw={600}>
                              {cart?.product[0]?.diskSpace} {cart?.product[0]?.diskSpaceUnit?.toLocaleUpperCase()}
                            </Text>
                          </>}

                        </Stack>
                        <Stack spacing={0} align='center'>
                          {!_.isEmpty(cart?.product[0]?.bandWidthLimit) && <>
                            <Text size={14} className=' text-gray-700'>Bandwidth</Text>
                            <Text fw={600}>
                              {_.isEqual(cart?.product[0]?.bandWidthLimit, "-1") ? "Unlimited" : `${cart?.product[0]?.bandWidthLimit} ${cart?.product[0]?.bandWidthUnit?.toLocaleUpperCase()}`}
                            </Text></>}

                        </Stack>
                        <Stack spacing={0} align='center'>
                          {!_.isEmpty(cart?.product[0]?.domainsLimit) && <>
                            <Text size={14} className=' text-gray-700'>Websites</Text>
                            <Text fw={600}>
                              {_.isEqual(cart?.product[0]?.domainsLimit, 0) ? "Unlimited" : `${cart?.product[0]?.domainsLimit}`}
                            </Text></>}
                        </Stack>
                      </SimpleGrid>
                    </Group>
                  </Box>


                  <Box className='space-y-4 px-8 py-4' >
                    <Text size={20} fw={500}>Select your term length</Text>
                    <Box className=''>
                      <SimpleGrid cols={2}>
                        <Select
                          {...form.getInputProps('term')}
                          onChange={(event: any) => {

                            updateProductPricing.mutate({ productId: cart?.product[0]._id, period: event }, {
                              onSuccess(data, variables, context) {

                                utils.cart.cartMiniBox.invalidate()
                              },
                              onError(error, variables, context) {

                              },
                            })

                            form.getInputProps(`term`).onChange(event)
                          }}
                          data={filteredArray}
                        />
                      </SimpleGrid>

                    </Box>
                  </Box>


                  <Box className="mb-8  p-8 border-arapawa-100">
                    <div className=" mb-6 border-b pb-4 border-b-arapawa-100">
                      <Group spacing={4} align='center'>
                        <Text size={20} fw={600} className=" text-gray-800">
                          Choose a pre-installed content management module
                        </Text>

                        <Tooltip
                          multiline
                          width={220}
                          withArrow
                          withinPortal
                          p={10}
                          transitionProps={{ duration: 200 }}
                          label="Create your website with ease by utilizing our modules
                        included in your hosting plan, no technical skills
                        necessary."
                        >
                          <ActionIcon variant="subtle">
                            <AiOutlineInfoCircle size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </div>
                    <div className=" space-y-8">

                      <ImageCheckboxes
                        {...form.getInputProps('preinstall')}
                        onChange={(value) => {
                          setappState(value)
                          updateCartMutation.mutate({ select: value }, {
                            onSuccess(data, variables, context) {
                              utils.cart.cartMiniBox.invalidate()
                            },
                            onError(error, variables, context) {

                            },
                          })
                          form.getInputProps(`preinstall`).onChange(value)
                        }}
                      />
                    </div>
                  </Box>

                  <Box className=" p-8 border-arapawa-100">
                    <div className=" mb-6 border-b border-b-arapawa-100 pb-4">
                      <Group spacing={0}>
                        <Text size={20} fw={600} className=" text-gray-800">
                          Secure your website with our SSL certificates
                        </Text>

                        <Tooltip
                          multiline
                          width={220}
                          withArrow
                          withinPortal
                          p={10}
                          transitionProps={{ duration: 200 }}
                          label="SSL certificates secure the data exchanged between a
                        website&apos;s server and the web browser used by visitors,
                        such as login information and banking transactions."
                        >
                          <ActionIcon variant="subtle">
                            <AiOutlineInfoCircle size={18} />
                          </ActionIcon>
                        </Tooltip>


                      </Group>
                    </div>
                    <div>

                      <SSLCheckBox
                        data={sslProduct}
                        {...form.getInputProps('ssl')}
                        onChange={(value) => {
                          console.log(value);

                          setselectedSSL(value)

                          updateSSLMutation.mutate({ name: value.name, sslId: value._id }, {
                            onSuccess(data, variables, context) {
                              utils.cart.cartMiniBox.invalidate()

                            },
                            onError(error, variables, context) {
                              // console.log(error);
                            },
                          })

                          form.getInputProps(`ssl`).onChange(value._id)
                        }}


                      />
                    </div>
                  </Box>

                  {cart.product[0]?.backupEnabled && (
                    <Box className=" p-8 border-arapawa-100">
                      <div className=" mb-6 border-b border-b-arapawa-100 pb-4">
                        <Text size={20} fw={600} className=" text-gray-900">
                          Backup
                        </Text>
                      </div>
                      <div>
                        <CheckboxCard
                          description={
                            'Enabling backup will save you from losing data.'
                          }
                          defaultChecked={cart.backup}
                          {...props}
                          className=""
                          amount={cart.product[0].backupAmount}
                          title={'100% Auto-Backup'}
                          onChange={(state) => {

                            updateBackupMutation.mutate({ state }, {
                              onSuccess(data, variables, context) {
                                setCartState(data)
                                utils.cart.cartMiniBox.invalidate()
                              },
                            })
                          }}
                        />
                      </div>
                    </Box>
                  )}
                </Paper>
              </Box>
              <CartPReview stage={"hosting"} {...props} />
            </Flex>
          </form>
        </Container>
      </div>
    </>
  )
}

export default Webcloud

export async function getServerSideProps(context: ServerSideProps) {
  const { req, res }: any = context
  let session: any = await AuthCheck(req, res)

  let sslProduct: any = await getSSLProduct(context)
  let cart = await getProduct(req, res)

  if (_.isEmpty(cart)) {
    return {
      redirect: {
        destination: process.env.HOME_DOMAIN,
        permanent: false,
      },
    }
  }


  return {
    props: {
      cart,
      sslProduct,
      session,
    },
  }
}
