import { Alert, Box, Button, Group, Text, Title } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons'
import React from 'react'
import { trpc } from '../../../../utils/trpc'
import _ from 'lodash'
import { openConfirmModal } from '@mantine/modals'
import { toast } from 'react-hot-toast'


const TransferBlock = (order: any) => {

    const domainTransferMutation = trpc.domainManager.domainTransfer.useMutation()

    return (
        <Box className='px-6'>
            <Group position='apart' className='border-b pb-4'>
                <Title order={3} className=' font-light'>Transfer</Title>
            </Group>

            <Box className='mt-6 mb-10 space-y-4'>

                <Alert variant='filled' icon={<IconAlertCircle size={30} />} >
                    If you want to transfer your domain name to a different company, you can click on the button below to send your transfer code to your saved contact information. Please also read the following description and instructions.
                </Alert>
                <div className='py-4' >
                    <Text fw={600} size={16}>Before transferring, be sure to:</Text>
                    <Text>You will not be able to transfer your domain name within 60 days after purchase or renewal.
                        Since the domain name transfer takes 7 days, we recommend that you initiate the transaction in the last 15 days before the registration period.
                        Transfer requests for your domain are sent to the email address in your whois information.
                        Before transferring, you must deactivate the transfer lock and whois protection.
                        After the transfer process is initiated, you cannot perform operations such as DNS update, whois update. Therefore, we recommend that you make the necessary updates before starting the process.</Text>
                </div>

            </Box>
            <Box className=' border-t py-2'>
                <Group position="right" mt="md">
                    <Button loading={domainTransferMutation.isLoading} onClick={() => {

                        if (_.isEqual(order?.domainTransferLock, true)) {
                            toast.error("First, please deactivate the transfer lock from the Whois Management tab.")
                        }
                        else {
                            domainTransferMutation.mutate({ orderId: order._id }, {
                                onSettled(data, error, variables, context) {
                                    // console.log(data);
                                },
                                onError(error, variables, context) {
                                    // console.log(error);
                                },
                            })
                        }

                    }} type="submit" radius={"xl"} className=' bg-lochmara-400 hover:bg-lochmara-500'>Get Transfer Code</Button>
                </Group>

            </Box>
        </Box>

    )
}

export default TransferBlock