import Head from 'next/head'
import React, { useState } from 'react'
import { ActionIcon, Avatar, Badge, Box, Button, Card, Container, CopyButton, Divider, Flex, Group, Image, Paper, SimpleGrid, Skeleton, Stack, Table, Tabs, Text, Title, Tooltip } from '@mantine/core'
import _ from 'lodash'

import dateFormat, { masks } from "dateformat";
import { AiOutlineFire, AiOutlinePoweroff, AiOutlineReload } from 'react-icons/ai'
import { VscCircleLargeOutline, VscKey, VscPlay, VscServerEnvironment, VscTerminal } from 'react-icons/vsc'
import { IconCheck, IconCopy, IconRefresh, IconTerminal2 } from '@tabler/icons'
import { BsTerminal } from 'react-icons/bs'
import { toast } from 'react-hot-toast'
import { ProVmStatusInterface } from '../../../../Types/ProVmStatusInterface';
import StatusBadge from '../_Component/StatusBadge';
import StatBlock from '../_Component/StatBlock';
import TerminalComponent from '../_Component/TerminalComponent';
import { trpc } from '../../../../utils/trpc';
import { Ucword } from '../../../../Components/TextFormatter';
import VmPassword from '../_Component/VmPassword';
import ChangeHostname from '../_Component/ChangeHostname';
import CPUGraphBlock from '../_Component/CPUGraphBlock';



