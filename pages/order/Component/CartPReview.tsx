import { ActionIcon, Box, Button, Center, Divider, Group, Loader, Paper, Stack, Text, Title, UnstyledButton } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { CartInterface } from '../../../Types/CartInterface'
import CurrencyFormat from 'react-currency-format'
import { HiOutlineTrash } from 'react-icons/hi'
import { PackageTerms } from '../../../options'
import collect from 'collect.js'
import { BsArrowUpShort, BsCart } from 'react-icons/bs'
import { SSLProductInterface } from '../../../Types/SSLProductInterface'
import { Ucword } from '../../../Components/TextFormatter'
import { trpc } from '../../../utils/trpc'
import CurvedArrow from '../../../Components/icons/CurvedArrow'
import { useRouter } from 'next/router'
import { calculateDiscountPercentageHelper, getPercentageAmount } from '../../../utils/helpers'


const CartPReview = (props: any) => {
    const router = useRouter()
    const cartMiniBoxQuery = trpc.cart.cartMiniBox.useQuery({}, { keepPreviousData: true })
    const updateCartMutation = trpc.cart.updateApp.useMutation()
    const deleteProductMutation = trpc.cart.deleteProduct.useMutation()
    const utils = trpc.useContext()
    let cart: any = cartMiniBoxQuery?.data
    const updateSSLMutation = trpc.cart.updateSSL.useMutation()
    const checkAuthMutation = trpc.cart.checkAuth.useMutation()

    const sslProduct: SSLProductInterface[] = props?.sslProduct
    const [selectedSSL, setselectedSSL] = useState<SSLProductInterface>(cart?.ssl[0])
    let connections = collect(PackageTerms)

    let priceColletion = collect(cart?.product[0]?.pricing)


    let productTotalPrice = cart?.product?.reduce((acc: any, prod) => {

        const SelectedPackage = collect(cart?.selectedPackage);
        let pa = SelectedPackage.firstWhere('productId', prod?._id);

        let Pricing = collect(prod?.pricing)
        let priced = Pricing.firstWhere('period', pa?.period);

        let p: any = getPercentageAmount(priced?.amount, priced?.discount)

        let backup: number = cart?.backup ? parseFloat(`${cart?.product[0]?.backupAmount}`) : 0;

        return acc + parseFloat(p) + (parseFloat(`${cart?.ssl[0]?.price}`) || 0) + backup

    }, 0)



    const totalRegisterPrice = cart?.domainSelected.reduce((acc: any, tld: any) => {

        return acc + (tld.term * (tld.promo ? tld.promoRegisterPrice : tld.registerPrice))
    }, 0);


    let totalPrice = totalRegisterPrice + (productTotalPrice || 0)



    return (
        <Box className="w-1/3 relative">
            <Paper pos={'sticky'} className="sticky top-6 ">
                <div className=" bg-white  border border-gray-200 rounded-md min-h-[300px]  flex flex-col justify-between">
                    <div className="py-3 px-4 border-b ">
                        <Text fw={600} size={18} className=' text-gray-800'>
                            Your selection
                        </Text>
                    </div>
                    {cartMiniBoxQuery.isLoading &&
                        <div className=' flex justify-center grow py-20'><Loader size={"md"} /></div>}
                    <Box hidden={!cartMiniBoxQuery.isSuccess}>
                        <div className='grow px-6 py-4 min-h-[200px]'>
                            {!_.isEmpty(cart) ? (
                                <>
                                    <div>
                                        {!_.isEmpty(cart?.product) &&
                                            <div>
                                                <Text size={'xs'}>Hosting</Text>
                                                <div className='border-b items-center pb-3'>

                                                    <div className='flex justify-between'>

                                                        {cart?.product.map((item: any, key: number) => {

                                                            const SelectedPackage = collect(cart?.selectedPackage);
                                                            let pa = SelectedPackage.firstWhere('productId', item?._id);

                                                            let Pricing = collect(item?.pricing)
                                                            let price = Pricing.firstWhere('period', pa?.period);



                                                            return (
                                                                <>

                                                                    <div>
                                                                        <Group>
                                                                            <Text size={20} fw={500} className=' text-gray-800'>{item?.productName}</Text>
                                                                        </Group>
                                                                        {!_.isEmpty(pa?.domain) && <Text fz={"sm"}>for {pa?.domain}</Text>}
                                                                    </div>
                                                                    <div className='flex space-x-1 items-baseline'>
                                                                        <Group spacing={10} align='center'>

                                                                            {price?.discount > 0 && <Text fw={600} size={16} className=' text-blue-800 line-through'><CurrencyFormat value={price?.amount} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} /></Text>}


                                                                            <div className='flex space-x-1 items-center'>
                                                                                <Text size={18} fw={600} className=' text-gray-800'><CurrencyFormat value={getPercentageAmount(price?.amount, price?.discount)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Text>
                                                                                <Text size={'sm'}>/{connections.firstWhere('value', pa?.period).label}</Text>
                                                                                <ActionIcon size={16} loading={deleteProductMutation.isLoading} onClick={() => {

                                                                                    deleteProductMutation.mutate({ id: item.id }, {
                                                                                        onSettled(data, error, variables, context) {
                                                                                            utils.cart.domainCart.refetch()
                                                                                            utils.cart.cartMiniBox.invalidate()
                                                                                        },
                                                                                        onError(error, variables, context) {
                                                                                            // console.log(error);

                                                                                        },
                                                                                    })
                                                                                }} >
                                                                                    <HiOutlineTrash size={18} />
                                                                                </ActionIcon>
                                                                            </div>

                                                                        </Group>

                                                                    </div>

                                                                </>
                                                            )
                                                        })}

                                                    </div>



                                                    {cart.backup &&
                                                        <div className='ml-5 flex justify-between items-center'>

                                                            <div className='flex mt-4 ml-8 space-x-3 justify-between w-full items-center'>
                                                                <div className=' relative'>
                                                                    <CurvedArrow className=' absolute w-6 h-6 -left-8 -top-4' />
                                                                    <Text size={14} fw={500} className=' text-arapawa-600 '>{"Backup"}</Text>
                                                                </div>
                                                                <div className='h-1 w-full border-2 border-dashed' />
                                                                <div>
                                                                    <Text fz={"sm"}><CurrencyFormat decimalScale={2} value={cart?.product[0]?.backupAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Text>
                                                                </div>
                                                            </div>

                                                        </div>}

                                                </div>
                                            </div>}

                                        <div>
                                            {!_.isEmpty(cart?.domainSelected) &&
                                                <>
                                                    <Text size={'sm'} >Domains</Text>
                                                    <div className=' space-y-1'>
                                                        {cart?.domainSelected.map((item: any, key: number) => {

                                                            return (
                                                                <div key={key}>
                                                                    <Group className=' justify-between'>
                                                                        <Text fw={700} className='text-gray-800'>{item.domainName}</Text>
                                                                        <div>
                                                                            {item.promo ? (
                                                                                <Group spacing={6}>
                                                                                    <Text className=' line-through text-gray-500'><CurrencyFormat value={(item.term * item.renewPrice)} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} suffix='/yr' /></Text>
                                                                                    <Text fw={700} className=' text-gray-800'><CurrencyFormat value={(item.term * item.promoRegisterPrice)} decimalScale={2} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix='/yr' /></Text>

                                                                                </Group>
                                                                            ) : (
                                                                                <>
                                                                                    <Group spacing={6}>
                                                                                        <Text fw={700} className=' text-gray-800'><CurrencyFormat value={(item.term * item.registerPrice)} decimalScale={2} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix='/yr' /></Text>
                                                                                        {item.renewPrice > item.registerPrice && <Text className=' line-through text-gray-500'><CurrencyFormat value={(item.term * item.renewPrice)} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} suffix='/yr' /></Text>}
                                                                                    </Group>

                                                                                </>
                                                                            )}

                                                                        </div>
                                                                    </Group>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </>
                                            }

                                        </div>

                                        <div className=' border-b py-3'>
                                            <Text size={'xs'}>Option</Text>

                                            <div className=' flex justify-between items-center'>
                                                <div>
                                                    <Title order={5} fw={500} className=' text-gray-800'>{cart?.ssl[0]?.name}</Title>
                                                </div>
                                                {cart?.ssl[0]?.price > 0 &&
                                                    <div className='flex space-x-1 items-center'>

                                                        <Text fw={600} className=' text-gray-800'><CurrencyFormat decimalScale={2} value={cart?.ssl[0]?.price} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Text>
                                                        <Text size={'sm'}>/Year</Text>
                                                        <ActionIcon loading={updateSSLMutation?.isLoading} onClick={() => {




                                                            updateSSLMutation.mutate({ name: sslProduct[0].name, sslId: sslProduct[0]._id }, {
                                                                onSuccess(data, variables, context) {
                                                                    utils.cart.cartMiniBox.invalidate()
                                                                },
                                                                onError(error, variables, context) {
                                                                    // console.log(error);
                                                                },
                                                            })

                                                        }} >
                                                            <HiOutlineTrash size={18} />
                                                        </ActionIcon>
                                                    </div>}

                                            </div>

                                        </div>



                                        {cart.preinstall !== "default" &&
                                            <div className=' py-4 border-b flex justify-between items-center'>
                                                <div>
                                                    <Text size={'xs'}>Pre-installed module</Text>
                                                    <Title order={5} fw={500} className=' text-gray-800 '>{Ucword(cart.preinstall)}</Title>
                                                </div>
                                                <div className='flex items-baseline'>

                                                    <ActionIcon loading={updateCartMutation.isLoading} onClick={() => {
                                                        updateCartMutation.mutate({ select: 'default' }, {
                                                            onSuccess(data, variables, context) {
                                                                utils.cart.cartMiniBox.invalidate()
                                                            },
                                                            onError(error, variables, context) {

                                                            },
                                                        })
                                                    }} >
                                                        <HiOutlineTrash size={18} />
                                                    </ActionIcon>
                                                </div>
                                            </div>}





                                        <div className='flex justify-between py-2 items-baseline'>
                                            <Title order={3} fw={500} className=' text-gray-800 '>Total</Title>
                                            <Text fw={600} size={25} className=' text-blue-800'><CurrencyFormat value={totalPrice} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} /></Text>
                                        </div>


                                    </div>
                                </>
                            ) : (
                                <div className=" flex justify-center py-14 flex-col  content-center text-center space-y-2 my-auto">
                                    <div className=" w-14 h-14  mx-auto overflow-hidden">
                                        <BsCart size={48} className=" fill-gray-300" />
                                    </div>
                                    <Text size={18} className=" text-gray-500">
                                        Your order summary is empty
                                    </Text>
                                </div>
                            )}
                        </div>

                        <div className="px-5 py-6">
                            <Button
                                onClick={(e) => {
                                    const { pageName } = props

                                    checkAuthMutation.mutate({ pageName }, {

                                        onSettled(data) {
                                            if (data?.isAuth) {
                                                if (!_.isEmpty(cart?.product) && pageName == "order/domain") {
                                                    router.push('/order/webcloud');
                                                }
                                                else {
                                                    router.push('/order/summary');
                                                }

                                            }
                                            else {
                                                router.push({
                                                    pathname: '/login',
                                                    query: { redirectTo: '/order/summary' },
                                                });

                                            }


                                        },
                                    })
                                }}
                                // component='a'
                                // href={!_.isEmpty(props?.session) ? "/order/webcloud" : "/order/summary"}
                                fullWidth
                                loading={checkAuthMutation.isLoading}
                                className=" bg-azure-radiance-500"
                                size="md"
                                radius={'xl'}
                            >
                                Continue Order
                            </Button>
                        </div>
                    </Box>
                </div>


            </Paper>
        </Box>
    )
}

export default CartPReview