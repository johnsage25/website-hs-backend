import { Alert, Badge, Box, Button, Group, Image, List, LoadingOverlay, ScrollArea, Text, UnstyledButton } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import CardPaymentIcon from '../../../Components/icons/CardPaymentIcon'
import { trpc } from '../../../utils/trpc'
import _ from 'lodash'
import { Ucword } from '../../../Components/TextFormatter'
import { IconAlertCircle, IconDots } from '@tabler/icons'
import { useInputState } from '@mantine/hooks'
import { AiFillLock } from 'react-icons/ai'
import { isMastercardExpired } from '../../../utils/helpers'
import { useRouter } from 'next/router'
import { errorMessages } from '../../../utils/errorMessages'
import collect from 'collect.js'

const SaveCards = (props: any) => {
    let SavedCards = trpc.payment.getSavedCards.useQuery()
    const paymentMutation = trpc.payment.stripePay.useMutation()
    let cardList: any = SavedCards.data || []
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errorAlert, seterrorAlert] = useState("")
    const [activeId, setActiveID] = useState("");
    const [errorCode, seterrorCode] = useState("")
    useEffect(() => {

        setActiveID(cardList?.defaultd)
    }, [cardList])

    const router = useRouter()
    let customer = props?.billingAddress



    return (
        <Box className='relative' >
            <LoadingOverlay visible={SavedCards.isLoading} overlayBlur={2} />
            {!_.isEmpty(cardList.data) ? <>

                {!_.isEmpty(errorCode) && <Alert className='mb-4' icon={<IconAlertCircle size="1rem" />} title={Ucword(errorCode?.replace(/_/g, " "))} color="red">
                    {errorAlert}
                </Alert>}

                <Box className="min-h-[100px]">
                    <ScrollArea.Autosize mah={250} offsetScrollbars>
                        <div className=' space-y-3 w-full'>
                            {cardList.data?.map((item: any, key: number) => {

                                return (
                                    <div onClick={() => {
                                        setActiveID(item.id)
                                    }} key={key} className={` ${_.isEqual(activeId, item.id) ? "  border-azure-radiance-500 border" : " border"} border cursor-pointer hover:bg-slate-50  w-full px-3 rounded-md py-2`}>
                                        <div className='justify-between items-center w-full flex'>
                                            <Group spacing={10} className='basis-1/2'>
                                                <Image src={`/svg/${item.card?.brand}.svg`} fit="contain" height={36} width={38} alt={item.card?.brand} />
                                                <Text fw={500} size={"md"}>{Ucword(item.card?.brand)}</Text>
                                                <IconDots />
                                                <Text size={"md"}>{item.card?.last4}</Text>
                                                {_.isEqual(cardList?.defaultd, item.id) && <Badge className=''>Default</Badge>}


                                            </Group>
                                            <Group>
                                                <Text color='dimmed'>{`${item.card?.exp_month}/${item.card?.exp_year}`}</Text>
                                            </Group>
                                            <Group>
                                                {!isMastercardExpired(item.card?.exp_year, item.card?.exp_month) ? (
                                                    <Badge variant="dot" className=' text-azure-radiance-500'>Active</Badge>
                                                ) : <><Badge variant="dot" color='red' className=' text-red-500'>Expired</Badge></>}

                                            </Group>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </ScrollArea.Autosize>

                </Box>

                <Group position='apart' className=' mt-6'>

                    <div className='flex gap-2'>
                        <AiFillLock size={25} color='green' />
                        <Text size={"md"}>Encrypted and Secure Payments</Text>
                    </div>

                    <Button onClick={() => {
                        paymentMutation.mutate({ paymentId: activeId, backupMethod: false }, {
                            onSettled(data: any, error, variables, context) {
                                const errorCollection = collect(errorMessages);

                                console.log(data.type);


                                if (_.isEqual(data.type, "StripeInvalidRequestError")) {
                                    seterrorCode("Invalid Request")
                                    seterrorAlert("We are unable to complete this transaction, please try again or contact support.")
                                    return;
                                }

                                if (_.isEqual(data?.done, true)) {
                                    let link: any = `/order/completed?token=${data?.code}`
                                    window.location.href = link
                                }
                                else {

                                    switch (data?.code) {
                                        case "succeeded":
                                            seterrorCode(data?.code)
                                            break;
                                        case "card_declined":
                                            if (data?.decline_code) {
                                                let errorText = errorCollection.firstWhere('code', data?.decline_code);
                                                seterrorCode(data?.code)
                                                seterrorAlert(errorText.message)
                                            }
                                            else {
                                                let errorText = errorCollection.firstWhere('code', data?.code);
                                                seterrorCode(data?.code)
                                                seterrorAlert(errorText.message)
                                            }

                                            break;

                                        default:
                                            let errorText = errorCollection.firstWhere('code', data?.code);
                                            seterrorCode(data?.code)
                                            seterrorAlert(errorText.message)
                                            break;
                                    }
                                }

                            },
                            onError(error, variables, context) {
                                console.log(error);

                                // // console.log(error.data);
                                // console.log(error);
                            },
                        })
                    }} type='submit' radius={"xl"} loading={paymentMutation.isLoading} className=' bg-azure-radiance-500 hover:bg-azure-radiance-600'>Submit Secure Payment</Button>

                </Group>

            </> : <>

                <section className="max-w-lg px-4 py-20 mx-auto space-y-1 text-center">

                    <CardPaymentIcon className="mx-auto h-14 w-14" />

                    <Text fw={600} size={20}>No card connected</Text>
                    <Text className="text-gray-500">
                        It appears that there are no cards saved on your account at the moment. In order to save a new card, please select the checkbox that reads &apos;Use as backup payment method for this account.&apos;
                    </Text>
                </section>
            </>}



        </Box>
    )
}

export default SaveCards