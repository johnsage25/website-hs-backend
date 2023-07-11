import { Box, Button, Card, Divider, Group, Image, Text, UnstyledButton } from '@mantine/core'
import React from 'react'
import CurrencyFormat from 'react-currency-format'
import { trpc } from '../../../utils/trpc'
import collect from 'collect.js'
import { BsPaypal, BsShieldCheck } from 'react-icons/bs'
import PaypalIcon from '../../../Components/icons/PaypalIcon'
import PaypalIcon2 from '../../../Components/icons/PaypalIcon2'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { getPercentageAmount } from '../../../utils/helpers'



const SummaryPayment = (props: any) => {
    const router = useRouter()
    const cartMiniBoxQuery = trpc.cart.cartMiniBox.useQuery({}, { keepPreviousData: true })
    const updateCartMutation = trpc.cart.updateApp.useMutation()
    const deleteProductMutation = trpc.cart.deleteProduct.useMutation()
    const checkAuthMutation = trpc.cart.checkAuth.useMutation()
    const utils = trpc.useContext()
    let cart: any = cartMiniBoxQuery?.data


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


    let totalPrice = totalRegisterPrice + (productTotalPrice || 0) || 0


    return (
        <Box className="w-1/3 relative">
            <Card className='border border-gray-200' radius="sm">
                <Card.Section className='p-4 border-b'>
                    <Text fw={600}>Order Summary</Text>
                </Card.Section>



                <Card.Section className='p-4 px-6 border-b'>
                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={600} size={20}>Subtotal</Text>
                        <Text size={20} fw={500} className=' text-gray-800'><CurrencyFormat value={totalPrice} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} /></Text>
                    </Group>
                </Card.Section>

                <Card.Section className='p-4 px-6'>
                    <UnstyledButton component='a' className='text-center underline'>
                        <Text>Have a coupon code?</Text>
                    </UnstyledButton>
                </Card.Section>
                <Text size="sm" color="dimmed">
                    Final sales tax will be calculated when you enter a shipping address.
                </Text>

                <Card.Section className='p-6'>
                    <Button
                        onClick={(e) => {
                            const { pageName } = props

                            checkAuthMutation.mutate({ pageName }, {

                                onSettled(data) {
                                    router.push('/order/payment');
                                },
                            })
                        }}
                        loading={checkAuthMutation.isLoading}
                        size='md' className=' bg-azure-radiance-500 hover:bg-azure-radiance-600' fullWidth mt="md" radius="xl">
                        Continue to Cart
                    </Button>
                </Card.Section>

            </Card>
            <div className='p-2 px-10 flex justify-center'>
                <div className='text-center text-zinc-500'>
                    <span>
                        <div className='flex space-x-4 justify-items-center items-center'>
                            <BsShieldCheck size={60} />
                            <Text>We secure your transaction with SSL encryption to protect your data.</Text>
                        </div>
                    </span>
                </div>
            </div>
        </Box>
    )
}

export default SummaryPayment