import React, { useState } from 'react'
import { ServerSideProps } from '../../../Types/ServerInterface'
import { AuthCheck } from '../../../node/AuthCheck'
import { OrderDetails } from '../../../node/OrderDetails'
import _ from 'lodash'
import { WithTheme } from '../../_Layout/HocLayout'
import { NextPage } from 'next'
import { Badge, Box, Container, Flex, Group, Paper, SimpleGrid, Tabs, Title } from '@mantine/core'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { IconWorldWww } from '@tabler/icons-react'
import { IconPlugConnected } from '@tabler/icons-react'
import WorldwideIcon from '../../../Components/icons/WorldwideIcon'
import DetailBlock from './_Unit/DetailBlock'
import WhoisBlock from './_Unit/WhoisBlock'
import Head from 'next/head'
import DNSManagement from './_Unit/DNSManagement'
import { BsShieldShaded } from 'react-icons/bs'
import { IconShield } from '@tabler/icons'
import TransferBlock from './_Unit/TransferBlock'
import { IconArrowsTransferUp } from '@tabler/icons-react'
import { BiTransfer } from 'react-icons/bi'
import { trpc } from '../../../utils/trpc'
import { toast } from 'react-hot-toast'
import middleChecker from '../../../node/middleChecker'
const sslCertificate = require('get-ssl-certificate')

const StatusBlock = (order) => {
    switch (order.status) {
        case "active":
            return (
                <>
                    <Badge size="md" variant="filled">{order.status}</Badge>
                </>
            )
        case "suspended":
            return (
                <>
                    <Badge size="md" color="red" variant="filled">{order.status}</Badge>
                </>
            )
        case "overdue":
            return (
                <>
                    <Badge size="md" color="teal" variant="filled">{order.status}</Badge>
                </>
            )
        case "fraud":
            return (
                <>
                    <Badge size="md" color="red" variant="filled">{order.status}</Badge>
                </>
            )
        case "cancelled":
            return (
                <>
                    <Badge size="md" color="gray" variant="filled">{order.status}</Badge>
                </>
            )
        default:

            return (
                <>
                    <Badge size="md" color="orange" variant="filled">{order.status}</Badge>
                </>
            )
    }
}

const Details = (props: any) => {

    const [order, setorder] = useState<any>(props?.orderDetail)

    trpc.orders.asyncOrder.useQuery({ id: order.id }, {
        onSuccess(data) {
            // console.log('====================================');
            // console.log(data);
            // console.log('====================================');
            setorder(data)
        },
        onError(err) {
            toast.error("Unknow error occured.")
        },
    })



    return (
        <>
            <Head>
                <title>Manage {order?.domain}</title>
            </Head>
            <WithTheme props={props}>
                <Container size={'xl'} className="px-12 space-y-4">
                    <Group>
                        <Flex gap={10} className=' items-center'>
                            <WorldwideIcon className=' w-6 h-6' />
                            <Title order={3}> {order?.domain}</Title>
                        </Flex>

                        <StatusBlock {...order} />
                    </Group>

                    <Paper className=' border min-h-[70vh]'>
                        <Tabs keepMounted={false} orientation="vertical" defaultValue="details">
                            <Tabs.List className='w-1/5  min-h-[70vh] tab-domain'>
                                <Tabs.Tab className='p-3 px-4' value="details" icon={<AiOutlineInfoCircle size="1.2rem" />}>Details</Tabs.Tab>
                                <Tabs.Tab className='p-3 px-4' value="whois-management" icon={<IconWorldWww size="1.3rem" />}>WHOIS Management</Tabs.Tab>
                                <Tabs.Tab className='p-3 px-4' value="dns-management" icon={<IconPlugConnected size="1.3rem" />}>DNS Management</Tabs.Tab>
                                <Tabs.Tab className='p-3 px-4' value="transfer" icon={<BiTransfer size="1.3rem" />}>Transfer</Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="details" p="md">
                                <DetailBlock {...order} />
                            </Tabs.Panel>

                            <Tabs.Panel value="whois-management" p="md">
                                <WhoisBlock {...order} />
                            </Tabs.Panel>

                            <Tabs.Panel value="dns-management" p="md">
                                <DNSManagement {...order} />
                            </Tabs.Panel>

                            <Tabs.Panel value="transfer" p="md">
                                <TransferBlock {...order} />
                            </Tabs.Panel>
                        </Tabs>
                    </Paper>
                </Container>
            </WithTheme>
        </>
    )
}

export default Details

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
                destination: '/domains',
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
            // domainSSL,
            session,
        },
    }
}
