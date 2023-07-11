import React from 'react'
import { ServerSideProps } from '../../../Types/ServerInterface'
import { VmDetails } from '../../../node/VmDetails'
import { AuthCheck } from '../../../node/AuthCheck'
import middleChecker from '../../../node/middleChecker'
import _ from 'lodash'
import { WithTheme } from '../../_Layout/HocLayout'
import Head from 'next/head'
import { ActionIcon, Badge, Box, Button, Container, Group, Text, Title } from '@mantine/core'
import { DataTable } from 'mantine-datatable';
import { BsShieldCheck } from 'react-icons/bs'
import AddBlock from './_Component/AddBlock'
import { trpc } from '../../../utils/trpc'
import { IconEdit, IconTrash } from '@tabler/icons'
import { toast } from 'react-hot-toast'
import DeleteButton from './_Component/DeleteButton'
import EditBlock from './_Component/EditBlock'

const Firewall = (props: any) => {

    let vmdetails = props?.vmDetails

    let firewareRulesQuery = trpc.node.firewareRules.useQuery({ orderId: vmdetails._id })


    const rulesData: any = [
        { accessor: 'proto' },
        { accessor: 'pos' },
        { accessor: 'action' },
        { accessor: 'sport' },
        { accessor: "dport" },
        { accessor: 'type', title: "Type" },
        {
            accessor: 'status', title: "Status", render: (row) => {
                console.log(row.enable);

                return (<>
                    {row.enable ? <Badge>Enabled</Badge> : <Badge color='red'>Disabled</Badge>}
                </>)
            }
        },
        {
            accessor: 'actions',
            title: <Text mr="xs"></Text>,
            textAlignment: 'right',
            width: 50,
            render: (row) => (
                <Group spacing={4} position="right" noWrap>

                    <EditBlock row={row} vmDetails={vmdetails}/>
                    <DeleteButton vmdetails={vmdetails} props={row} />
                </Group>
            ),
        },
    ]

    let rulesList = firewareRulesQuery.data || []

    return (
        <>
            <Head>
                <title>Payment</title>
            </Head>

            <WithTheme props={props}>
                <Container size="70rem" className="space-y-6 relative container-config mb-16" style={{ position: "relative" }}>
                    <Group position='apart'>
                        <Title order={3}>Firewall Management</Title>
                        <AddBlock {...vmdetails} />
                    </Group>
                    <Box className='bg-white'>
                        <DataTable
                            withBorder
                            minHeight={280}
                            columns={rulesData}
                            records={rulesList}
                            horizontalSpacing={"xl"}
                            noRecordsIcon={
                                <Box
                                    p={4}
                                    mb={4}

                                >
                                    <BsShieldCheck size={50} />
                                </Box>
                            }
                            fetching={firewareRulesQuery.isLoading}
                        />
                    </Box>
                </Container>


            </WithTheme>
        </>
    )
}

export default Firewall

export async function getServerSideProps(context: any) {

    let { req, res }: ServerSideProps = context
    let session: any = await AuthCheck(req, res)

    const query = context.query;
    let customer = session.customer[0]
    middleChecker(req, res, customer)

    let vmDetails = await VmDetails(context)


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
            session,
            query,
            vmDetails,
        },
    }
}
