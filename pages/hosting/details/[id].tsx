import React from 'react'
import { ServerSideProps } from '../../../Types/ServerInterface'
import { AuthCheck } from '../../../node/AuthCheck'
import { GetOrders } from '../../../node/GetOrders'
import _ from 'lodash'
import Head from 'next/head'
import { WithTheme } from '../../_Layout/HocLayout'
import { ActionIcon, Anchor, Box, Button, Card, Center, Container, Divider, Flex, Group, Paper, Popover, RingProgress, SimpleGrid, Switch, Tabs, Text, Title, Tooltip, UnstyledButton, useMantineTheme } from '@mantine/core'
import { OrderDetails } from '../../../node/OrderDetails'
import { IconMail, IconMessageCircle, IconPhoto, IconSettings } from '@tabler/icons'
import { IconLayoutDashboard, IconPassword } from '@tabler/icons-react'
import { VscLock, VscMailRead, VscRefresh } from 'react-icons/vsc'
import { BsInfoCircle, BsLockFill } from 'react-icons/bs'
import { FiChrome } from 'react-icons/fi'
import { MdOutlineDns } from 'react-icons/md';
import BackupIcon2 from '../../../Components/icons/BackupIcon2'
import EmailIcon from '../../../Components/icons/EmailIcon'
import ForwarderIcon from '../../../Components/icons/ForwarderIcon'
import FileManager from '../../../Components/icons/FileManager'
import AddonDomain from '../../../Components/icons/AddonDomain'
import SubDomain from '../../../Components/icons/SubDomain'
import MysqlIcon from '../../../Components/icons/MysqlIcon'
import ScheduleIcon from '../../../Components/icons/ScheduleIcon'
import CurrencyFormat from 'react-currency-format'
import dateFormat, { masks } from "dateformat";
import { Ucword } from '../../../Components/TextFormatter'
import { PackageTerms } from '../../../utils/helpers'
import collect from 'collect.js'
import { GrUpgrade } from 'react-icons/gr'
import { AiOutlineCheckCircle, AiOutlineInfoCircle, AiOutlineMail } from 'react-icons/ai'
import { trpc } from '../../../utils/trpc'
import convertSize from "convert-size";
import PanelSession from './_Blocks/PanelSession'
import PanelComponents from './_Blocks/PanelComponents'
import { openConfirmModal } from '@mantine/modals'
import { DataTable } from 'mantine-datatable'
import MailListComponent from './_Blocks/PasswordComponent'
import PasswordComponent from './_Blocks/PasswordComponent'
import UpgradeIcon from '../../../Components/icons/UpgradeIcon'
import middleChecker from '../../../node/middleChecker'

