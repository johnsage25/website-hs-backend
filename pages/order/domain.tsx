import { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import { AuthCheck } from '../../node/AuthCheck'
import { getSSLProduct } from '../../node/getSSLProduct'
import { getProduct } from '../../node/getProduct'
import { ServerSideProps } from '../../Types/ServerInterface'
import _ from 'lodash'
import { ActionIcon, Badge, Box, Button, Container, Flex, Group, Header, Kbd, Modal, Paper, Select, SimpleGrid, Stack, Switch, Text, Title, UnstyledButton, useMantineTheme } from '@mantine/core'
import LogoW from '../../Components/LogoW'
import OrderTab from './Component/OrderTab'
import CartPReview from './Component/CartPReview'
import { getPackages } from '../../node/packages'
import { ProductBox } from './Component/ProductBox'
import { calculateDiscountPercentageHelper, splitDomain } from '../../utils/helpers'
import CurrencyFormat from 'react-currency-format'
import { trpc } from '../../utils/trpc'
import { BsCartCheck, BsTrash } from 'react-icons/bs'
import SharedHostingIcon from '../../Components/icons/SharedHostingIcon'
import CartHeader from './Component/CartHeader'
// import '../../styles/cart.scss'
import { openModal } from '@mantine/modals';
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { PackageBox } from './Component/PackageBox'
import Head from 'next/head'
import Mousetrap from "mousetrap";
import { useDisclosure, useOs } from '@mantine/hooks'
import HeaderOrder from './Component/HeaderOrder'

const Hosting = (props: AppProps | any) => {
    const os = useOs();
    const theme = useMantineTheme()
    const [loading, setloading] = useState("")
    let deleteTldOrderMutation = trpc.cart.deleteTldOrder.useMutation()
    let updateTermMutation = trpc.cart.updateTerm.useMutation()
    let updatePrivacyMutation = trpc.cart.updateDomainID.useMutation()
    let getPackagesMutation = trpc.cart.getPackages.useMutation()
    let updatePackageOnCart = trpc.cart.cartPackageUpdate.useMutation();
    const [productGrid, setproductGrid] = useState([])
    const [setOs, setsetOs] = useState("")
    const [openedS_D, handlers] = useDisclosure(false);

    let utils = trpc.useContext()

    const [cart, setcart] = useState(props?.cart)

    let domainCartQuery = trpc.cart.domainCart.useQuery({}, {
        onSettled(data: any, error) {
            setcart(data)


            if (_.isEmpty(data?.domainSelected)) {
                window.location.assign(`${props.HOME_DOMAIN}/domain-name-search`)
            }


        },
    })

    useEffect(() => {
        setsetOs(os)
    }, [])

    useEffect(() => {
        Mousetrap.bind(['command+b', 'ctrl+backspace'], () => {
            handlers.close()
        });

        return () => {
            Mousetrap.unbind(['command+b', 'ctrl+backspace']);
        };
    }, [handlers]);



    let gridProduct: any = getPackagesMutation?.data || []


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



                <Container size={'lg'} className=" my-10">
                    <div className="flex justify-between mb-8">
                        <Title order={1} className=" font-medium text-3xl text-gray-800">
                            Set up your Domain
                        </Title>
                    </div>


                    <Flex gap={20}>

                        <Box className="w-3/4 bg-white divide-y shadow rounded-md">
                            <Paper className={openedS_D ? "hidden" : "block min-h-[400px]  py-6 px-8 divide-y space-y-6"}
                            >
                                <div className='space-y-6'>
                                    {cart?.domainSelected.map((item: any, key: any) => {

                                        let yearData = Array.from({ length: item?.maxPeriod }, (_, index) => index + 1)
                                            .map((item: any) => {
                                                return {
                                                    value: item,
                                                    label: `${item} Year`
                                                }
                                            })

                                        return (
                                            <Box key={key} className=' border p-4 rounded divide-y'>
                                                <Group className='py-2 justify-between'>
                                                    <Title order={3} className=' text-gray-800'>{item?.domainName}</Title>
                                                    <ActionIcon loading={deleteTldOrderMutation.isLoading && loading == item._id} onClick={() => {

                                                        setloading(item._id)

                                                        deleteTldOrderMutation.mutate({ id: item._id }, {
                                                            onSuccess(data, variables, context) {
                                                                utils.cart.domainCart.refetch()

                                                            },
                                                        })
                                                    }} radius={"xl"}>
                                                        <BsTrash />
                                                    </ActionIcon>
                                                </Group>
                                                <Group className='py-2 border-t border-b justify-between'>
                                                    <div>
                                                        <Title order={4} className=' text-gray-800'>.{splitDomain(item?.domainName)[1]} Domain Registration</Title>
                                                        <Text size={15} className=' text-gray-500'>Registration renews at <CurrencyFormat value={(item.term * item?.renewPrice)} decimalScale={2} displayType={'text'}
                                                            suffix='/yr' thousandSeparator={true} prefix={'$'} /></Text>
                                                    </div>
                                                    <div>
                                                        <Select
                                                            radius={"xl"}

                                                            defaultValue={item?.term}
                                                            data={yearData}
                                                            onChange={(selected) => {

                                                                updateTermMutation.mutate({
                                                                    term: parseInt(`${selected}`),
                                                                    id: item._id
                                                                }, {
                                                                    onSuccess(data, variables, context) {
                                                                        utils.cart.domainCart.refetch()
                                                                        utils.cart.cartMiniBox.invalidate()
                                                                    },
                                                                })


                                                            }}
                                                        />
                                                    </div>
                                                    <div>

                                                        {item?.promo && <Badge color="green" variant="filled" size='md'>{
                                                            `SAVED ${calculateDiscountPercentageHelper(item?.registerPrice, item?.promoRegisterPrice).toFixed(1)}%`
                                                        }</Badge>}

                                                    </div>
                                                    <div>
                                                        {item?.promo ? (
                                                            <>
                                                                <Text size={18} fw={600} className=' text-gray-800'><CurrencyFormat decimalScale={2} value={(item.term * item?.promoRegisterPrice)} displayType={'text'}
                                                                    suffix='/yr' thousandSeparator={true} prefix={'$'} /></Text>
                                                                <Text className='line-through text-gray-500'><CurrencyFormat value={(item.term * item?.registerPrice)} displayType={'text'}
                                                                    suffix='/yr' decimalScale={2} thousandSeparator={true} prefix={'$'} /></Text>
                                                            </>
                                                        ) : (

                                                            <>

                                                                <Text size={18} fw={600} className=' text-gray-800'>


                                                                    <CurrencyFormat value={(item.term * item?.registerPrice)} decimalScale={2} displayType={'text'}
                                                                        suffix='/yr' thousandSeparator={true} prefix={'$'} /></Text>

                                                                {item?.renewPrice > item?.registerPrice && <Text className=' line-through text-gray-500'>
                                                                    <CurrencyFormat value={(item.term * item?.renewPrice)} decimalScale={2} displayType={'text'}
                                                                        suffix='/yr' thousandSeparator={true} prefix={'$'} /></Text>}
                                                            </>


                                                        )}



                                                    </div>
                                                </Group>
                                                <div>
                                                    <Group className=' justify-between items-center'>

                                                        <Switch checked={item?.domainPrivacy} onChange={(e) => {


                                                            updatePrivacyMutation.mutate({ status: e.currentTarget.checked, id: item._id }, {
                                                                onSettled(data, error, variables, context) {
                                                                    utils.cart.domainCart.refetch()
                                                                },
                                                            })
                                                        }} label="Domain Privacy Protection" />

                                                        <div className='py-1'>
                                                            <Text fw={500}><CurrencyFormat value={0} decimalScale={2} displayType={'text'}
                                                                suffix='/yr' thousandSeparator={true} prefix={'$'} /></Text>

                                                        </div>
                                                    </Group>
                                                </div>
                                            </Box>
                                        )
                                    })}
                                </div>
                                <div className=' py-6'>
                                    <div className='flex space-x-6 items-center'>
                                        <div>
                                            <SharedHostingIcon className=' w-16 h-16' />
                                        </div>
                                        <div>
                                            <Text fw={700}>Web Hosting</Text>
                                            <Text size={15}>Host your website. Enjoy unmetered bandwidth with free Website Builder, cPanel, and WordPress.</Text>
                                        </div>
                                        <div>
                                            <Button loading={getPackagesMutation.isLoading} onClick={(e) => {
                                                getPackagesMutation.mutate({ id: null, pageBlock: "domain-page" }, {
                                                    onSuccess(data, variables, context) {

                                                        handlers.open()

                                                    },
                                                    onError(error, variables, context) {

                                                    },
                                                })
                                            }} disabled={!_.isEmpty(cart?.product)} leftIcon={<BsCartCheck stroke={"2"} size={17} />} radius={"xl"} className='bg-azure-radiance-500 hover:bg-azure-radiance-600'>
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Paper>

                            <Paper className={openedS_D ? "block" : "hidden"}>
                                <div className='flex px-4 py-2 border-b justify-between items-center'>
                                    <UnstyledButton onClick={() => {
                                        handlers.close()
                                    }} className='py-2'>
                                        <Group>
                                            <AiOutlineArrowLeft fontSize={4} color='black' size={20} />
                                            <Text>Back</Text>
                                        </Group>
                                    </UnstyledButton>

                                    <div>
                                        {_.isEqual(setOs, "macos") && <> <Kbd>⌘</Kbd> + <Kbd>delete</Kbd> </>}
                                        {_.isEqual(setOs, "windows") && <> <Kbd>ctrl</Kbd> + <Kbd>backspace</Kbd> </>}
                                    </div>
                                </div>
                                <Box className='p-6 '>
                                    <PackageBox loading={updatePackageOnCart.isLoading} onChange={(item) => {

                                        updatePackageOnCart.mutate({ id: item._id, period: item.pricing[0].period }, {
                                            onSuccess(data, variables, context) {
                                                // console.log(data);

                                                utils.cart.domainCart.refetch()
                                                utils.cart.cartMiniBox.invalidate()
                                                handlers.close()
                                            },
                                            onError(error, variables, context) {
                                                // console.log(error);
                                            },
                                        })


                                    }} data={gridProduct?.products} defaultValue={cart?.product[0]} />
                                </Box>
                            </Paper>

                        </Box>
                        <CartPReview {...props} />
                    </Flex>
                </Container >
            </div >
        </>
    )
}

export default Hosting


export async function getServerSideProps(context: ServerSideProps) {
    const { req, res }: any = context
    let session: any = await AuthCheck(req, res)

    let sslProduct: any = await getSSLProduct(context)
    let cart = await getProduct(req, res)
    let hostingPackages:any = await getPackages(req, res, 'domain-page');
    let HOME_DOMAIN = process.env.HOME_DOMAIN

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
            hostingPackages,
            HOME_DOMAIN
        },
    }
}
