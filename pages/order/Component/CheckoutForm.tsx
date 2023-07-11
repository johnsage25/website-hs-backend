import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Alert, Button, Checkbox, Group, Input, Text, TextInput } from '@mantine/core';
import { AiFillLock } from 'react-icons/ai';
import { useForm } from '@mantine/form';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { trpc } from '../../../utils/trpc';
import _ from 'lodash';
import { IconAlertCircle } from '@tabler/icons';
import { errorMessages } from '../../../utils/errorMessages';
import collect from 'collect.js';
import { Ucword } from '../../../Components/TextFormatter';
import { useRouter } from 'next/router';

const CheckoutForm = (props: any) => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errorAlert, seterrorAlert] = useState("")
    const [loading, setLoading] = useState<boolean>(false);
    const paymentMutation = trpc.payment.stripePay.useMutation()
    const [errorCode, seterrorCode] = useState("")

    const router = useRouter()
    let address = props?.billingAddress
    let customer = props?.auth

    const form = useForm({
        initialValues: {
            cardname: `${customer?.firstname} ${customer?.lastname}`,
            backupMethod:false,
        },
    })

    const stripe: Stripe | null = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        setLoading(true);
        setErrorMessage('');

        if (!stripe || !elements) {
            setLoading(false);
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)!,
            billing_details: {
                name: `${customer?.firstname} ${customer?.lastname}`,
                email: props.auth?.email,
                phone: props.auth?.mobile,
                address: {
                    city: address?.city,
                    country: address?.country,
                    line1: address?.address,
                    state: address?.state,
                }
            },
        });

        if (error) {
            setErrorMessage(error.message ?? 'Something went wrong. Please try again.');
            setLoading(false);
            return;
        }

        paymentMutation.mutate({ paymentId: paymentMethod.id, backupMethod:form?.values?.backupMethod}, {
            onSettled(data: any, error, variables, context) {
                const errorCollection = collect(errorMessages);

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




                setLoading(false);
            },
            onError(error, variables, context) {
                // // console.log(error.data);
                // console.log(error);
            },
        })


    };

    const handleCardChange = (event: any) => {
        if (event.error) {
            setErrorMessage(event.error.message);
        } else {
            setErrorMessage('');
        }
    };




    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-6">

            {!_.isEmpty(errorCode) && <Alert icon={<IconAlertCircle size="1rem" />} title={Ucword(errorCode?.replace(/_/g, " "))} color="red">
                {errorAlert}
            </Alert>}


            <TextInput
                placeholder=""
                label="Name on card"
                className='mb-4'
                size='md'
                {...form.getInputProps('cardname')}
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

            {errorMessage && <Input.Error size='md'>{errorMessage}</Input.Error>}

            <Checkbox
                size='md'
                {...form.getInputProps('backupMethod', { type: 'checkbox' })}
                label="Use as backup payment method for this account"
            />



            <Group position='apart'>

                <div className='flex gap-2'>
                    <AiFillLock size={25} color='green' />
                    <Text size={"md"}>Encrypted and Secure Payments</Text>
                </div>

                <Button type='submit' loading={paymentMutation.isLoading || loading} radius={"xl"} className=' bg-azure-radiance-500 hover:bg-azure-radiance-600'>Submit Secure Payment</Button>

            </Group>



        </form>
    );
};


export default CheckoutForm