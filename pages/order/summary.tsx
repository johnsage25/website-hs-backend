import React, { useEffect, useState } from 'react'
import CartHeader from './Component/CartHeader'
import OrderTab from './Component/OrderTab'
import { AuthCheck } from '../../node/AuthCheck'
import { getSSLProduct } from '../../node/getSSLProduct'
import { getProduct } from '../../node/getProduct'
import { ServerSideProps } from '../../Types/ServerInterface'
import _, { truncate } from 'lodash'
import { ActionIcon, Alert, Badge, Box, Button, CardSection, Container, Flex, Group, Kbd, List, Paper, Select, Text, ThemeIcon, Title, UnstyledButton } from '@mantine/core'
import CurrencyFormat from 'react-currency-format'
import SharedHostingIcon from '../../Components/icons/SharedHostingIcon'
import { AiOutlineArrowLeft, AiOutlineCheck } from 'react-icons/ai'
import { IconAlertCircle, IconCheck } from '@tabler/icons'
import Head from 'next/head'
import collect from 'collect.js'
import { PackageTerms } from '../../options'
import { BsGlobe, BsLock, BsTrash } from 'react-icons/bs'
import { VscLock } from 'react-icons/vsc'
import { trpc } from '../../utils/trpc'
import { calculateDiscountPercentageHelper, getPercentageAmount } from '../../utils/helpers'
import SummaryPayment from './Component/SummaryPayment'
import { getHotkeyHandler, useDisclosure, useOs } from '@mantine/hooks'
import MiniDomainSearch from './Component/MiniDomainSearch'
import { useRecoilState } from 'recoil'
import { domainState } from '../../atoms/domainState'
import Mousetrap from "mousetrap";
import BackupIcon from '../../Components/icons/BackupIcon'
import HeaderOrder from './Component/HeaderOrder'

