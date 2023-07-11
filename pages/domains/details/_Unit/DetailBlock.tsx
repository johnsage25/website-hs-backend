import { ActionIcon, Alert, Box, Button, Flex, Group, Paper, SimpleGrid, Switch, Text, Title, Tooltip } from '@mantine/core'
import React, { useState } from 'react'
import { BsInfoCircle } from 'react-icons/bs';
import { FiChrome } from 'react-icons/fi';
import { MdOutlineDns } from 'react-icons/md';
import CurrencyFormat from 'react-currency-format';
import dateFormat, { masks } from "dateformat";
import { Ucword } from '../../../../Components/TextFormatter';
import { IconAlertCircle } from '@tabler/icons';
import StatisticsIcon from '../../../../Components/icons/StatisticsIcon';
import StatisticsIconColored from '../../../../Components/icons/StatisticsIconColored';
import { trpc } from '../../../../utils/trpc';
import { toast } from 'react-hot-toast';
const moment = require('moment');

const DetailBlock = (order: any) => {

    // console.log(order);
    const today = moment();
    const dueDate = moment(order?.renewalDate, 'YYYY-MM-DD');
    const remainingDays = dueDate.diff(today, 'days');
    const [domainPrivacy, setdomainPrivacy] = useState(order?.domainPrivacy)
    const updateDomainIDMutation = trpc.domainManager.updateDomainID.useMutation()
    const utils = trpc.useContext()

    return (
        <Box className='px-6'>
            <Group position='apart' className='border-b pb-4'>
                <Title order={3} className=' font-light'>Overview</Title>
                <Flex gap={4} align={"center"}>
                    <Button radius={"xl"} variant='default'>
                        Renew Domain
                    </Button>
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

                </Flex>
            </Group>
            <Box className='mt-6 mb-5 space-y-4'>
                <SimpleGrid

                    breakpoints={[
                        { minWidth: 'sm', cols: 2 },
                        { minWidth: 'md', cols: 3 },
                        { minWidth: 1200, cols: 2 },
                    ]}
                >
                    <div className='space-y-4 '>
                        <Box>
                            <Text size={16} fw={600}>Service Group:</Text>
                            <Text>Domain Name Registration</Text>
                        </Box>

                        <Box>
                            <Text size={16} fw={600}>First Payment Amount:</Text>
                            <Text><CurrencyFormat value={order.initAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} /> </Text>
                        </Box>

                        <Box>
                            <Text size={16} fw={600}>Registration Date:</Text>
                            <Text>{dateFormat(order?.createdAt, "mediumDate")}</Text>
                        </Box>


                        <Box>
                            <Text size={16} fw={600}>Service Name:</Text>
                            <Text>{order?.domain}</Text>
                        </Box>

                        <Box>
                            <Text size={16} fw={600}>Payment Period:</Text>
                            <Text>Yearly</Text>
                        </Box>
                        {/*
                        <Box>
                            <Text size={16} fw={600}>Services Status:</Text>
                            <Text>{Ucword(order.status)}</Text>
                        </Box> */}

                    </div>
                    <div className='space-y-4'>

                        <Box>
                            <Text size={16} fw={600}>Recurring Amount:</Text>
                            <Text><CurrencyFormat value={order.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} /> </Text>
                        </Box>
                        <Box>
                            <Text size={16} fw={600}>Next Due Date:</Text>
                            <Text>{dateFormat(order?.renewalDate, "mediumDate")}</Text>
                        </Box>

                        <Box>
                            <Text size={16} fw={600}>Payment Method:</Text>
                            <Text>{Ucword(order?.paymentMethod)}</Text>
                        </Box>

                        <Box>
                            <Text size={16} fw={600}>Remaining days:</Text>
                            <Text>{remainingDays}</Text>
                        </Box>

                        <Box>
                            <Text size={16} fw={600}>Service Period:</Text>
                            <Text>{order?.term} Year(s)</Text>
                        </Box>
                    </div>
                </SimpleGrid>

                <Paper shadow="xs" p="md" withBorder>
                    <Flex gap={10}>
                        <StatisticsIconColored className=" w-14 h-14" />
                        <div className='space-y-2'>
                            <Text size={'sm'}>Take back control with HostSpacing powerful web analytics platform that gives you 100% data ownership.</Text>
                            <Button component='a' href='https://analytics.hostspacing.com/' target='_blank' size="xs" variant='default' radius={"xl"}>Get Started</Button>
                        </div>
                    </Flex>

                </Paper>
            </Box>

            <Box className='border-t py-4'>
                <SimpleGrid

                    breakpoints={[
                        { minWidth: 'sm', cols: 2 },
                        { minWidth: 'md', cols: 3 },
                        { minWidth: 1200, cols: 4 },
                    ]}
                >
                    <div>
                        <Switch
                            label="ID Protection"
                            checked={domainPrivacy}
                            onChange={(event) => {


                                setdomainPrivacy(event.currentTarget.checked)

                                updateDomainIDMutation.mutate({ orderId: order.id, domain: order.domain, status: event.currentTarget.checked }, {
                                    onSuccess(data: any) {
                                        toast.success("Domain Privacy updated")
                                        utils.orders.asyncOrder.invalidate()
                                    },
                                    onError(error) {
                                        // console.log(error);
                                        toast.error("Unable to update domain privacy")
                                    },
                                })
                            }}
                        />
                    </div>
                    <div></div>
                </SimpleGrid>
            </Box>
        </Box>
    )
}

export default DetailBlock