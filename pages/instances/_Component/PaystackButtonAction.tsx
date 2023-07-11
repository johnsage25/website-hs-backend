import { Alert, Box, Button, Loader } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import React, { useState } from 'react'
import PaystackButton from 'react-paystack';
import { usePaystackPayment } from 'react-paystack';
import { trpc } from '../../../utils/trpc';
import { PaystackProps } from 'react-paystack/dist/types';
import { PaystackVerificationResponse } from '../../../Types/PaystackVerificationResponse';
import { useRouter } from 'next/router'
import _ from 'lodash';

const PaystackButtonAction = (props: any) => {

    const [loading, setloading] = useState(false)
    let customer = props?.session?.customer;
    const router = useRouter()
    const [config, setconfig] = useState<any>()

    const doPayment = trpc.nodepayment.payStack.useMutation({
        onSettled(data, error, variables, context) {
            setconfig(data)
        },
    });

    let con: PaystackProps = {
        ...props.paystack,
        email: customer[0].email,
        firstname: customer[0].firstname,
        lastname: customer[0].lastname,
    }


    const initializePayment = usePaystackPayment(con);
    // you can call this function anything
    const onSuccess = () => {
        doPayment.mutate({ reference: props?.paystack?.reference, cartId: props.query.id }, {
            onSuccess(data: any, variables, context) {

                let link: any = `/instances/payment/completed?token=${data.token.replace(/\s/g, '')}`
                window.location.href = link
            },
            onError(error, variables, context) {
                // console.log(error);
            },
        })

        setloading(false)
    };

    // you can call this function anything
    const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        // console.log('closed')
        setloading(false)
    }


    return (
        <div>

            <Alert icon={<IconAlertCircle size="1rem" />} >
                Please note that a transaction fee of 1.5% + NGN 100 (local) or 3.9% + NGN 100 (international) will be added to your purchase when paying with Paystack. This fee covers payment processing costs and is charged by Paystack, not HostSpacing.
            </Alert>

            {/* <Box hidden={!doPayment.isLoading} className={`flex w-full justify-center py-4`}>
                <Loader size="lg" />
            </Box> */}
            <Box className='flex justify-center w-full my-6'>
                <Button loading={doPayment.isLoading} radius={"xl"} size='md' className=' bg-azure-radiance-500 hover:bg-azure-radiance-600' onClick={() => {
                    setloading(true)
                    setTimeout(() => {
                        initializePayment(onSuccess, onClose)
                    }, 200);

                }}>Authorize on Paystack</Button>
            </Box>
        </div>
    )
}

export default PaystackButtonAction