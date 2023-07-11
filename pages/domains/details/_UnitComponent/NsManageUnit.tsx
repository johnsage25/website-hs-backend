import { ActionIcon, Box, Button, Divider, Group, Input, Modal, ScrollArea, Text, TextInput, UnstyledButton, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconCircleMinus } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { toast } from 'react-hot-toast';
import { DataTable } from 'mantine-datatable';
import { IconEdit, IconTrash } from '@tabler/icons';
import EditNSRecords from './EditNSRecords';
import { ChildNameServerDataInterface2 } from '../../../../Types/ChildNameServerDataInterface2';
import { trpc } from '../../../../utils/trpc';
import { VscDebugDisconnect } from 'react-icons/vsc';

const NsManageUnit = ({ order }: { order: any }) => {
    const theme = useMantineTheme();
    // const [orderI, setorder] = useState(order)
    const addChildNSMutation = trpc.domainManager.addChildNS.useMutation()
    const removeChildNSMutation = trpc.domainManager.removeChildNS.useMutation()
    const utils = trpc.useContext()
    const [opened, { open, close }] = useDisclosure(false);
    const [acd, setacd] = useState("")
    const [inputList, setInputList] = useState([{ number: 1, value: "" }])
    const [hostName, sethostName] = useState("")
    const [page, setPage] = useState(1);
    const [nslist, setnslist] = useState(order?.nslist.slice(0, 8))
    const handleInputChange = (event: any, index: number) => {

        const { name, value } = event.target;
        setInputList((prevInputList: any) => {
            const newInputList: any = [...prevInputList];
            newInputList[index]["value"] = value;
            return newInputList;
        });

    }


    useEffect(() => {
        const from = (page - 1) * 8;
        const to = from + 8;
        setnslist(order?.nslist.slice(from, to));
    }, [page]);

    return (
        <div>
            <div className='border-b pb-3'>
                <Group position="apart">
                    <Text>DS List</Text>
                    <Button onClick={open} radius={"xl"} leftIcon={<AiOutlinePlus />} variant='default' size='sm'>Add</Button>
                </Group>
            </div>
            <Box >

                <DataTable
                    minHeight={350}
                    columns={[{
                        accessor: 'Hostname', render: (row: any) => {
                            return (
                                <>
                                    <Text size={13}>{row.nsHost}</Text>
                                </>
                            )
                        }
                    }, {
                        accessor: 'ips', title: "Ip Address", width: 120, render: (row: any) => {
                            return (
                                <>
                                    <Text size={13}>{row.nsIPs?.map((item: any) => item.value).join(",\n")}</Text>
                                </>
                            )
                        }
                    },
                    {
                        accessor: 'actions',
                        title: <></>,
                        textAlignment: 'right',
                        width: 60,
                        render: (row: any) => (
                            <Group spacing={4} position="right" noWrap>

                                <EditNSRecords order={order} row={row} />
                                <ActionIcon loading={removeChildNSMutation.isLoading && acd == row?._id} color="red" onClick={() => {
                                    setacd(row?._id)
                                    removeChildNSMutation.mutate({ _id: row?._id, domain: order.domain, nsHost: row.nsHost }, {
                                        onSuccess(data, variables, context) {
                                            utils.orders.asyncOrder.invalidate()
                                            // utils.orders.asyncnsList.invalidate()
                                            setnslist(order?.nslist)
                                        },
                                        onError(error, variables, context) {
                                            toast.error("Unabled to delete ns.")
                                        },
                                    })
                                }}>
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                        ),
                    }]}

                    totalRecords={order?.nslist.length}
                    recordsPerPage={8}
                    onPageChange={(p) => {
                        setPage(p)
                    }}
                    noRecordsIcon={
                        <Box
                            p={4}
                            mb={4}

                        >
                            <VscDebugDisconnect size={50}  />
                        </Box>
                    }
                    noRecordsText="No records found"
                    page={page}
                    records={nslist}
                />

            </Box>


            <Modal.Root closeOnClickOutside={false} size={"md"} opened={opened} onClose={close}>
                <Modal.Overlay opacity={0.55} blur={3} color={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]} />
                <Modal.Content>
                    <Modal.Header className='border-b'>
                        <Modal.Title>
                            <Text fw={600}>New Child Name Server</Text>
                            <Text fz={"xs"}>{order.domain}</Text>
                        </Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Box className='py-2 px-2'>
                            <Input.Wrapper
                                id="input-ns"
                                withAsterisk
                                label="Host Name"
                                description={`ns.${order.domain}`}
                                inputWrapperOrder={['label', 'error', 'input', 'description']}
                            // error="Your credit card expired"
                            >
                                <Input id="input-ns" value={hostName} onChange={(e) => {
                                    sethostName(e.target.value)
                                }} />
                            </Input.Wrapper>

                            <Divider my="xs" label="IP Address" labelPosition="center" />

                            {/* <ScrollArea.Autosize mah={200}  mx="auto"> */}
                            <Box className='space-y-2'>
                                {inputList?.map((ns: any, key: number) => {

                                    return (
                                        <div key={key}>
                                            <TextInput
                                                label={`IP ${key + 1}`}
                                                name={ns.key}
                                                value={ns.value}
                                                onChange={e => handleInputChange(e, key)}
                                                rightSection={ns.number > 1 ?
                                                    <>
                                                        <ActionIcon onClick={() => {


                                                            setInputList(inputList?.filter((item: any) => item.number !== ns.number))

                                                        }}>
                                                            <IconCircleMinus size={20} />
                                                        </ActionIcon>
                                                    </>
                                                    : null}
                                            />
                                        </div>
                                    )
                                })}
                            </Box>
                            {/* </ScrollArea.Autosize> */}

                            <UnstyledButton hidden={inputList.length > 3} onClick={() => {
                                let num = inputList[inputList.length - 1].number + 1


                                setInputList([...inputList, { number: num, value: "" }])

                            }} className=' py-2 mt-4 border border-gray-300 rounded-md border-dashed text-center w-full'>
                                <Text size={"sm"}>Add More</Text>
                            </UnstyledButton>

                        </Box>
                        <Group position='right' className='border-t pt-4'>
                            <Button onClick={() => {
                                let hostNsData: ChildNameServerDataInterface2 = {
                                    nsHost: hostName,
                                    nsIPs: inputList,
                                    order: order._id,
                                    domain: order.domain
                                }

                                addChildNSMutation.mutate(hostNsData, {
                                    onSuccess(data, variables, context) {
                                        toast.success("Child name server added successfully.")
                                        setInputList([{ number: 1, value: "" }]);
                                        sethostName("")
                                        utils.orders.asyncOrder.invalidate()
                                        // utils.orders.asyncnsList.invalidate()

                                    },
                                    onError(error, variables, context) {
                                        toast.error(`Unable to add name server`)
                                    },
                                })


                            }} radius={"xl"} loading={addChildNSMutation.isLoading} className=' bg-lochmara-400 hover:bg-lochmara-500'>Save</Button>
                        </Group>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>

        </div>
    )
}

export default NsManageUnit