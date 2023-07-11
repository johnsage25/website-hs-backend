import { Alert, Box, Text } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons'
import React from 'react'

type Props = {}

const PaypalBlock = (props: Props) => {
    return (
        <Box className="px-5 space-y-5 py-6">
            <Text className=' text-gray-500'>We will add PayPal as a recurring payment method to your account for future use after you sign in by clicking the button below.</Text>
            <Alert icon={<IconAlertCircle size="1rem" />} title="Note" variant="outline">
            To add PayPal as a saved payment option, you must first make a $5.00 transaction to validate your account. This payment will be added to your first bill and is only required once.
            </Alert>
        </Box>
    )
}

export default PaypalBlock