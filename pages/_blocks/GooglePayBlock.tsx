import { Box, Text } from '@mantine/core'
import React from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

type Props = {}

const GooglePayBlock = (props: Props) => {
    return (
        <Box className="px-5 space-y-5 py-6">
            <Text className=' text-gray-500'>
                When you click GPay, select a payment option and then authorize the $0 authorization charge to authenticate your card for usage on HostSpacing.
            </Text>
        </Box>
    )
}

export default GooglePayBlock