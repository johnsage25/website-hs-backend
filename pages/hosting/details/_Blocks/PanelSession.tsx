import { Box, Button, Group } from '@mantine/core'
import React from 'react'
import { trpc } from '../../../../utils/trpc'
import _ from 'lodash'
import { toast } from 'react-hot-toast'

const PanelSession = (order: any) => {
    const createSessionMutation = trpc.hostingpanel.createSession.useMutation()
    const emailSessionMutation = trpc.hostingpanel.emailSession.useMutation()
    return (
        <Box>
            <Group position='center'>
                <Button variant='outline' loading={createSessionMutation.isLoading} radius={"xl"} onClick={() => {
                    createSessionMutation.mutate({ orderId: order.id, type: "user" }, {
                        onSuccess(data: any, variables, context) {
                            if (_.isEqual(data.status, true)) {
                                window.open(data.url, "_blank")
                            }
                            else {
                                toast.error("Unable to login at this time. Try again.")
                            }
                        },
                        onError(error, variables, context) {
                            toast.error("Unknown error, please contact support.")
                            // console.log(error);
                        },
                    })

                }}>Panel Login</Button>
                <Button loading={emailSessionMutation.isLoading} variant='outline' onClick={() => {
                    emailSessionMutation.mutate({ orderId: order.id }, {
                        onSuccess(data:any, variables, context) {
                            if (_.isEqual(data.status, true)) {
                                window.open(data.url, "_blank")
                            }
                            else {
                                toast.error("Unable to login at this time. Try again.")
                            }
                        },
                        onError(error, variables, context) {
                            toast.error("Unknown error, please contact support.")
                        },
                    })
                }} radius={"xl"}>Webmail Login</Button>

                <Button variant='outline' radius={"xl"}>Renew Now</Button>
            </Group>
        </Box>
    )
}

export default PanelSession