const SelfPanelControl = ({ vmdetails, props }: { vmdetails: any, props:any }) => {

    const [vmDetails, setvmDetail] = useState(vmdetails)
    const [vmInstance, setVmInstanceDetails] = useState<ProVmStatusInterface>()
    // const terminalMutation = trpc.node.terminal.useMutation()

    const vm = trpc.node.vmDetail.useQuery({ orderId: vmDetails._id }, {
        onSuccess(data) {

            console.log(data);

            setVmInstanceDetails(data)
        },
        onError(err) {
            console.log(err);

        },
    })
    const serverActionMutation = trpc.node.serverAction.useMutation()
    const utils = trpc.useContext()


    return (
        <div>
            <Container size="70rem" className="space-y-6 relative container-config mb-16" style={{ position: "relative" }}>
                <Group position='apart'>
                    <Title order={3}>Instance (VPS)</Title>
                </Group>
                <Box className='py-5 px-5 bg-white border divide-y space-y-4'>
                    <Box>
                        <Flex gap={10} align={"center"} justify={"space-between"}>
                            <Group spacing={10}>
                                <Avatar src={`/images/os/${vmDetails?.osType}.svg`} />
                                <Stack spacing={5} >
                                    <Group >
                                        <Flex align={"center"} gap={10}>
                                            <Text size={"xl"} fw={600}>{vmDetails?.hostname}</Text>
                                            <div>
                                                {vm.isLoading ? <> <Skeleton height={18} width={80} /></>
                                                    : <>
                                                        <StatusBadge status={vmInstance?.status} />
                                                    </>}

                                            </div>

                                        </Flex>
                                    </Group>

                                    <Group position='apart'>
                                        <div className='flex gap-3 text-gray-600'>
                                            <Text size={14}>{vmDetails?.publicIp}</Text>
                                            <Text size={14}>1GB Memory</Text>
                                            <Text size={14}>{vmDetails?.region[0]?.locationName}</Text>
                                            <Text size={14}>Created {dateFormat(vmDetails?.createdAt, "mediumDate")}</Text>
                                        </div>
                                    </Group>
                                </Stack>

                            </Group>

                            {vm.isLoading ?
                                <>
                                    <div className='flex items-center gap-3'>
                                        <Skeleton height={26} circle />
                                        <Skeleton height={26} circle />
                                        <Skeleton height={26} circle />
                                    </div>
                                </>
                                :
                                <>
                                    <div className=' flex items-center gap-2 pr-4'>
                                        {_.isEqual(vmInstance?.status, "stopped") ? <>
                                            <Tooltip label="Turn On">
                                                <ActionIcon onClick={() => {
                                                    serverActionMutation.mutate({ action: "turnon", orderId: vmDetails._id }, {
                                                        onSettled(data, error, variables, context) {
                                                            utils.node.vmDetail.invalidate()
                                                        },
                                                        onError(error, variables, context) {
                                                            console.log(error);

                                                            toast.error("Unable to turnon VM.")
                                                        },
                                                    })
                                                }}>
                                                    <VscPlay color='#000' size={20} />
                                                </ActionIcon>
                                            </Tooltip></> : <>
                                            <Tooltip label="Shutdown">
                                                <ActionIcon onClick={() => {

                                                    serverActionMutation.mutate({ action: "shutdown", orderId: vmDetails._id }, {
                                                        onSettled(data, error, variables, context) {
                                                            utils.node.vmDetail.invalidate()
                                                            setTimeout(() => {
                                                                utils.node.vmDetail.invalidate()
                                                            }, 30000);
                                                        },
                                                        onError(error, variables, context) {
                                                            toast.error("Unable to turnon VM.")
                                                        },
                                                    })
                                                }}>
                                                    <AiOutlinePoweroff color='red' size={20} />
                                                </ActionIcon>

                                            </Tooltip>

                                            <Tooltip label="Reboot">
                                                <ActionIcon onClick={() => {
                                                    serverActionMutation.mutate({ action: "reboot", orderId: vmDetails._id }, {
                                                        onSettled(data, error, variables, context) {
                                                            utils.node.vmDetail.invalidate()
                                                            setTimeout(() => {
                                                                utils.node.vmDetail.invalidate()
                                                            }, 30000);
                                                        },
                                                        onError(error, variables, context) {
                                                            toast.error("Unable to turnon VM.")
                                                        },
                                                    })
                                                }}>
                                                    <AiOutlineReload color='#000' size={20} />
                                                </ActionIcon>
                                            </Tooltip>
                                            <Tooltip label="Terminal">
                                                <TerminalComponent vmDetails={vmDetails} hosturl={props.hosturl} />

                                            </Tooltip>

                                        </>}

                                    </div>
                                </>}


                        </Flex>

                    </Box>

                </Box>


                <Tabs defaultValue="overview" className=' bg-white  border '>
                    <Tabs.List className=' border-b'>
                        <Tabs.Tab value="overview">Overview</Tabs.Tab>
                        <Tabs.Tab value="graph">
                            Usage Graphs
                        </Tabs.Tab>
                        {/* <Tabs.Tab value="settings">
                Settings
              </Tabs.Tab> */}
                    </Tabs.List>

                    <Tabs.Panel value="overview" pt="xs">
                        <Paper className=' w-full py-4 min-h-[30vh]'>
                            <StatBlock details={vmInstance} vmOrder={vmDetails} />

                            <div className="py-4 px-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-2">
                                <div className='space-y-2'>
                                    <Group>
                                        <Text size={15} fw={600}>Location: </Text>
                                        <Text size={15}><span className={`fi fi-${vmDetails?.region[0]?.name?.toLowerCase()}`}></span> {vmDetails?.region[0]?.locationName} {vmDetails?.region[0]?.name}</Text>
                                    </Group>

                                    <Group>
                                        <Text size={15} fw={600}>Operating System: </Text>
                                        <Text size={15}>{Ucword(vmDetails?.osType)} {vmDetails?.osVersion}</Text>
                                    </Group>
                                    <Group className=' items-center'>
                                        <Text size={15} fw={600}>IP Address: </Text>
                                        <div className='flex gap-1'>
                                            <Text size={15}>{vmDetails?.publicIp}</Text>
                                            <CopyButton value={vmDetails?.publicIp} timeout={2000}>
                                                {({ copied, copy }) => (
                                                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                                        <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                                            {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}
                                            </CopyButton>
                                        </div>
                                    </Group>

                                    <Group className=' items-center'>
                                        <Text size={15} fw={600}>User: </Text>
                                        <div className='flex gap-1'>
                                            <Text size={15}>root</Text>
                                            <CopyButton value="root" timeout={2000}>
                                                {({ copied, copy }) => (
                                                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                                        <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                                            {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}
                                            </CopyButton>
                                        </div>
                                    </Group>



                                    <Group className=' items-center'>
                                        <Text size={15} fw={600}>Hostname: </Text>
                                        <div className='flex gap-1 items-center'>
                                            <Text size={15}>{vmDetails?.hostname}</Text>
                                            <CopyButton value={vmDetails?.hostname} timeout={2000}>
                                                {({ copied, copy }) => (
                                                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                                        <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                                            {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}
                                            </CopyButton>
                                        </div>
                                    </Group>

                                    <Group className=' items-center'>
                                        <Text size={15} fw={600}>IPv6 Address:</Text>
                                        <div className='flex gap-1 items-center'>
                                            <Text size={14}>{vmDetails?.publicIpv6}</Text>
                                            <CopyButton value={vmDetails?.publicIpv6} timeout={2000}>
                                                {({ copied, copy }) => (
                                                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                                        <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                                            {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}
                                            </CopyButton>
                                        </div>
                                    </Group>

                                    <Group className=' items-center'>
                                        <Text size={15} fw={600}>vCPU/s: </Text>
                                        <Text size={15}>{vmDetails?.node?.vcpu} vCPU</Text>
                                    </Group>

                                    <Group className=' items-center'>
                                        <Text size={15} fw={600}>Disk size:</Text>
                                        <Text size={15}>{vmDetails?.node?.storage}{vmDetails?.node?.storageFormat.toUpperCase()}</Text>
                                    </Group>

                                </div>
                                <div>

                                    <Card
                                        // withBorder
                                        padding="xl"
                                        className=' h-full'
                                        component="div"
                                    >
                                        <Card.Section className='p-4'>
                                            <SimpleGrid cols={2}>
                                                <Button component='a' href={`/instances/firewall/${vmDetails._id}`} radius={"xl"} variant='default'>
                                                    Configure Firewall
                                                </Button>

                                                <VmPassword vmDetails={vmDetails} />
                                                <ChangeHostname vmDetails={vmDetails} />

                                            </SimpleGrid>
                                        </Card.Section>

                                        <Divider my="xs" label="Administration" />

                                        <Card.Section className='p-4'>
                                            <SimpleGrid cols={2}>
                                                <Button radius={"xl"} variant='default'>
                                                    RDNS Management
                                                </Button>
                                                <Button radius={"xl"} variant='default'>
                                                    Add IP Address
                                                </Button>
                                                <Button radius={"xl"} variant='default'>
                                                    Add IP Address (v6)
                                                </Button>
                                                <Button radius={"xl"} variant='default'>
                                                    IP Addresses
                                                </Button>
                                            </SimpleGrid>
                                        </Card.Section>
                                    </Card>


                                </div>
                            </div>
                        </Paper>
                    </Tabs.Panel>

                    <Tabs.Panel value="graph" pt="xs">
                        <Paper className=' w-full py-4 min-h-[30vh]'>
                            <CPUGraphBlock vmDetails={vmDetails} />
                        </Paper>
                    </Tabs.Panel>
                    <Tabs.Panel value="settings" pt="xs">
                        <Paper className=' w-full py-4 min-h-[30vh]'>

                        </Paper>
                    </Tabs.Panel>
                </Tabs>
            </Container>
        </div>
    )
}

export default SelfPanelControl