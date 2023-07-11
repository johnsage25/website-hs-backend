import { ActionIcon, Anchor, Box, Button, Card, CardSection, Divider, Group, Image, Text, Title, UnstyledButton } from '@mantine/core'
import React from 'react'
import CurrencyFormat from 'react-currency-format'
import { trpc } from '../../../utils/trpc'
import collect from 'collect.js'
import { BsPaypal, BsShieldCheck } from 'react-icons/bs'
import PaypalIcon from '../../../Components/icons/PaypalIcon'
import PaypalIcon2 from '../../../Components/icons/PaypalIcon2'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import DisplamerModal from './DisplamerModal'
import { getPercentageAmount } from '../../../utils/helpers'



const MiniBoxCardSummary = (props: any) => {
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


    let subTotalPrice = totalRegisterPrice + (productTotalPrice || 0) || 0

    let totalPrice = (subTotalPrice + 0.99) || 0;


    let totalItems = (cart?.ssl.length + cart?.product.length + cart?.domainSelected.length) || 0



    return (
        <Box className="w-1/3 relative">
            <Card className='border border-zinc-200' radius="sm">
                <Card.Section className='p-4 border-b'>
                    <Text fw={600}>Order Summary</Text>
                </Card.Section>



                <Card.Section className='p-4 px-6 border-b space-y-2 flex flex-col'>
                    <Group position="apart" mt="md" mb="xs">
                        <Text size={15}>Items</Text>
                        <Text size={16} fw={600} className=' text-gray-800'>{totalItems}</Text>
                    </Group>
                    <Group position="apart" mt="md" mb="xs">
                        <Text size={15}>Subtotal</Text>
                        <Text size={16} fw={600} className=' text-gray-800'><CurrencyFormat value={subTotalPrice} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} /></Text>
                    </Group>
                    <Group position="apart" mt="md" mb="xs">
                        <div className=' flex space-x-1 items-center'>
                            <Text size={15}>VAT and Fees</Text>
                            <DisplamerModal />
                        </div>
                        <Text size={16} fw={600} className=' text-gray-800'><CurrencyFormat value={0.99} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} /></Text>
                    </Group>

                    <UnstyledButton component='a' className='mb-2'>
                        <Text size={15}>Have a coupon code?</Text>
                    </UnstyledButton>



                </Card.Section>

                <CardSection className='px-6 py-6  border-b'>
                    <div className='flex justify-between py-2 items-baseline'>
                        <Title order={3} fw={500} className=' text-arapawa-600 '>Total</Title>
                        <Text fw={600} size={25} className=' text-blue-800'><CurrencyFormat value={totalPrice} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} /></Text>
                    </div>
                </CardSection>


            </Card>
            <div className='p-2 px-10 flex justify-center'>
                <div className='text-center text-zinc-500'>
                    <span>
                        <Image src={'../svg/processout.svg'} height={50} fit="contain" alt='process' />
                    </span>
                </div>
            </div>
        </Box>
    )
}

export default MiniBoxCardSummary