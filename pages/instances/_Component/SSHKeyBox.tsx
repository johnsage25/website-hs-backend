import { ActionIcon, Anchor, Box, Button, Drawer, Group, Modal, Text, TextInput, Textarea, Tooltip, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DataTable } from 'mantine-datatable';
import React from 'react'
import { VscKey } from 'react-icons/vsc';
import { trpc } from '../../../utils/trpc';
import { AiOutlinePlus, AiOutlinePlusCircle } from 'react-icons/ai';
import { truncate } from 'lodash';
import dateFormat, { masks } from 'dateformat'
import { useForm, yupResolver } from '@mantine/form'
import * as Yup from 'yup';
import { IconChevronLeft } from '@tabler/icons';
import { toast } from 'react-hot-toast';

const SSHKeyInput = ({ onChange, label, value }: { onChange: (item) => void, value: string, label:string }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();
    const sshListQuery: any = trpc.profile.sshlist.useQuery()
    const [_op, handlers] = useDisclosure(false);

    const sshMutation = trpc.profile.addSSH.useMutation()

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
            <Button onClick={open} variant='default' mt={10} radius={"xl"} size='sm'>{label}</Button>

            <Modal.Root closeOnClickOutside={false} size={"lg"} opened={opened} onClose={() => {
                close()
                setTimeout(() => {
                    handlers.close();
                }, 1000);
            }}>
                <Modal.Overlay opacity={0.55} blur={3} color={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]} />
                <Modal.Content>
                    <Modal.Header className=' h-14'>
                        {!_op ?
                            <Group position='apart' className=' w-full pr-4'>
                                <Modal.Title>SSH keys</Modal.Title>
                                <Button onClick={() => {
                                    handlers.open();
                                }} radius={"xl"} size='xs' variant='default'>New Key</Button>
                            </Group> :
                            <Group className=' w-full pr-4'>
                                <ActionIcon onClick={() => {
                                    handlers.close();
                                }}
                                >
                                    <IconChevronLeft size={23} />
                                </ActionIcon>
                                <Modal.Title> Add SSH Key</Modal.Title>

                            </Group>}

                        <Modal.CloseButton size={20} />
                    </Modal.Header>
                    <Modal.Body>
                        {_op ? <>

                            <form
                                onSubmit={form.onSubmit((values) => {
                                    sshMutation.mutate({ ...values }, {
                                        onSuccess(data, variables, context) {
                                            utils.profile.sshlist.invalidate()
                                            form.reset();
                                            handlers.close();
                                            toast.success("New key added to list")
                                        },
                                        onError(error, variables, context) {
                                            toast.error("Error: Unable to add key")
                                        },
                                    })

                                })}
                                className="space-y-4"
                            >
                                <Box className="px-4 py-6 space-y-4">

                                    <TextInput label="Label" {...form.getInputProps('label')} />

                                    <Textarea
                                        minRows={10}
                                        label="SSH Public Key"
                                        {...form.getInputProps('key')}
                                    />

                                </Box>
                                <Group position="right" className='border-t pt-4'>

                                    <Button loading={sshMutation.isLoading} type="submit" radius={'xl'} className="bg-lochmara-400">
                                        Submit
                                    </Button>
                                </Group>

                            </form>
                        </> : <>

                            <Box className='min-h-[200px]' sx={{ height: 300 }}>
                                <DataTable
                                    minHeight={200}
                                    columns={[{
                                        accessor: 'label', title: "Label", render(record, index) {
                                            return (
                                                <>
                                                    <Text className=" text-gray-600">
                                                        {truncate(record.label, {
                                                            length: 18,
                                                            omission: '...',
                                                        })}
                                                    </Text>
                                                </>
                                            )
                                        },
                                    }, {
                                        accessor: 'key', render(record: any, index) {
                                            return (
                                                <>
                                                    <Text className=" text-gray-600">
                                                        {truncate(record.key, {
                                                            length: 38,
                                                            omission: '',
                                                        })}
                                                    </Text>
                                                </>
                                            )
                                        },
                                    }, {
                                        accessor: 'action', title: "", width: 20, render: (record: any) => {

                                            return (
                                                <Group spacing={4} position="right" noWrap>
                                                    <Tooltip label="Add key to Node" withArrow>
                                                        <ActionIcon onClick={() => {
                                                            onChange(record)
                                                            close()
                                                        }} variant='default' radius={"xl"}>
                                                            <AiOutlinePlus />
                                                        </ActionIcon>
                                                    </Tooltip>

                                                </Group>)
                                        },
                                    }]}
                                    records={sshListQuery?.data}
                                    noRecordsIcon={
                                        <Box
                                            p={4}
                                            mb={4}

                                        >
                                            <VscKey size={36} />
                                        </Box>
                                    }
                                />
                            </Box></>}

                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        </div>
    )
}

export default SSHKeyInput