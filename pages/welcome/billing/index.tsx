import React from 'react'
import { WithTheme } from '../../_Layout/HocLayout'
import _ from 'lodash'
import { AuthCheck } from '../../../node/AuthCheck'
import { ServerSideProps } from '../../../Types/ServerInterface'
import UserHeader from '../../_Layout/UserHeader'
import WelcomeHeader from '../../_Layout/WelcomeHeader'
import { Box, Container, Paper, Tabs, Text, Title, createStyles } from '@mantine/core'
import CardPaymentIcon from '../../../Components/icons/CardPaymentIcon'
import PaypalIcon2 from '../../../Components/icons/PaypalIcon2'
import GooglePayIcon from '../../../Components/icons/GooglePayIcon'
import GoogleIcon from '../../../Components/icons/GoogleIcon'
import CreditCard from '../../../Components/icons/CreditCard'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js';
import PaymentMethods from '../../_blocks/PaymentMethods'
import StripePaymentBlock from '../../_blocks/StripePaymentBlock'
import StripePaymentForm2 from '../../_blocks/StripePaymentForm2'
import Head from 'next/head'
import middleChecker from '../../../node/middleChecker'

const useStyles = createStyles((theme) => ({
    tab: {

        '&[data-active]': {
            backgroundColor: "#eff6ff"
        },
    },
}))

const Index = (props: any) => {
    const { classes, theme, cx } = useStyles();
    const stripePromise = loadStripe(props.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    return (

        <>
            <Head>
                <title>
                    Verify your identity
                </title>
            </Head>
            <WithTheme props={props}>
                <Container size={'xl'} className="px-12 space-y-6 mb-16">
                    <div className=' space-y-4'>
                        <Title order={3}>Verify your identity</Title>
                        <Text className=' text-gray-600'>
                            You must first authenticate your identity with a payment method before using HostSpacing. This enables us to better protect our community from spammers and automated systems.
                        </Text>
                    </div>
                    <Paper className='border'>
                        <Tabs classNames={{
                            tab: classes.tab,
                        }} orientation="vertical" defaultValue="gallery" className='min-h-[70vh]'>
                            <Tabs.List >
                                <Tabs.Tab value="gallery" className='px-4 py-3' icon={<CreditCard className=' w-6 h-6' />}>
                                    <Text size={"md"}>Add a Card</Text>
                                </Tabs.Tab>
                                <Tabs.Tab value="messages" className='px-4 py-3' icon={<PaypalIcon2 className=' w-6 h-6' />}>
                                    <Text size={"md"}>Connect with PayPal</Text>
                                </Tabs.Tab>
                                <Tabs.Tab value="settings" className='px-4 py-3' icon={<GoogleIcon className=' w-6 h-6' />}>
                                    <Text size={"md"}>Connect Google Pay</Text>
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="gallery" pl="xs">
                                <Box className='p-6'>
                                    <Elements stripe={stripePromise}>
                                        <StripePaymentForm2 {...props.session} />
                                    </Elements>
                                </Box>
                            </Tabs.Panel>

                            <Tabs.Panel value="messages" pl="xs">
                                <Box className='p-6'>

                                </Box>
                            </Tabs.Panel>

                            <Tabs.Panel value="settings" pl="xs">
                                <Box className='p-6'>

                                </Box>
                            </Tabs.Panel>
                        </Tabs>
                    </Paper>
                </Container>
            </WithTheme>

        </>
    )
}

export default Index

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
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            session,
        },
    }
}
