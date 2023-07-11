import { ActionIcon, Avatar, Box, Button, Card, Container, Divider, Group, SimpleGrid, Stack, Text, Title, useMantineTheme } from "@mantine/core";

import React, { useState } from 'react'
import { AiOutlineReload } from "react-icons/ai";
import { BsShieldShaded, BsTerminal } from "react-icons/bs";
import { trpc } from "../../../../utils/trpc";
import { ProVmStatusInterface } from "../../../../Types/ProVmStatusInterface";
import { ProductVmInterface } from "../../../../Types/ProductVmInterface";
import { Ucword } from "../../../../Components/TextFormatter";
import dateFormat, { masks } from "dateformat";
import CurrencyFormat from 'react-currency-format';
import _, { truncate } from "lodash";
import { VscTrash } from "react-icons/vsc";
import { toast } from "react-hot-toast";
import { openConfirmModal } from "@mantine/modals";

const MyLocControl = ({ vmdetails, props }: { vmdetails: ProductVmInterface, props: any }) => {
    const theme = useMantineTheme();


    const [vmInstance, setVmInstanceDetails] = useState<ProVmStatusInterface>()
    const terminalMutation = trpc.node.terminal.useMutation()
    const serverActionMutation = trpc.node.serverAction.useMutation()
    const utils = trpc.useContext()
    const vm = trpc.node.vmDetail.useQuery({ orderId: vmdetails._id }, {
        onSuccess(data) {

            console.log(data);

            setVmInstanceDetails(data)
        },
        onError(err) {
            console.log(err);

        },
    })


    return (
        <div>
            <Container size="70rem" className="space-y-6 relative container-config mb-16" style={{ position: "relative" }}>
                <Group position='apart'>
                    <Title order={3}>Instance (VPS)</Title>
                </Group>

                <Box className='flex gap-6 bg-white divide-x border'>
                    <Card py={"md"} className="w-2/3 bg-white px-5">
                        <Card.Section className="py-4 px-3 border-b">
                            <Text fw={600}>
                                System Details
                            </Text>
                        </Card.Section>

                        <Card.Section className="py-4">
                            <table cellPadding={5}>
                                <tbody>
                                    <tr className="[&>*]:px-3">
                                        <td align="right" width={"15%"}>
                                            <Text fw={700}>Server</Text>
                                        </td>
                                        <td width={"50%"}>
                                            <Text className=" text-gray-600">{vmdetails?.hostname}</Text>
                                        </td>
                                    </tr>
                                    <tr className="[&>*]:px-3">
                                        <td align="right" width={"15%"}>
                                            <Text fw={700}>Producttype</Text>
                                        </td>
                                        <td width={"50%"}>
                                            <Text className=" text-gray-600">{vmdetails?.node.title}</Text>
                                        </td>
                                    </tr>
                                    <tr className="[&>*]:px-3">
                                        <td align="right" width={"15%"}>
                                            <Text fw={700}>Operating System</Text>
                                        </td>
                                        <td width={"50%"}>
                                            <Text className=" text-gray-600">{Ucword(vmdetails?.osType)} {vmdetails?.osVersion}</Text>
                                        </td>
                                    </tr>
                                    <tr className="[&>*]:px-3">
                                        <td align="right" width={"15%"}>
                                            <Text fw={700}>IP Address</Text>
                                        </td>
                                        <td width={"50%"}>
                                            <Text className=" text-gray-600">{vmdetails?.publicIp}</Text>
                                        </td>
                                    </tr>
                                    <tr className="[&>*]:px-3">
                                        <td align="right" width={"15%"}>
                                            <Text fw={700}>IP Address (v6)</Text>
                                        </td>
                                        <td width={"50%"}>
                                            <Text className=" text-gray-600">{vmdetails?.publicIpv6}</Text>
                                        </td>
                                    </tr>
                                    <tr className="[&>*]:px-3">
                                        <td align="right" width={"15%"}>
                                            <Text fw={700}>User</Text>
                                        </td>
                                        <td width={"50%"}>
                                            <Text className=" text-gray-600">root</Text>
                                        </td>
                                    </tr>

                                    <tr className="[&>*]:px-3">
                                        <td align="right" width={"15%"}>
                                            <Text fw={700}>Password</Text>
                                        </td>
                                        <td width={"50%"}>
                                            <Text className=" text-gray-600">
                                                No longer available
                                            </Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <Divider mx="lg" my={'md'} variant="dashed" />
                            <div className="flex justify-center gap-6 ">
                                <Button onClick={() => {
                                    openConfirmModal({
                                        title: 'Do you really want to restart?',
                                        children: (
                                            <div className="py-2">
                                                <Text size="sm">
                                                    Please note, this will stop any running proccess.
                                                </Text>
                                            </div>
                                        ),
                                        labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                        confirmProps: { className: "bg-red-500 hover:bg-red-600", radius: "xl" },
                                        cancelProps: { radius: "xl" },
                                        overlayProps: {
                                            color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                                            opacity: 0.55,
                                            blur: 3,
                                        },
                                        onCancel: () => console.log('Cancel'),
                                        onConfirm: () => {

                                            serverActionMutation.mutate({ action: "reboot", orderId: vmdetails._id }, {
                                                onSuccess(data, error, variables) {
                                                    utils.node.vmDetail.invalidate()
                                                    toast.success("Virtual server will be restarted!")
                                                },
                                                onError(error, variables, context) {
                                                    toast.error("There is already a restart in progress.")
                                                },
                                            })
                                        },
                                    });


                                }} leftIcon={<AiOutlineReload size={20} />} loading={serverActionMutation.isLoading} className=" bg-red-500 hover:bg-red-600" radius={"xl"} variant="filled">
                                    Reboot
                                </Button>
                                <Button onClick={() => {

                                    terminalMutation.mutate({ orderId: vmdetails._id }, {
                                        onSuccess(data, error, variables) {
                                            utils.node.vmDetail.invalidate()

                                        },
                                        onError(error, variables, context) {
                                            toast.error("Unable to start VNC console")
                                        },
                                    })
                                }} loading={terminalMutation.isLoading} leftIcon={<BsTerminal size={20} />} radius={"xl"} variant="default">
                                    VNC Console
                                </Button>

                                <Button leftIcon={<BsShieldShaded size={20} />} radius={"xl"} variant="default">
                                    Configure Firewall
                                </Button>

                            </div>

                            <Divider mx="lg" my={'md'} variant="dashed" />


                            <Box className="px-6 space-y-2">
                                <div>
                                    <Text>SSH Keys</Text>
                                </div>
                                <div className=" min-h-[100px] ">
                                    <div className="py-6 border rounded justify-center gap-3 flex bg-gray-50">
                                        {_.isEmpty(vmdetails.sshKey) ?
                                            <>
                                                <Stack spacing={5} align="center">
                                                    <Text color="#6b7280">No key available for this VM</Text>
                                                    <Button size="xs" radius={"xl"} variant="default">
                                                        <Text>Add SSH Key</Text>
                                                    </Button>
                                                </Stack>
                                            </> :
                                            <>
                                                <Text>{vmdetails.sshKey.label}</Text>
                                                <Text >{truncate(vmdetails.sshKey.key, {
                                                    length: 50,
                                                    omission: "..."
                                                })}</Text>
                                                <ActionIcon>
                                                    <VscTrash size={20} />
                                                </ActionIcon>
                                            </>}

                                    </div>
                                </div>
                            </Box>
                            <Divider mx="lg" my={'md'} variant="dashed" />
                            <Box className="px-6 space-y-2">
                                <div>
                                    <Text>Licenses</Text>
                                </div>
                                <div className=" min-h-[100px]">
                                    <div className="py-6 border rounded justify-center bg-gray-50 flex">

                                        <Stack spacing={5}>
                                            <Text color="#6b7280">No licenses found.</Text>
                                            <Button size="xs" radius={"xl"} variant="default">
                                                <Text>Add new</Text>
                                            </Button>
                                        </Stack>

                                    </div>
                                </div>
                            </Box>
                        </Card.Section>


                    </Card>
                    <Card className="w-1/3 bg-white px-5">
                        <Card.Section className="py-4 px-3 border-b">
                            <Text fw={600}>Administration</Text>
                        </Card.Section>

                        <Card.Section className="py-4 px-5">
                            <Stack>

                                <Button className=" bg-red-500 hover:bg-red-600" radius={"xl"} variant="filled">
                                    Reinstall Now
                                </Button>

                                <Button radius={"xl"} variant="default">
                                    IP Address Management
                                </Button>

                                <Button radius={"xl"} variant="default">
                                    RDNS Management
                                </Button>
                                <Button radius={"xl"} variant="default">
                                    Manage Bandwidth
                                </Button>
                            </Stack>
                        </Card.Section>

                        <Divider mx="lg" my={'md'} variant="dashed" />
                        <Card.Section className="py-4 px-5 space-y-4">
                            <div>
                                <div>
                                    Registration Date
                                </div>
                                <Text size={14} className="text-gray-600">
                                    {dateFormat(vmdetails?.createdAt, "fullDate")}
                                </Text>
                            </div>
                            <div>
                                <div>
                                    Recurring Amount
                                </div>
                                <Text size={14} className="text-gray-600">
                                    <CurrencyFormat value={vmdetails.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                </Text>
                            </div>

                            <div>
                                <div>
                                    Billing Cycle
                                </div>
                                <Text size={14} className="text-gray-600">
                                    {dateFormat(vmdetails?.renewalDate, "fullDate")}
                                </Text>
                            </div>

                            <div>
                                <div>
                                    Payment Method
                                </div>
                                <Text size={14} className="text-gray-600">
                                    {Ucword(vmdetails?.paymentMethod)}
                                </Text>
                            </div>
                        </Card.Section>
                    </Card>
                </Box>
            </Container>
        </div >
    )
}

export default MyLocControl