const Summary = (props: any) => {
    const os = useOs();
    const [cart, setcart] = useState(props?.cart)
    let updateTermMutation = trpc.cart.updateTerm.useMutation()
    const updateSSLMutation = trpc.cart.updateSSL.useMutation()
    const [setOs, setsetOs] = useState("")
    const [openedS_D, handlers] = useDisclosure(false);
    let deleteTldOrderMutation = trpc.cart.deleteTldOrder.useMutation()
    const [selectTld, setselectTld] = useRecoilState<any>(domainState);
    let utils = trpc.useContext()
    const [loading, setloading] = useState("")

    trpc.cart.cartMiniBox.useQuery({}, {
        keepPreviousData: true, onSettled(data: any, error) {
            setcart(data)

            // console.log(data);

        },
    })

    useEffect(() => {
        Mousetrap.bind(['command+backspace', 'ctrl+backspace'], () => {
            handlers.close()
        });

        return () => {
            Mousetrap.unbind(['command+backspace', 'ctrl+backspace']);
        };
    }, [handlers]);

    useEffect(() => {
        setsetOs(os)
    }, [])


    // useEffect(() => {

    //     document.body.addEventListener(
    //         'keydown',
    //         getHotkeyHandler([
    //             ['Meta+Backspace', () => handlers.close()],
    //             ['ctrl+backspace', () => handlers.close()],
    //         ])
    //     );


    // }, [])

    let discount: any = cart?.product[0]?.pricing.filter((item) => item?.period == cart?.selectedPackage[0]?.period)
    // // console.log(cart);

    let connections = collect(PackageTerms)

    console.log(cart);


    return (
        <>

            <Head>
                <title>Cart - HostSpacing</title>
            </Head>


            <div>
                <HeaderOrder {...props} />
                <Box className='py-2  border-b border-b-gray-200 bg-white'>
                    <Container>
                        <OrderTab active={2} />
                    </Container>
                </Box>

                <Container size={'lg'} className=" my-10 px-8">
                    <div className="flex justify-between mb-8">
                        <Title order={1} className=" font-medium text-3xl text-arapawa-700">
                            Your Cart
                        </Title>
                    </div>

                    <Flex gap={20}>
                        <Box className="w-3/4">
                            <Paper hidden={openedS_D} className="bg-white min-h-[400px]  border border-gray-200 py-6 px-8 space-y-6" >
                                <Box className=' divide-y'>

                                    {cart.product.map((item: any, key: number) => {

                                        const SelectedPackage = collect(cart?.selectedPackage);
                                        let pa = SelectedPackage.firstWhere('productId', item?._id);

                                        let Pricing = collect(item?.pricing)
                                        let price = Pricing.firstWhere('period', pa?.period);

                                        return (
                                            <div key={key} className=' border px-4 py-4 divide-y'>
                                                <Group className=' items-center justify-between py-4'>
                                                    <div className=' flex gap-4 items-center'>
                                                        <div>
                                                            <SharedHostingIcon className=' w-12 h-12' />
                                                        </div>
                                                        <div>
                                                            <Group>
                                                                <Text size={20} fw={700}>{item?.productName}</Text>
                                                                {discount[0]?.discount > 0 ? <> <Text className="tag">{discount[0]?.discount}% Off</Text></> : <></>}
                                                            </Group>
                                                            {!_.isEmpty(pa?.domain) && <Text fz={"sm"}>for {pa?.domain}</Text>}
                                                            {_.isEqual(cart?.backup, true) &&
                                                                <>
                                                                    <Group spacing={"xs"}>
                                                                        <BackupIcon className=' w-6 h-6' />
                                                                        <Text fz={"sm"}>With Backup</Text>
                                                                        <Text fz={"sm"} className=' text-arapawa-600'><CurrencyFormat value={item?.backupAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Text>
                                                                    </Group>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>


                                                    <div>
                                                        <Group spacing={5} className='items-baseline'>

                                                            {price?.discount > 0 && <Text fw={600} size={18} className=' text-blue-800 line-through'><CurrencyFormat value={price?.amount} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} /></Text>}

                                                            <Group spacing={2} >
                                                                <Text size={18} fw={600} className=' text-gray-800'><CurrencyFormat value={getPercentageAmount(price?.amount, price?.discount)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Text>
                                                                <Text size={'sm'}>/{connections.firstWhere('value', pa?.period).label}</Text>
                                                            </Group>
                                                        </Group>
                                                    </div>
                                                </Group>
                                                <div className='pt-4'>
                                                    <List size="sm"
                                                        icon={
                                                            <IconCheck stroke={3} color="teal" size={19} />
                                                        }
                                                    >
                                                        <List.Item>Unlimited Free SSL</List.Item>
                                                        <List.Item>99,90% Uptime Guarantee</List.Item>
                                                        <List.Item>Malware Scanner</List.Item>
                                                    </List>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div className='mt-6 py-3'>


                                        <Text>Domains</Text>
                                        <div className='py-2 space-y-3'>

                                            {_.isEmpty(cart?.domainSelected) && <Alert icon={<IconAlertCircle size="1rem" />}>
                                                <div className=' space-y-2'>
                                                    <Text>No domain is connected to your package currently. A temporary domain will be added, but you can press the button below to get a permanent domain if you prefer.</Text>
                                                    <Button onClick={() => {
                                                        handlers.open();
                                                    }} variant='default' className='bg-white' size='xs' radius={"xl"}>Add Domain</Button>
                                                </div>
                                            </Alert>}



                                            {cart?.domainSelected?.map((item: any, key: number) => {

                                                let yearData = Array.from({ length: item?.maxPeriod }, (_, index) => index + 1)
                                                    .map((item: any) => {
                                                        return {
                                                            value: item,
                                                            label: `${item} Year`
                                                        }
                                                    })


                                                return (
                                                    <div key={key} className='border border-slate-200 rounded px-4 py-4'>
                                                        <div className=' divide-y' >


                                                            <Group spacing={10} className="mb-4 justify-between">
                                                                <div className='items-end'>

                                                                    <Text fw={700} className='text-arapawa-600'>{truncate(item.domainName, {
                                                                        length: 50,
                                                                        omission: "..."
                                                                    })}</Text>

                                                                </div>

                                                                <ActionIcon loading={deleteTldOrderMutation.isLoading && loading == item._id} onClick={() => {

                                                                    setloading(item._id)
                                                                    deleteTldOrderMutation.mutate({ id: item._id }, {
                                                                        onSuccess(data, variables, context) {
                                                                            utils.cart.domainCart.invalidate()
                                                                            utils.cart.cartMiniBox.invalidate()
                                                                            setselectTld({ inner: [...selectTld?.inner.filter((item) => item._id !== item._id)] });

                                                                        },
                                                                    })
                                                                }} radius={"xl"}>
                                                                    <BsTrash />
                                                                </ActionIcon>

                                                            </Group>

                                                            <Group className=' justify-between py-4'>
                                                                <div className=' w-2/6'>
                                                                    <Select
                                                                        radius={"xl"}
                                                                        // variant="filled"
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

                                                                    {item?.promo && <Badge size='md'>{
                                                                        `SAVED ${calculateDiscountPercentageHelper(item?.registerPrice, item?.promoRegisterPrice).toFixed(1)}%`
                                                                    }</Badge>}

                                                                </div>

                                                                <div>
                                                                    {item.promo ? (
                                                                        <Group spacing={6}>
                                                                            <Text fw={700} className=' text-arapawa-600'><CurrencyFormat value={(item.term * item.promoRegisterPrice)} decimalScale={2} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix='/yr' /></Text>
                                                                            <Text className=' line-through text-gray-500'><CurrencyFormat value={(item.term * item.renewPrice)} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} suffix='/yr' /></Text>
                                                                        </Group>
                                                                    ) : (
                                                                        <>
                                                                            <Group spacing={6}>
                                                                                <Text fw={700} className=' text-arapawa-600'><CurrencyFormat value={(item.term * item.registerPrice)} decimalScale={2} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix='/yr' /></Text>
                                                                                {item.renewPrice > item.registerPrice && <Text className=' line-through text-gray-500'><CurrencyFormat value={(item.term * item.renewPrice)} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} suffix='/yr' /></Text>}
                                                                            </Group>

                                                                        </>
                                                                    )}

                                                                </div>
                                                            </Group>

                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {!_.isEmpty(cart?.domainSelected) && <div className=' flex justify-center w-full'>
                                                <Button onClick={() => {
                                                    handlers.open();
                                                }} radius={"xl"} variant='default'>Add more</Button>
                                            </div>}

                                        </div>
                                    </div>
                                    <Box className='mt-6 py-3' hidden={_.isEmpty(cart?.ssl)}>
                                        <Text>
                                            Options
                                        </Text>
                                        <div className='py-2'>
                                            {cart?.ssl?.map((item: any, key: number) => {
                                                return (
                                                    <div key={key} className=' border rounded px-4 py-4'>
                                                        <Group className=' justify-between'>
                                                            <div className='flex gap-3 items-center'>
                                                                <VscLock size={20} />
                                                                <div>
                                                                    <Title order={5} fw={500} className=' text-gray-800'>{item?.name}</Title>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Group spacing={3}>
                                                                    <Text fw={600} className=' text-blue-800'><CurrencyFormat decimalScale={2} value={item?.price} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Text>
                                                                    <Text size={'sm'}>/Year</Text>
                                                                </Group>

                                                            </div>
                                                        </Group>
                                                    </div>
                                                )
                                            })}

                                            {// console.log(cart)
                                            }
                                        </div>
                                    </Box>
                                </Box>

                            </Paper>
                            <Paper hidden={!openedS_D} className="bg-white min-h-[500px]  border border-gray-200 space-y-6" >
                                <Box p={0} className='border-b py-3 px-4 flex justify-between'>
                                    <UnstyledButton onKeyDown={getHotkeyHandler([
                                        ['Meta+Backspace', () => handlers.close()],
                                        ['mod+shift', () => handlers.close()],
                                    ])} className=' hover:text-azure-radiance-600' onClick={() => {
                                        handlers.close()
                                    }}>
                                        <Group spacing={10}>
                                            <AiOutlineArrowLeft />
                                            <Text>Back</Text>
                                        </Group>
                                    </UnstyledButton>

                                    <div>
                                        {_.isEqual(setOs, "macos") && <> <Kbd>⌘</Kbd> + <Kbd>delete</Kbd> </>}
                                        {_.isEqual(setOs, "windows") && <> <Kbd>ctrl</Kbd> + <Kbd>backspace</Kbd> </>}
                                    </div>
                                </Box>
                                <Box>
                                    <MiniDomainSearch />
                                </Box>
                            </Paper>
                        </Box>

                        <SummaryPayment />

                    </Flex>
                </Container>
            </div>
        </>
    )
}

export default Summary


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