import React, { useState } from 'react'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import _ from 'lodash'
import Head from 'next/head'
import { WithTheme } from '../_Layout/HocLayout'
import { Badge, Box, Button, Container, Group, Menu, Paper, Text, TextInput, ThemeIcon, Title } from '@mantine/core'
import HostingIcon from '../../Components/icons/HostingIcon'
import { Constance } from '../_Util/Constance'
import { GetOrders } from '../../node/GetOrders'
import { DataTable } from 'mantine-datatable'
import { CiServer } from 'react-icons/ci'
import dateFormat, { masks } from "dateformat";
import CurrencyFormat from 'react-currency-format';
import collect from 'collect.js'
import { PackageTerms } from '../../utils/helpers'
import { VscSettingsGear } from 'react-icons/vsc'
import { trpc } from '../../utils/trpc'
import { PaginationInterface } from '../../Types/PaginationInterface'
import { useRouter } from 'next/router'
import middleChecker from '../../node/middleChecker'

const Index = (props: any) => {
  const utilConst = Constance
  const PAGE_SIZE = 25;

  let connections = collect(PackageTerms)
  const [orders, setorders] = useState(props?.orders)
  const [page, setPage] = useState(1);

  const router = useRouter()

  let query: PaginationInterface = {
    page: page,
    searchString: {},
    limit: PAGE_SIZE,
    sort: { createdAt: -1 },
  }
  const ordersMutation = trpc.orders.hostingList.useQuery(query, {
    onSettled(data: any, error) {
      setorders(data?.docs);
    },
    onError(err) {
      // console.log(err);

    },
  })

  // const [records, setRecords] = useState(employees.slice(0, PAGE_SIZE));


  const column = [
    {
      accessor: 'service', title: "Service", render: (row: any) => {
        return (
          <>
            <Text fw={700} size={14} className=' text-lochmara-500'>{row?.serviceName}</Text>
            <Text>{row?.domain}</Text>
          </>
        )
      }
    },
    {
      accessor: 'amount', title: "Amount", render: (row: any) => {
        return (
          <><CurrencyFormat value={row?.amount} suffix={` ${connections.firstWhere('value', row?.period).label}`} displayType={'text'} thousandSeparator={true} prefix={'$'} />
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
      accessor: '', width: 140, render: (row: any) => {

        return (
          <>
            <Button disabled={!_.isEqual(row.status, "active")} variant="outline" onClick={() => {
              let url:any = `/hosting/details/${row.id}`;
              router.push(url)
            }} size="xs" radius={"xl"} leftIcon={<VscSettingsGear />}>Manage</Button>
          </>
        )
      }
    },
  ];


  let tableD: any = ordersMutation?.data

  return (
    <>
      <Head>
        <title>Hosting</title>
      </Head>

      <WithTheme props={props}>
        <div className="">
          <Container size={'xl'} className="px-12 space-y-4">
            {/* <Paper className="py-32"></Paper> */}
            {!_.isEmpty(props?.orders) ? <>

              <Box className=' space-y-6'>
                <Group position='apart'>
                  <Title order={3}>Hosting List</Title>
                  <TextInput
                    placeholder="Filter"
                    radius={"xl"}
                  // width={400}
                  />
                </Group>
                <Paper className=' min-h-[40vh] border'>
                  <DataTable
                    minHeight={400}
                    columns={column}
                    records={orders}
                    fetching={ordersMutation.isLoading}
                    totalRecords={tableD?.totalDocs}
                    recordsPerPage={PAGE_SIZE}
                    striped
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    horizontalSpacing={"xl"}
                    noRecordsIcon={
                      <Box
                        p={4}
                        mb={4}

                      >
                        <CiServer size={80} />
                      </Box>
                    }
                    noRecordsText="No records found"
                  />
                </Paper>
              </Box>

            </> :
              <>
                <div className=" flex justify-center flex-col text-center space-y-4 max-w-lg mt-20 mx-auto py-6">
                  <div className="mx-auto bg-azure-radiance-500 w-28 h-28 p-5 rounded-full">
                    <HostingIcon className=" w-full h-full mx-auto" />
                  </div>
                  <Text fw={600} size={30}>
                    Hosting
                  </Text>
                  <Text size={18} fw={500}>
                    Cloud-based Shared Hosting
                  </Text>
                  <Text size={16} className=" text-gray-600 mb-8">
                    Use a scalable and dependable platform to host your websites,
                    applications, or any other cloud-based workloads.
                  </Text>
                  <Button
                    radius={'xl'}
                    component="a"
                    href={`${utilConst.frontUrl}/web-hosting`}
                    className=" bg-azure-radiance-500 hover:bg-azure-radiance-600 w-60 mx-auto mt-6"
                    fullWidth={false}
                  >
                    Order New
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

  let customer = session.customer[0]
  middleChecker(req, res, customer)

  let id = session.customer[0]._id;

  let orders = await GetOrders(context, id)

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
      orders,
      session,
    },
  }
}
