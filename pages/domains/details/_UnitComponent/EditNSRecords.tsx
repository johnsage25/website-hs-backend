import { ActionIcon, Box, Button, Divider, Group, Input, Modal, Text, TextInput, UnstyledButton, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons'
import { IconCircleMinus } from '@tabler/icons-react';
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { trpc } from '../../../../utils/trpc';
import { ChildNameServerDataInterface2 } from '../../../../Types/ChildNameServerDataInterface2';

const EditNSRecords = ({ order, row }: { order: any, row: any }) => {
    const theme = useMantineTheme();
    const [opened, { open, close }] = useDisclosure(false);
    const [inputList, setInputList] = useState([...row.nsIPs])
    const [hostName, sethostName] = useState(row.nsHost)
    const updateChildNSMutation = trpc.domainManager.updateChildNS.useMutation()
    const utils = trpc.useContext()

    const handleInputChange = (event: any, index: number) => {

        const { name, value } = event.target;
        setInputList((prevInputList: any) => {
            const newInputList: any = [...prevInputList];
            newInputList[index]["value"] = value;
            return newInputList;
        });

    }

    return (
        <div>
            <ActionIcon onClick={() => {
                // console.log(row);
                open()
            }}>
                <IconEdit size={16} />
            </ActionIcon>

            <Modal.Root closeOnClickOutside={false} size={"md"} opened={opened} onClose={close}>
                <Modal.Overlay opacity={0.55} blur={3} color={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]} />
                <Modal.Content>
                    <Modal.Header className='border-b'>
                        <Modal.Title>
                            <Text fw={600}>Edit Child Name Server</Text>
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
                                    _id:row._id,
                                    domain: order.domain
                                }

                                updateChildNSMutation.mutate(hostNsData, {
                                    onSuccess(data, variables, context) {
                                        toast.success("Child name server updated successfully.")
                                        close()
                                        utils.orders.asyncOrder.invalidate()
                                        // utils.orders.asyncnsList.invalidate()

                                    },
                                    onError(error, variables, context) {
                                        toast.error(`Unable to update name server :${error.message}`)
                                    },
                                })


                            }} radius={"xl"} loading={updateChildNSMutation.isLoading} className=' bg-lochmara-400 hover:bg-lochmara-500'>Save</Button>
                        </Group>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        </div>
    )
}

export default EditNSRecords