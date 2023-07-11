import { ActionIcon, Anchor, Box, Button, CloseButton, Drawer, Group, Text, TextInput, Textarea, Title, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react'
import React, { useState } from 'react'
import { trpc } from '../../utils/trpc';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { SSHInferface } from '../../Types/SSHInferface';

const EditSSHBlock = (item: any) => {
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme()

    const sshMutation = trpc.profile.updateSSH.useMutation()

    const utils = trpc.useContext();

    const schema = Yup.object().shape({
        label: Yup.string().max(100, "Must not be above 100 letters.").required("Label cannot be blank."),
        key: Yup.string().required('Public key cannot be blank.'),
    });

    const form = useForm({
        initialValues: {
            label: '',
            key: '',
        },
        validate: yupResolver(schema),
    })

    return (
        <div>
            <ActionIcon onClick={() => {
                open()

                form.setValues({
                    ...item.record,
                })
            }}>
                <IconEdit size={16} />
            </ActionIcon>

            <Drawer
                opened={opened}
                onClose={close}
                overlayProps={{
                    color: theme.colorScheme === 'dark'
                        ? theme.colors.dark[9]
                        : theme.colors.gray[2],
                    opacity: 0.55,
                    blur: 3
                }}

                closeOnClickOutside={false}
                position="right"
                size={"lg"}
                withCloseButton={false}

            >
                <Box className="px-8 py-6 space-y-5">
                    <div className="flex justify-between items-center">
                        <Title order={4} className="text-gray-700">
                            Edit SSH Key
                        </Title>

                        <CloseButton
                            onClick={() => {
                                close()
                            }}
                            title="Close"
                            size="xl"
                            radius={'xl'}
                            iconSize={25}
                        />
                    </div>
                    <div>
                        <form
                            onSubmit={form.onSubmit((values) => {
                                let d: SSHInferface = {
                                    ...values
                                }
                                sshMutation.mutate(d, {
                                    onSuccess(data, variables, context) {
                                        close()
                                        utils.profile.sshlist.prefetch()
                                        form.reset();
                                    },
                                    onError(error, variables, context) {

                                    },
                                })

                            })}
                            className="space-y-4"
                        >
                            <TextInput label="Label" {...form.getInputProps('label')} />

                            <Textarea
                                minRows={10}
                                label="SSH Public Key"
                                {...form.getInputProps('key')}
                            />

                            <Group position="right" mt="md">
                                <Anchor
                                    onClick={() => {
                                        close()
                                    }}
                                >
                                    <Text fw={600}>Cancel</Text>
                                </Anchor>
                                <Button loading={sshMutation.isLoading} type="submit" radius={'xl'} className="bg-lochmara-400">
                                    Edit SSH Key
                                </Button>
                            </Group>
                        </form>
                    </div>
                </Box>
            </Drawer>

        </div>
    )
}

export default EditSSHBlock