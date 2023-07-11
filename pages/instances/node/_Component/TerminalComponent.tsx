import React, { useEffect, useRef } from 'react'
import { trpc } from '../../../../utils/trpc'
import { ActionIcon, Box, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { BsTerminal } from 'react-icons/bs'

// import { AttachAddon } from 'xterm-addon-attach';

const TerminalComponent = ({ vmDetails, hosturl }: { vmDetails: any, hosturl: any }) => {
    const terminalMutation = trpc.node.terminal.useMutation()
    const [opened, { open, close }] = useDisclosure(false);
    const inputRef = useRef()
    // const socket = new WebSocket('wss://docker.example.com/containers/mycontainerid/attach/ws');
    // const attachAddon = new AttachAddon(socket);

    useEffect(() => {



    }, [])


    return (
        <div>
            <ActionIcon disabled loading={terminalMutation.isLoading} onClick={() => {
                terminalMutation.mutate({ orderId: vmDetails._id }, {
                    onSuccess(data, variables, context) {
                        console.log(data);
                        // window.open(`${hosturl}/console/${vmDetails._id}`, "", "toolbar=0")
                        open()
                    },
                    onError(error, variables, context) {
                        console.log(error);

                    },
                })
            }} >
                <BsTerminal color='#000' size={20} />
            </ActionIcon>
            <Modal.Root opened={opened} size={"xl"} onClose={close}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Modal title</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Box >
                            {/* <XTerm ref={inputRef}

                                style={{
                                    overflow: 'hidden',
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%'
                                }} /> */}
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>

        </div>
    )
}

export default TerminalComponent