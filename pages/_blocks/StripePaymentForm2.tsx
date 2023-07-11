import React, { useEffect, useMemo, useState } from 'react'
import {
    ActionIcon,
    Alert,
    Anchor,
    Badge,
    Box,
    Button,
    Checkbox,
    CloseButton,
    Drawer,
    Group,
    Image,
    Input,
    Menu,
    NativeSelect,
    Notification,
    Paper,
    ScrollArea,
    SimpleGrid,
    Text,
    TextInput,
    ThemeIcon,
    Title,
    UnstyledButton,
    useMantineTheme,
} from '@mantine/core'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js'
import { trpc } from '../../utils/trpc';
import { useForm, yupResolver } from '@mantine/form'
import * as Yup from 'yup'
import { Country, State } from 'country-state-city'
import countryList from 'react-select-country-list'
import _ from 'lodash'
import { BillingType } from '../../Types/CustomerType';
import { IconAlertCircle } from '@tabler/icons-react';
import { VerifyCardBillingInterface } from '../../Types/VerifyCardBillingInterface';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons';
import { toast } from 'react-hot-toast';
import { useRouter, withRouter } from 'next/router';

const StripePaymentForm2 = (props: any) => {

    const [drawEdit, setDrawEdit] = useState(false)
    const theme = useMantineTheme()
    const ContactMutation = trpc.billing.billingAddress.useQuery<any>({ text: "" })
    const updateContact = trpc.billing.updateBilling.useMutation<never[]>()
    const utils = trpc.useContext()
    const router = useRouter()
    const [errorAlert, seterrorAlert] = useState("")
    const [activeId, setActiveID] = useState("");
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorCode, seterrorCode] = useState("")
    const [paymentDrawer, setPaymentDrawer] = useState(false)
    const verifyCardMutation = trpc.welcome.verifyCard.useMutation()

    let billingaddress = props?.customer[0]?.BillingAddress
    let customer = props?.customer[0];

    useEffect(() => {
        utils.billing.billingAddress.invalidate()
    }, [])

    const { isLoading, data, isSuccess } = ContactMutation

    const schema = Yup.object().shape({
        cardname: Yup.string().required('Card Name is required'),
        postalcode: Yup.string().required('Postal Code is required'),
        address: Yup.string().required('Address is required'),
        country: Yup.string().required('Country is required'),
        city: Yup.string().required('City is required'),
        tos: Yup.boolean().oneOf([true], 'You must accept the payment agreement')
    })

    const billingForm = useForm({
        validate: yupResolver(schema),
        initialValues: {
            cardname: `${customer.firstname} ${customer.lastname}`,
            tos: false,
            ...customer.BillingAddress[0]
        },
    })

    // // console.log(customer);


    useEffect(() => {

        let states = State.getStatesOfCountry(
            customer.BillingAddress[0].country,
        ).map((item) => {
            return {
                label: item.name,
                value: item.name,
            }
        })
        setstateList(states)

    }, [])


    const [stateList, setstateList] = useState<any[]>([{ value: '', label: '-' }])
    const options = useMemo(() => countryList()?.getData(), [])

    const details: BillingType | any = data


    const stripe: Stripe | null = useStripe();
    const elements = useElements();




    const handleCardChange = (event: any) => {
        if (event.error) {
            setErrorMessage(event.error.message);
        } else {
            setErrorMessage('');
        }
    };


    return (
        <div>
            <Box className="px-5 py-4 space-y-5">

                <div className=" space-y-4">
                    <Text size={16} fw={600} className="text-gray-700">
                        Credit Card
                    </Text>
                    <div>
                        <form onSubmit={billingForm.onSubmit(async (values) => {

                            setErrorMessage('');

                            setLoading(true);
                            if (!stripe || !elements) {
                                return;
                            }
                            setTimeout(() => {
                                setLoading(false);
                            }, 400);

                            const card: any = elements.getElement(CardElement);

                            const { error, paymentMethod } = await stripe.createPaymentMethod({
                                type: 'card',
                                card: elements.getElement(CardElement)!,
                                billing_details: {
                                    email: customer?.email,
                                    phone: customer?.mobile,
                                    address: {
                                        city: billingaddress?.city,
                                        country: billingaddress?.country,
                                        line1: billingaddress?.address,
                                        state: billingaddress?.state,
                                    }
                                },
                            });


                            let _d: VerifyCardBillingInterface = {
                                paymentId: `${paymentMethod?.id}`,
                                ...values
                            }

                            if (_.isEmpty(paymentMethod?.id)) {
                                return;
                            }

                            verifyCardMutation.mutate(_d, {
                                onSuccess(data, variables, context) {
                                    // console.log(data);
                                    router.push("/")
                                    toast.success("Account identity verified.")
                                },
                                onError(error, variables, context) {

                                    toast.error(error.message)
                                },
                            })

                            if (error) {
                                setErrorMessage(error.message ?? 'Something went wrong. Please try again.');
                                setLoading(false);
                                return;
                            }


                        })} className="space-y-4">

                            <Alert variant="light" icon={<IconAlertCircle size="1rem" />}>
                                Rest assured, we won&apos;t charge your card. To verify your payment information, you may see a temporary pre-authorization charge, but don&apos;t worry - this will be reversed within a week.
                            </Alert>

                            <TextInput
                                size='md'
                                placeholder="Cardholder name"
                                // label="Name on card"
                                {...billingForm.getInputProps('cardname')}
                                withAsterisk
                            />
                            <Input.Wrapper
                                id="input-demo"
                                withAsterisk
                                size="md"
                            // error={errorMessage && errorMessage}
                            >
                                <CardElement className="card-element"
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#32325d',
                                                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                },
                                            },
                                            invalid: {
                                                color: '#fa755a',
                                                iconColor: '#fa755a',
                                            },
                                        },
                                    }} onChange={handleCardChange} />
                            </Input.Wrapper>



                            <TextInput
                                label="Address"
                                className="w-full"
                                size='md'
                                placeholder="Enter address"
                                {...billingForm.getInputProps('address')}
                            />


                            <NativeSelect
                                data={[{ value: '', label: 'Select Country' }, ...options]}
                                label="Country"
                                size='md'
                                {...billingForm.getInputProps('country')}
                                onChange={(event) => {
                                    if (event.currentTarget.value.length < 1) {
                                        setstateList([{ value: '', label: '-' }])
                                        return
                                    }

                                    let states = State.getStatesOfCountry(
                                        event.currentTarget.value,
                                    ).map((item) => {
                                        return {
                                            label: item.name,
                                            value: item.name,
                                        }
                                    })

                                    if (billingForm.getInputProps(`country`).onChange) {
                                        billingForm.getInputProps(`country`).onChange(event)
                                    }

                                    if (states.length === 0) {
                                        setstateList([{ value: '', label: '-' }])
                                        return
                                    } else {
                                        billingForm.setFieldValue('state', states[0].value)
                                    }

                                    setstateList(states)
                                }}
                                placeholder="Select Country"
                            />

                            <TextInput
                                label="City"
                                className="w-full"
                                size='md'
                                placeholder="Enter city"
                                {...billingForm.getInputProps('city')}
                            />

                            <SimpleGrid cols={2}>
                                <NativeSelect
                                    data={stateList}
                                    size='md'
                                    {...billingForm.getInputProps('state')}
                                    label="State/Province/Region"
                                />
                                <TextInput
                                    label="Postal Code"
                                    size='md'
                                    className="w-full"
                                    placeholder="Enter postal code"
                                    {...billingForm.getInputProps('postalcode')}
                                />
                            </SimpleGrid>



                            <Checkbox
                                {...billingForm.getInputProps('tos')}
                                size='md'
                                label="I agree to allow HostSpacing to debit a sum of $1.00"
                            />

                            {errorMessage && <Input.Error size='md'>{errorMessage}</Input.Error>}
                            <div className='flex justify-end gap-4'>
                                <Button href='/account/settings' component='a' radius={"xl"} variant="subtle">Disable AutoRenewal</Button>
                                <Button loading={loading || verifyCardMutation.isLoading} type='submit' radius={"xl"} className=' bg-lochmara-400' >Save payment method</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Box>
        </div>
    )
}

export default StripePaymentForm2