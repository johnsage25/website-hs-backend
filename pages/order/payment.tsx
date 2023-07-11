import React, { LegacyRef, useEffect, useRef, useState } from 'react'
import { ServerSideProps } from '../../Types/ServerInterface'
import { AuthCheck } from '../../node/AuthCheck'
import { getSSLProduct } from '../../node/getSSLProduct'
import { getProduct } from '../../node/getProduct'
import _ from 'lodash'
import Head from 'next/head'
import CartHeader from './Component/CartHeader'
import OrderTab from './Component/OrderTab'
import { Alert, Anchor, Box, Button, Card, CardSection, Checkbox, Container, Flex, Group, Input, Paper, Tabs, Text, TextInput, Title, UnstyledButton } from '@mantine/core'
import { AiFillLock, AiOutlineCheckCircle, AiOutlineEdit } from 'react-icons/ai'
const lookup = require('country-code-lookup')
import CreditCardInput from 'react-credit-card-input'
import { useForm } from '@mantine/form'
import { VscLock } from 'react-icons/vsc'
import { PaymentOptions } from './Component/PaymentOptions'
import BillingAddress from './Component/BillingAddress'
import CardPaymentIcon from '../../Components/icons/CardPaymentIcon'
import MiniBoxCardSummary from './Component/MiniBoxCardSummary'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './Component/CheckoutForm'
import PaystackButtonAction from './Component/PaystackButtonAction'
import { IconAlertCircle } from '@tabler/icons'
import { payStack } from '../../node/payStack'
import { useRouter } from 'next/router'
import { decryptText } from '../../utils/helpers'
import lottieImage from "../../public/lottie/96085-green-check.json"
import Lottie from "lottie-react";
import CurrencyFormat from 'react-currency-format'
import SuccessMessage from './Component/SuccessMessage'
import SaveCards from './Component/SaveCards'
import HeaderOrder from './Component/HeaderOrder'



const Payment = (props: any) => {
    const [activeTab, setActiveTab] = useState<string | null>('first');
    let customer = props?.session?.customer[0];
    const router = useRouter()
    let billingAddress = props?.session?.customer[0]?.BillingAddress;

    // console.log(billingAddress);


    const [selectedPaymentMethod, setselectedPaymentMethod] = useState("default")
    const stripePromise = loadStripe(props.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const form = useForm({
        initialValues: {
            cardnumber: '',
            cvc: '',
            cardname: '',
            expiry: '',
        },
    })

    let transc: any = props.trx;



    return (
        <>

            <Head>
                <title>Cart - HostSpacing</title>
            </Head>
            <div>
                <HeaderOrder {...props} />
                <Box className='py-2  border-b border-b-gray-200 bg-white'>
                    <Container>
                        <OrderTab active={3} />
                    </Container>
                </Box>


                <Container size="70rem" className=" my-10">
                    <Box hidden={_.isEqual(transc?.status, "success")}>
                        <div className="flex justify-between mb-8">
                            <Title order={1} className=" font-medium text-3xl text-arapawa-700">
                                Checkout
                            </Title>
                        </div>

                        <Flex gap={20}>
                            <Box className="w-3/4">
                                {!_.isEmpty(billingAddress) &&
                                    <>
                                        <BillingAddress {...customer} />
                                    </>
                                }

                                <Card p="lg" radius="sm" className=' border mt-6 border-gray-200 min-h-[200px]'>
                                    <Card.Section className='border-b border-gray-200 py-4 px-6'>
                                        <Text size={"lg"} className=' text-gray-800' fw={600} >Payment Method</Text>
                                    </Card.Section>
                                    <Card.Section className='pt-10  px-10'>
                                        <div >
                                            <PaymentOptions defaultValue={selectedPaymentMethod} onChange={(state) => {
                                                // console.log(state);

                                                setselectedPaymentMethod(state)
                                            }} />
                                        </div>
                                    </Card.Section>
                                    <Card.Section className='p-6 px-10'>

                                        <Elements stripe={stripePromise}>
                                            <div className={_.isEqual(selectedPaymentMethod, "default") ? `block` : "hidden"}>


                                                <Tabs value={activeTab} onTabChange={setActiveTab}>
                                                    <Tabs.List>
                                                        <Tabs.Tab value="first">New card</Tabs.Tab>
                                                        <Tabs.Tab value="second">Saved cards</Tabs.Tab>
                                                    </Tabs.List>

                                                    <Tabs.Panel value="first">

                                                        <CheckoutForm auth={customer} billingAddress={billingAddress} />

                                                    </Tabs.Panel>
                                                    <Tabs.Panel value="second">
                                                        <Box className='py-6 border-b mb-6'>
                                                            {activeTab == "second" && <SaveCards auth={customer} billingAddress={billingAddress} />}
                                                        </Box>
                                                    </Tabs.Panel>
                                                </Tabs>



                                            </div>
                                        </Elements>

                                        <Box hidden={!_.isEqual(selectedPaymentMethod, "paystack")}>

                                            <PaystackButtonAction {...props} />
                                        </Box>
                                    </Card.Section>

                                    <Card.Section className=' pt-6 pb-10 px-10 opacity-60'>
                                        <Text >
                                            By checking out you agree with our <Anchor href='/terms'>Terms of Service</Anchor>. We will process your personal data for the fulfillment of your order and other purposes as per our <Anchor href='/privacy-policy'>Privacy Policy</Anchor>. You can cancel recurring payments at any time.
                                        </Text>
                                    </Card.Section>

                                </Card>

                                {/* <Paper >

                            </Paper> */}
                            </Box>
                            <MiniBoxCardSummary />
                        </Flex>
                    </Box>
                    <Box hidden={!_.isEqual(transc?.status, "success")}>
                        {_.isEqual(transc?.status, "success") && <SuccessMessage {...transc} />}

                    </Box>
                </Container>
            </div>
        </>
    )
}

export default Payment


export async function getServerSideProps(context: any) {
    const { req, res }: any = context
    let session: any = await AuthCheck(req, res)

    let sslProduct: any = await getSSLProduct(context)

    let paystack = await payStack(req, res)


    const query = context?.query;

    var encryptor = require('simple-encryptor')(process.env.JWT_SALT);
    var trx = encryptor.decrypt(query?.trx);

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
            trx,
            JWT_SALT: process.env.JWT_SALT,
            paystack,
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            session,
        },
    }
}
