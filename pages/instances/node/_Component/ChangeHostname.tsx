import { Alert, Button, Group, Modal, TextInput, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons';
import React from 'react'
import { trpc } from '../../../../utils/trpc';
import { toast } from 'react-hot-toast';


const ChangeHostname = ({ vmDetails }: { vmDetails: any }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();
    const changeHostnameMutation = trpc.node.changeHostname.useMutation()

    const form = useForm({
        initialValues: {
            host: vmDetails.hostname,
        },

    });

    return (
        <>
            <Button onClick={open} radius={"xl"} variant='default'>
                Change Hostname
            </Button>


            <Modal.Root closeOnClickOutside={false} opened={opened} onClose={close}>
                <Modal.Overlay opacity={0.55} blur={3} color={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]} />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Change Hostname for IP address {vmDetails.publicIp}</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={form.onSubmit((values) => {
                            changeHostnameMutation.mutate({ host: values.host, orderId: vmDetails._id }, {
                                onSuccess(data, variables, context) {
                                    toast.success("Hostname updated successfully.")
                                },
                                onError(error, variables, context) {
                                    toast.error("Unable to update hostname")
                                },
                            })

                        })}>

                            <TextInput
                                withAsterisk
                                label="Hostname"
                                placeholder=""
                                {...form.getInputProps('host')}
                            />


                            <Group position="right" mt="md">
                                <Button loading={changeHostnameMutation.isLoading} className=' bg-azure-radiance-500 hover:bg-azure-radiance-600' radius={"xl"} type="submit">Submit</Button>
                            </Group>
                        </form>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        </>
    )
}

export default ChangeHostname