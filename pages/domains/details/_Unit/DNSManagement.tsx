import { ActionIcon, Alert, Box, Button, Divider, Group, SimpleGrid, Text, TextInput, Title, UnstyledButton } from '@mantine/core'
import { IconAlertCircle, IconCircleMinus } from '@tabler/icons'
import React, { useState } from 'react'
import { trpc } from '../../../../utils/trpc'
import { toast } from 'react-hot-toast'
import NsManageUnit from '../_UnitComponent/NsManageUnit'

const DNSManagement = (order: any) => {

    const dnsUpdateMutation = trpc.domainManager.dnsUpdate.useMutation()
    const [errorCheck, seterrorCheck] = useState("")
    const utils = trpc.useContext()
    const [inputList, setInputList] = useState(order?.nameServerList.length > 3 ? order?.nameServerList : [{ key: "ns1", number: 1, value: "" },
    { key: "ns2", number: 2, value: "" },
    { key: "ns3", number: 3, value: "" },
    { key: "ns4", number: 4, value: "" }])


    // handle input change
    const handleInputChange = (event: any, index: number) => {

        const { name, value } = event.target;
        setInputList((prevInputList: any) => {
            const newInputList: any = [...prevInputList];
            newInputList[index]["value"] = value;
            return newInputList;
        });

    }


    return (
        <Box className='px-6'>
            <Group position='apart' className='border-b pb-4'>
                <Title order={3} className=' font-light'>DNS Management</Title>
            </Group>

            <Box className='mt-6 mb-2 space-y-4'>
                <Alert variant='filled' icon={<IconAlertCircle size={30} />} >
                    You can edit the domain name&apos;s existing DNS information and create custom name server information.
                </Alert>
                <Box className='min-h-[55vh]'>
                    <SimpleGrid
                        cols={2}
                        spacing="lg"
                        className=' divide-x w-full'
                        breakpoints={[
                            { maxWidth: 'md', cols: 2, spacing: 'md' },
                            { maxWidth: 'sm', cols: 1, spacing: 'sm' },
                            { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                        ]}
                    >

                        <Box className='px-2'>
                            <Divider my="xs" className=' text-lg' label={<Text fw={700} fz={"sm"}>DNS Management</Text>} />
                            {errorCheck && <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                                {errorCheck}
                            </Alert>
                            }

                            <Box className='space-y-4'>
                                <Box className='space-y-2 mt-6'>

                                    {inputList?.map((ns: any, key: number) => {

                                        return (
                                            <div key={key}>
                                                <TextInput
                                                    label={`Name Server ${key + 1}`}
                                                    name={ns.key}
                                                    value={ns.value}
                                                    onChange={e => handleInputChange(e, key)}
                                                    rightSection={ns.number > 4 ?
                                                        <>
                                                            <ActionIcon onClick={() => {

                                                                // console.log(ns);
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

                                <UnstyledButton hidden={inputList.length > 9} onClick={() => {
                                    let num = inputList[inputList.length - 1].number + 1
                                    // console.log(num);

                                    setInputList([...inputList, { key: `ns${num}`, number: num, value: "" }])

                                }} className=' py-2 mt-4 border border-gray-300 rounded-md border-dashed text-center w-full'>
                                    <Text size={"sm"}>Add More</Text>
                                </UnstyledButton>

                                <Group position="right" mt="lg">
                                    <Button loading={dnsUpdateMutation.isLoading}
                                        onClick={() => {



                                            const allEmpty = inputList.filter((obj: any) => obj.value !== "");

                                            if (allEmpty.length > 1) {



                                                seterrorCheck("")

                                                dnsUpdateMutation.mutate({ orderId: order.id, dnsList: inputList, domainame: order.domain }, {
                                                    onSuccess(data, variables, context) {
                                                        // console.log(data);
                                                        toast.success("Name server updated successfully.")
                                                        utils.orders.asyncOrder.invalidate()
                                                    },
                                                    onError(error, variables, context) {
                                                        // console.log(error);
                                                        toast.error("Unable to update name server.")
                                                    },
                                                })

                                            } else {
                                                seterrorCheck("At least two Name Server addresses must not be empty")
                                            }


                                        }} radius={"xl"} className=' bg-lochmara-400 hover:bg-lochmara-500'>Update Name Servers</Button>
                                </Group>
                            </Box>

                        </Box>

                        <Box className='px-2'>
                            <Divider my="xs" className=' text-lg' label={<Text fw={700} fz={"sm"}>Name Server Management</Text>} />
                            <NsManageUnit order={order} />
                        </Box>
                    </SimpleGrid>
                </Box>
            </Box>
        </Box>
    )
}

export default DNSManagement