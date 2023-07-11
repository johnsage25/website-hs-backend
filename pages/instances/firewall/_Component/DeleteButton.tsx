import React from 'react'
import { trpc } from '../../../../utils/trpc'
import { ActionIcon } from '@mantine/core'
import { toast } from 'react-hot-toast'
import { IconTrash } from '@tabler/icons'

const DeleteButton = ({ vmdetails, props }: { vmdetails: any, props: any }) => {

    let deleteFirewallRule = trpc.node.deleteFirewallRule.useMutation()
    const utils = trpc.useContext()

    return (
        <div>
            <ActionIcon loading={deleteFirewallRule.isLoading} color="red" onClick={() => {
                deleteFirewallRule.mutate({ ...props, orderId: vmdetails._id }, {
                    onSuccess(data, variables, context) {
                        toast.success("Rule deleted successfully.")
                        utils.node.firewareRules.invalidate()
                    },
                    onError(error, variables, context) {
                        toast.error("Unable to delete rule")
                    },
                })


            }}>
                <IconTrash size={16} />
            </ActionIcon>
        </div>
    )
}

export default DeleteButton