const Detail = (props: any) => {
    let connections = collect(PackageTerms)
    const theme = useMantineTheme();

    let order: any = props?.orderDetail;
    const updateChartMutation = trpc.orders.updateChart.useQuery({ ...order?.hostMeta[0], order: order._id }, { keepPreviousData: true })


    let stat: { totalDiskUsage: number, totaltraffic: number } = updateChartMutation.data || { totalDiskUsage: 0, totaltraffic: 0 }

    // Statistics
    let chartValue = () => {
        const percentage = (stat?.totalDiskUsage / order?.hostMeta[0]?.diskLimit) * 100;
        const percentageTotal = Math.round(percentage);
        switch (percentageTotal) {
            case 100:
                return [{ value: percentageTotal, color: 'orange', label: percentage.toFixed(2) }];
            case 40:
                return [{ value: percentageTotal, color: 'yellow', label: percentage.toFixed(2) }];
            default:
                return [{ value: percentageTotal, color: 'blue', label: percentage.toFixed(2) }];
        }
    }


    let chartValueTraffic = () => {
        const percentage = (stat?.totaltraffic / order?.hostMeta[0]?.diskLimit) * 100;
        const percentageTotal = Math.round(percentage);
        switch (percentageTotal) {
            case 100:
                return [{ value: percentageTotal, color: 'orange', label: percentage.toFixed(2) }];
            case 40:
                return [{ value: percentageTotal, color: 'yellow', label: percentage.toFixed(2) }];
            default:
                return [{ value: percentageTotal, color: 'blue', label: percentage.toFixed(2) }];
        }
    }


    // // console.log(updateChartMutation.data);

    return (
        <>

            <Head>
                <title>Hosting</title>
            </Head>

            <WithTheme props={props}>
                <Container size={'xl'} className="px-12 space-y-4">
                    <Group>
                        <Title order={2}>{order?.serviceName}({order?.Products.connectType})</Title>
                    </Group>
                    <Paper className=' border min-h-[40vh]'>
                        <Tabs defaultValue="dashboard">
                            <Tabs.List>
                                <Tabs.Tab className='p-3' value="dashboard" icon={<IconLayoutDashboard size="1.3rem" />}>Dashboard</Tabs.Tab>
                                <Tabs.Tab className='p-3' value="password" icon={<VscLock size="1.3rem" />}> Change Password</Tabs.Tab>
                                <Tabs.Tab className='p-3' value="settings" icon={<GrUpgrade size="1.3rem" />}>Upgrade/Downgrade</Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="dashboard" pt="xs">
                                <Box className='pb-6 '>
                                    <SimpleGrid
                                        breakpoints={[
                                            { minWidth: 'sm', cols: 1 },
                                            { minWidth: 1200, cols: 2 },
                                        ]}
                                        className=' divide-x'
                                    >
                                        <Box className='px-12 py-6 space-y-5'>
                                            <Group position="right">
                                                <ActionIcon >
                                                    <VscRefresh size={18} />
                                                </ActionIcon>
                                            </Group>
                                            <Flex gap={50} className=' justify-center'>
                                                <div className=' text-center space-y-2'>
                                                    <Text fw={700}>Disk Usage</Text>
                                                    <RingProgress
                                                        sections={chartValue()}
                                                        size={160}
                                                        thickness={11}
                                                        roundCaps
                                                        label={
                                                            <Text color="blue" weight={700} align="center" size="xl">
                                                                {chartValue()[0]?.label}%
                                                            </Text>
                                                        }
                                                    />
                                                    <Text>{convertSize(stat?.totalDiskUsage, {
                                                        accuracy: 1,

                                                    })} / {convertSize(parseInt(order?.hostMeta[0]?.diskLimit,), {
                                                        accuracy: 1,

                                                    })}</Text>

                                                </div>

                                                <div className=' text-center space-y-2'>
                                                    <Text fw={700}>Bandwidth Usage</Text>
                                                    <RingProgress
                                                        sections={chartValueTraffic()}
                                                        size={160}
                                                        thickness={11}
                                                        roundCaps
                                                        label={
                                                            <Text color="blue" weight={700} align="center" size="xl">
                                                                {chartValueTraffic()[0]?.label}%
                                                            </Text>
                                                        }
                                                    />
                                                    <Text>{convertSize(stat?.totaltraffic, {
                                                        accuracy: 1,

                                                    })}/ {convertSize(parseInt(order?.hostMeta[0]?.bandwidthLimit), {
                                                        accuracy: 1,

                                                    })}</Text>
                                                </div>
                                            </Flex>
                                            <PanelSession {...order} />
                                            <Divider />
                                            <Box className=' text-center space-y-4'>

                                                <div>
                                                    <Text size={"md"} fw={700}>
                                                        {order?.orderType}
                                                    </Text>
                                                    <Text size={"md"}>
                                                        {order?.serviceName}
                                                    </Text>
                                                    {!_.isEmpty(order?.domain) && <Anchor target='_blank' href={`http://${order?.domain}`} size={"md"}>
                                                        {order?.domain}
                                                    </Anchor>}
                                                </div>
                                                <Group spacing={4} position='center'>
                                                    <Tooltip
                                                        label="View Website"
                                                        color="dark"
                                                        withArrow
                                                    >
                                                        <ActionIcon onClick={() => {
                                                            window.open(`http://${order.domain}`, '_blank');
                                                        }}>
                                                            <FiChrome size={18} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip
                                                        label="Whois details"
                                                        color="dark"
                                                        withArrow
                                                    >
                                                        <ActionIcon onClick={() => {
                                                            window.open(`https://hostspacing.com/whois?domain=${order.domain}`, '_blank');
                                                        }}>
                                                            <BsInfoCircle size={16} />
                                                        </ActionIcon>
                                                    </Tooltip>

                                                    <Tooltip
                                                        label="Domain DNS"
                                                        color="dark"
                                                        onClick={() => {
                                                            window.open(`https://intodns.com/${order.domain}`, '_blank');
                                                        }}
                                                        withArrow
                                                    >
                                                        <ActionIcon>
                                                            <MdOutlineDns size={16} />
                                                        </ActionIcon>
                                                    </Tooltip>

                                                </Group>

                                                <Group position='center'>
                                                    <Button onClick={() => {
                                                        openConfirmModal({
                                                            title: <Text fw={700}>Cancellation Request</Text>,
                                                            size: 'lg',
                                                            children: (
                                                                <Box className='py-4'>
                                                                    <Text>
                                                                        Your service will be permanently deleted after the cancellation request. Any pending invoices will be canceled and the service will no longer renew. After the service is canceled, it is not possible to restore it. Note: You will not be refunded.
                                                                    </Text>
                                                                </Box>
                                                            ),
                                                            overlayProps: {
                                                                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                                                                opacity: 0.55,
                                                                blur: 3,
                                                            },
                                                            confirmProps: { radius: "xl", className: " bg-red-500 hover:bg-red-600" },
                                                            cancelProps: { radius: "xl" },
                                                            labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                            onCancel: () => // console.log('Cancel'),
                                                            onConfirm: () => // console.log('Confirmed'),
                                                        })
                                                    }} radius={"xl"} className='bg-red-500 hover:bg-red-600'>Request Cancelation</Button>
                                                </Group>

                                            </Box>

                                        </Box>
                                        <Box className='px-8 py-6 space-y-6'>
                                            {/* <Divider my="xs" label="Quick Shortcuts" /> */}
                                            <PanelComponents {...order} />
                                            <Divider label="Billing Overview" />
                                            <Box>
                                                <SimpleGrid breakpoints={[
                                                    { minWidth: 'sm', cols: 1 },
                                                    { minWidth: 1200, cols: 2 },
                                                ]} >
                                                    <div>
                                                        <Flex gap={10}>
                                                            <Text size={15} fw={500}>Recurring Amount:</Text>
                                                            <Text size={15}>
                                                                <CurrencyFormat value={order?.amount} displayType={'text'} suffix=' USD' thousandSeparator={true} prefix={'$'} />
                                                            </Text>
                                                        </Flex>
                                                    </div>

                                                    <div>
                                                        <Flex gap={10}>
                                                            <Text size={15} fw={500}>Registration Date:</Text>
                                                            <Text size={15}>{dateFormat(order?.createdAt, "mediumDate")}</Text>
                                                        </Flex>
                                                    </div>

                                                    <div>
                                                        <Flex gap={10}>
                                                            <Text size={15} fw={500}>Due Date:</Text>
                                                            <Text size={15}>{dateFormat(order?.renewalDate, "mediumDate")}</Text>
                                                        </Flex>
                                                    </div>

                                                    <div>
                                                        <Flex gap={10}>
                                                            <Text size={15} fw={500}>Billing Cycle:</Text>
                                                            <Text size={15}>{connections.firstWhere('value', order?.period).label}</Text>
                                                        </Flex>
                                                    </div>

                                                    <div>
                                                        <Flex gap={10}>
                                                            <Text size={15} fw={500}>Payment Method:</Text>
                                                            <Text size={15}>{Ucword(order?.paymentMethod)}</Text>
                                                        </Flex>
                                                    </div>



                                                </SimpleGrid>
                                            </Box>

                                            <Divider my="xs" label="Addons & Extras" />

                                            <Box>
                                                <SimpleGrid breakpoints={[
                                                    { minWidth: 'sm', cols: 1 },
                                                    { minWidth: 1200, cols: 2 },
                                                ]} >

                                                    <div>
                                                        <Flex gap={10}>
                                                            <Text size={15} fw={500}>BackUp:</Text>
                                                            <Group spacing={5}>


                                                                <Switch
                                                                    checked={order?.withBackup}
                                                                    onLabel="Enabled" offLabel="Disabled"
                                                                />
                                                                <Popover width={200} position="top" withArrow shadow="md">
                                                                    <Popover.Target>
                                                                        <ActionIcon>
                                                                            <AiOutlineInfoCircle size={18} />
                                                                        </ActionIcon>
                                                                    </Popover.Target>
                                                                    <Popover.Dropdown className=' space-y-4'>
                                                                        <Text size="sm">Backups are renewed automatically with the current hosting plan, cancelling it will take effect on the next renewal.</Text>
                                                                    </Popover.Dropdown>
                                                                </Popover>

                                                            </Group>

                                                        </Flex>
                                                    </div>

                                                </SimpleGrid>
                                            </Box>
                                        </Box>
                                    </SimpleGrid>

                                    <Box>

                                    </Box>
                                </Box>
                            </Tabs.Panel>

                            <Tabs.Panel value="password" pt="xs">
                                <PasswordComponent {...order} />
                            </Tabs.Panel>

                            <Tabs.Panel value="settings" pt="xs">
                                <Box className='p-4'>
                                    <Center maw={400} h={300} mx="auto">
                                        <Box className=' flex justify-center flex-col space-y-3'>
                                            <UpgradeIcon className=' w-16 h-16 fill-gray-500 mx-auto' />
                                            <Text>No upgrade is available for this plan.</Text>
                                        </Box>
                                    </Center>
                                </Box>
                            </Tabs.Panel>
                        </Tabs>
                    </Paper>
                </Container>
            </WithTheme>
        </>
    )
}

export default Detail

export async function getServerSideProps(context: any) {
    let { req, res }: ServerSideProps = context

    let session: any = await AuthCheck(req, res)

    let customer = session.customer[0]
    middleChecker(req, res, customer)

    let id = session.customer[0]._id;

    let orderDetail: any = await OrderDetails(context)

    if (!_.isEqual(orderDetail.status, "active")) {
        return {
            redirect: {
                destination: '/hosting',
                permanent: false,
            },
        }
    }


    if (_.isEmpty(session)) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    return {
        props: {
            orderDetail,
            session,
        },
    }
}
