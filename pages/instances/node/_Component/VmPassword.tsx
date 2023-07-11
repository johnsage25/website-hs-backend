import { Alert, Button, Group, Input, InputBase, Modal, PasswordInput, TextInput, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React from 'react'
import { trpc } from '../../../../utils/trpc';
import { IconAlertCircle } from '@tabler/icons';
import { toast } from 'react-hot-toast';

const VmPassword = ({ vmDetails }: { vmDetails: any }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();
    const utils = trpc.useContext()
    const vmPasswordMutation = trpc.node.vmPassword.useMutation()
    const form = useForm({
        initialValues: {
            password: '',
        }
    });

    return (
        <>
            <Button onClick={open} radius={"xl"} color='red' className=' bg-red-500 hover:bg-red-600'>
                Password Reset
            </Button>

            <Modal.Root closeOnClickOutside={false} size={"md"} opened={opened} onClose={close}>
                <Modal.Overlay opacity={0.55} blur={3} color={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]} />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Password Reset</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>

                        <form onSubmit={form.onSubmit((values) => {
                            vmPasswordMutation.mutate({ password: values.password, orderId: vmDetails._id }, {
                                onSuccess(data, variables, context) {

                                    close()
                                    utils.node.vmDetail.invalidate()
                                    form.reset()
                                    toast.success("Password successfully updated.")
                                },
                                onError(error, variables, context) {
                                    console.log(error);

                                    toast.error("Unable to update password.")
                                },
                            })
                        })} className='space-y-3 mt-3'>
                            <Alert icon={<IconAlertCircle size="1rem" />}>
                                A reboot is required to apply a password reset for this virtual machine (VM).
                            </Alert>
                            <div>

                                <TextInput disabled value={"root"} label="User" />
                                <PasswordInput {...form.getInputProps('password')} label="Password" />

                            </div>

                            <Group position='right' className='mt-4'>
                                <Button loading={vmPasswordMutation.isLoading} type='submit' radius={"xl"} className=' bg-azure-radiance-500'>Submit</Button>
                            </Group>

                        </form>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        </>
    )
}

export default VmPassword