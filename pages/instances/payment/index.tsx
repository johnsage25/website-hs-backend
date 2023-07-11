import React, { useState } from 'react'
import { ServerSideProps } from '../../../Types/ServerInterface';
import { AuthCheck } from '../../../node/AuthCheck';
import { ServerRegionsD } from '../../../node/ServerRegionsD';
import { VirtualizationProducts } from '../../../node/VirtualizationProducts';
import { Config } from '../../../node/Config';
import middleChecker from '../../../node/middleChecker';
import _ from 'lodash';
import Head from 'next/head';
import { WithTheme } from '../../_Layout/HocLayout';
import { Anchor, Box, Card, Container, Flex, Group, List, Paper, SimpleGrid, Stack, Tabs, Text, Title } from '@mantine/core';
import { PaymentOptions } from '../_Component/PaymentOptions';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from '../_Component/CheckoutForm';
import { useRouter } from 'next/router';
import SaveCards from '../_Component/SaveCards';
import PaystackButtonAction from '../_Component/PaystackButtonAction';
import { payStack } from '../../../node/payStack';
import { ServerCartConfig } from '../../../node/ServerCartConfig';
import { Ucword } from '../../../Components/TextFormatter';
import { BsCpu } from 'react-icons/bs';
import { FaMemory } from 'react-icons/fa';
import { IconServer } from '@tabler/icons';
import { VscWindow } from 'react-icons/vsc';
import CurrencyFormat from 'react-currency-format';
import StripeIcon from '../../../Components/icons/StripeIcon';
import { PayStackVM } from '../../../node/PayStackVM';
import HeaderOrder from '../../order/Component/HeaderOrder';
import MiniSection from '../_Component/MiniSection';
import { trpc } from '../../../utils/trpc';
import MiniSectionConfirm from '../_Component/MiniSectionConfirm';
import StepperBox from '../_Component/Stepper';

const Index = (props: any) => {

    const [selectedPaymentMethod, setselectedPaymentMethod] = useState("default")
    const stripePromise = loadStripe(props.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const [activeTab, setActiveTab] = useState<string | null>('first');
    const config = props?.vmConfig
    let customer = props?.session?.customer[0];
    let cartId = props?.query?.id
    const router = useRouter()
    let billingAddress = props?.session?.customer[0]?.BillingAddress;




    return (
        <>

            <Head>
                <title>Choose your payment method</title>
            </Head>
            <HeaderOrder {...props}/>
            <Box className='py-2 border-b border-b-gray-200 bg-white'>
                <Container>
                    <StepperBox step={2}/>
                </Container>
            </Box>
            <Container size="70rem" className="space-y-6 relative  py-20 container-config mb-16" style={{ position: "relative" }}>

                <Box className='space-y-4'>
                    <Title order={1} className=' font-light'>
                        Choose your payment method
                    </Title>
                    <Text size={15} className=' text-gray-700'>
                        Use Credit Card to pay the amount due today and any future subscription renewals automatically.
                    </Text>
                </Box>

                <Box>
                    <Flex
                        gap={20}
                    >
                        <Box className='w-3/4'>
                            <Card p="lg" radius="sm" className=' border w-full py-8 border-gray-200 min-h-[200px]'>



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

                                                    <CheckoutForm cartId={cartId} auth={customer} billingAddress={billingAddress} />

                                                </Tabs.Panel>
                                                <Tabs.Panel value="second">
                                                    <Box className='py-6 border-b mb-6'>
                                                        {activeTab == "second" && <SaveCards cartId={cartId} auth={customer} billingAddress={billingAddress} />}
                                                    </Box>
                                                </Tabs.Panel>
                                            </Tabs>



                                        </div>
                                    </Elements>

                                    <Box hidden={!_.isEqual(selectedPaymentMethod, "paystack")}>

                                        <PaystackButtonAction {...props} />
                                    </Box>
                                </Card.Section>

                                <Card.Section hidden={!_.isEqual(selectedPaymentMethod, "default")} className='px-8 pt-3  border-t border-t-gray-300' style={{ borderTop: "1px solid #eee" }}>
                                    <Flex gap={15} align={"center"}>
                                        <div>
                                            <StripeIcon className=' w-14 h-14' />
                                        </div>
                                        <div >
                                            <Text className=' text-gray-700 mb-2'>Your payment information is safe</Text>
                                            <Text className=' text-gray-600 mb-2' size={14}>We use Stripe, a third party payment processor to store and secure your information.</Text>
                                            <Text className=' text-gray-600' size={14}>Your card is securely stored on our payment providers servers. Your card will be charged once you complete your order. It will be used in the future for renewals of this subscription or any others subscriptions on your account.</Text>
                                        </div>
                                    </Flex>
                                </Card.Section>
                            </Card>
                        </Box>
                        <MiniSectionConfirm config={config} props={props} />
                    </Flex>
                </Box>

            </Container>


        </>
    )
}

export default Index

export async function getServerSideProps(context: any) {
    const { req, res }: ServerSideProps = context;

    const query = context.query;

    let session: any = await AuthCheck(req, res)
    let regions: any = await ServerRegionsD(req, res)
    // let virtualizations: any = await VirtualizationProducts(req, res)
    let config = await Config();
    let paystack = await PayStackVM(context)

    let vmConfig: any = await ServerCartConfig(context)

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
            // virtualizations,
            config,
            query,
            vmConfig,
            paystack,
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            regions
        },
    }
}
