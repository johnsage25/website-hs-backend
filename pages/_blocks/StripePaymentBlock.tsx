import React, { useState } from 'react'
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
  Paper,
  ScrollArea,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js'
import { useForm } from '@mantine/form';
import { trpc } from '../../utils/trpc';


const StripePaymentBlock = (props: any) => {

  const [errorAlert, seterrorAlert] = useState("")
  const [activeId, setActiveID] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorCode, seterrorCode] = useState("")
  const [paymentDrawer, setPaymentDrawer] = useState(false)
  const addCardWithStripeMutation = trpc.account.addCardWithStripe.useMutation()

  let billingaddress = props?.customer[0].BillingAddress
  let customer = props?.customer[0];

  const form = useForm({
    initialValues: {
      cardname: '',
      tos: false,
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

    if (error) {
      setErrorMessage(error.message ?? 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    addCardWithStripeMutation.mutate({ paymentId: paymentMethod.id, tos: form.values.tos }, {
      onSuccess(data, variables, context) {
        // console.log(data);

        setLoading(false);
      },
      onError(error, variables, context) {
        // console.log(error);

        setLoading(false);
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
    <div>
      <Box className="px-5 space-y-5">
        <div className="space-y-4 py-4 border-gray-100">
          <Text className=' text-gray-500'>We accept Visa, Mastercard, American Express, UnionPay, and Discover credit cards.</Text>
          <Text className=' text-gray-500'>Your card may have a temporary authorisation hold, which your bank should release soon. You will not be charged by HostSpacing until you begin using paid services.</Text>
        </div>
        <div className=" space-y-4">
          <Text size={16} fw={600} className="text-gray-700">
            Credit Card
          </Text>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                size='md'
                placeholder="Cardholder name"
                // label="Name on card"
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

              <Checkbox
                {...form.getInputProps('tos')}
                label="I agree to allow HostSpacing to debit a sum of $0.00"
              />

              {errorMessage && <Input.Error size='md'>{errorMessage}</Input.Error>}
              <div className='flex justify-end'>
                <Button loading={loading} type='submit' radius={"xl"} className=' bg-lochmara-400' >Add Credit Card</Button>
              </div>
            </form>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default StripePaymentBlock