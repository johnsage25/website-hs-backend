import React, { useState } from 'react'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import _ from 'lodash'
import Head from 'next/head'
import { WithTheme } from '../_Layout/HocLayout'
import { ActionIcon, Badge, Box, Button, Container, Flex, Group, Paper, Text, TextInput, ThemeIcon, Title, Tooltip } from '@mantine/core'
import HostingIcon from '../../Components/icons/HostingIcon'
import { Constance } from '../_Util/Constance'
import WorldwideIcon from '../../Components/icons/WorldwideIcon'
import { GetDomainOrders } from '../../node/GetDomainOrders'
import { DataTable } from 'mantine-datatable'
import { IconWorldWww } from '@tabler/icons'
import dateFormat, { masks } from "dateformat";
import CurrencyFormat from 'react-currency-format';
import collect from 'collect.js'
import { PackageTerms } from '../../utils/helpers'
import { FiChrome } from 'react-icons/fi'
import { BsInfoCircle } from 'react-icons/bs'
import { MdOutlineDns } from 'react-icons/md'
import { trpc } from '../../utils/trpc'
import { PaginationInterface } from '../../Types/PaginationInterface'
import { VscSettingsGear } from 'react-icons/vsc'
import { useRouter } from 'next/router'

const Index = (props: any) => {
  const utilConst = Constance
  const [domainArray, setdomainArray] = useState(props.domainOrders)
  const [page, setPage] = useState(1);
  const router = useRouter()
  const PAGE_SIZE = 15;

  let query: PaginationInterface = {
    page: page,
    searchString: {},
    limit: PAGE_SIZE,
    sort: { createdAt: -1 },
  }

  const domainListQuery = trpc.orders.domainList.useQuery(query, {
    onSettled(data: any, error) {
      setdomainArray(data?.docs);
    },
    onError(err) {
      // console.log(err);

    },
  })

  let tableDb: any = domainListQuery.data


  const column: any = [
    {
      accessor: 'service', title: "Service", width: 300, render: (row: any) => {
        return (<>
          <Group position='apart'>
            <Text fw={600}>{row.domain}</Text>

            <Tooltip
              label="Whois details"
              color="dark"
              withArrow
            >
              <ActionIcon onClick={() => {
                window.open(`https://hostspacing.com/whois?domain=${row.domain}`, '_blank');
              }}>
                <BsInfoCircle size={16} />
              </ActionIcon>
            </Tooltip>

          </Group>
        </>)
      }
    },
    {
      accessor: 'amount', title: "Amount", render: (row: any) => {
        return (
          <><CurrencyFormat value={row?.amount} suffix={` Yearly`} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            <Text size={'sm'}></Text></>
        )
      }
    },
    {
      accessor: 'createdAt', width: 150, title: "Created At", render: (row: any) => {
        return (
          <>{dateFormat(row?.createdAt, "mediumDate")}</>
        )
      }
    },
    {
      accessor: 'duedate', width: 150, title: "Due Date", render: (row: any) => {
        return (
          <>{dateFormat(row?.renewalDate, "mediumDate")}</>
        )
      }
    },
    {
      accessor: 'status', title: "Status", width: 110, render: (row: any) => {
        switch (row.status) {
          case "active":
            return (
              <>
                <Badge size="sm" variant="filled">{row.status}</Badge>
              </>
            )
          case "suspended":
            return (
              <>
                <Badge size="sm" color="red" variant="filled">{row.status}</Badge>
              </>
            )
          case "overdue":
            return (
              <>
                <Badge size="sm" color="teal" variant="filled">{row.status}</Badge>
              </>
            )
          case "fraud":
            return (
              <>
                <Badge size="sm" color="red" variant="filled">{row.status}</Badge>
              </>
            )
          case "cancelled":
            return (
              <>
                <Badge size="sm" color="gray" variant="filled">{row.status}</Badge>
              </>
            )
          default:

            return (
              <>
                <Badge size="sm" color="orange" variant="filled">{row.status}</Badge>
              </>
            )
        }
      },
    },
    {
      accessor: 'actions',
      title: <></>,
      textAlignment: 'right',
      render: (row) => (
        <Group spacing={4} position="right" noWrap>
          <Button disabled={!_.isEqual(row.status, "active")} variant="outline" onClick={() => {
            let url: any = `/domains/details/${row.id}`;
            router.push(url)
          }} size="xs" radius={"xl"} leftIcon={<VscSettingsGear />}>Manage</Button>
        </Group>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>Hosting</title>
      </Head>

      <WithTheme props={props}>
        <div className="">
          <Container size={'xl'} className="px-12 space-y-4">
            {/* <Paper className="py-32"></Paper> */}
            {!_.isEmpty(props?.domainOrders) ? <>

              <Box className=' space-y-6'>
                <Group position='apart'>
                  <Title order={3}>Domains</Title>
                  <TextInput
                    placeholder="Filter"
                    radius={"xl"}
                  // width={400}
                  />
                </Group>

                <Paper className=' min-h-[40vh] border'>
                  <DataTable
                    minHeight={400}
                    horizontalSpacing={"xl"}
                    striped
                    columns={column}
                    fetching={domainListQuery.isLoading}
                    records={domainArray}
                    totalRecords={tableDb?.totalDocs}
                    recordsPerPage={PAGE_SIZE}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    noRecordsIcon={
                      <Box
                        p={4}
                        mb={4}

                      >
                        <WorldwideIcon className=' w-16 h-16' strokeWidth={1} />
                      </Box>
                    }
                    noRecordsText="You don&apos;t have a domain name yet."
                  />
                </Paper>
              </Box>


            </> :
              <>
                <div className=" flex justify-center flex-col text-center space-y-4 max-w-lg mt-20 mx-auto py-6">
                  <div className="mx-auto bg-azure-radiance-500 w-28 h-28 p-5 rounded-full">
                    <WorldwideIcon className=" w-full h-full mx-auto fill-gray-50" />
                  </div>
                  <Text fw={600} size={30}>
                    Domains
                  </Text>
                  <Text size={18} fw={500}>
                    Domain Registration
                  </Text>
                  <Text size={16} className=" text-gray-600 mb-8">
                    You don&apos;t have a domain name yet.
                  </Text>
                  <Button
                    radius={'xl'}
                    component="a"
                    href={`${utilConst.frontUrl}/web-hosting`}
                    className=" bg-azure-radiance-500 hover:bg-azure-radiance-600 w-60 mx-auto mt-6"
                    fullWidth={false}
                  >
                    Register New
                  </Button>
                </div>
              </>
            }
          </Container>
        </div>
      </WithTheme>
    </>
  )
}

export default Index

export async function getServerSideProps(context: any) {
  let { req, res }: ServerSideProps = context
  let session: any = await AuthCheck(req, res)

  let id = session.customer[0]._id;

  let domainOrders: any = await GetDomainOrders(context, id)

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
      domainOrders,
      session,
    },
  }
}
