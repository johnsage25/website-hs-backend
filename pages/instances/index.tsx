import React, { useEffect, useState } from 'react'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import _ from 'lodash'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { WithTheme } from '../_Layout/HocLayout'
import { ActionIcon, Anchor, Avatar, Badge, Box, Button, Container, Flex, Group, HoverCard, Image, Menu, Paper, Progress, SimpleGrid, Text, TextInput, Title } from '@mantine/core'
import middleChecker from '../../node/middleChecker'
import { GetOrders } from '../../node/GetOrders'
import { DataTable } from 'mantine-datatable'
import { VscServerEnvironment } from 'react-icons/vsc'
import { trpc } from '../../utils/trpc'
import { IconDots } from '@tabler/icons-react'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { Ucword } from '../../Components/TextFormatter'
import { GetVmOrders } from '../../node/GetVmOrders'
import { PaginationInterface } from '../../Types/PaginationInterface'
import { useRouter } from 'next/router'
import { io } from "socket.io-client";
import { toast } from 'react-hot-toast'

interface WithThemeProps {
  primaryColor: string
}

function Index(props: AppProps | any | WithThemeProps) {

  console.log(props.orders);

  const utils = trpc.useContext();
  const [progressState, setprogress] = useState<{
    customerId?: string
    status?: string
    orderId?: string
    message?: string
    percent?: number
  }>()

  useEffect(() => {

    const socket = io("http://localhost:3000", { transports: ['websocket'] });
    socket.on("message", (event) => {
      setprogress(event)
      console.log(event);
      if (event.percent >= 100) {
        setTimeout(() => {
          setprogress(undefined)
          utils.node.list.invalidate()
        }, 500);
      }
    });
  }, [])



  const [tableList, settableList] = useState<any[]>(props.orders)
  const serverActionMutation = trpc.node.serverAction.useMutation()

  const [page, setPage] = useState(1);
  const router = useRouter()
  const PAGE_SIZE = 15;

  let query: PaginationInterface = {
    page: page,
    searchString: {},
    limit: PAGE_SIZE,
    populate: [
      { path: "node" },
      { path: "region" },
      { path: "customer" },
      { path: "sshKey" },
      { path: "vmcreationstatus" }
    ],
    sort: { createdAt: -1 },
  }

  let listQuery = trpc.node.list.useQuery(query, {
    onSettled(data: any, error) {
      settableList(data.docs)
    },
    onError(err) {

    },
  })


  const tableQueryP: any = listQuery.data || []

  const columns: any = [
    {
      accessor: 'hostname', width: 300, title: "Label", render: (row: any) => {

        return (
          <>
            <Group>
              <HoverCard width={330} shadow="sm" withArrow position='bottom-start' withinPortal>
                <HoverCard.Target>
                  <Anchor href={`/instances/node/${row.id}`}>{row.hostname}</Anchor>
                </HoverCard.Target>
                <HoverCard.Dropdown className=' divide-y'>
                  <SimpleGrid cols={2} className='py-1'>
                    <div >
                      <Text fw={600} size={13} className='pb-1'>Image</Text>
                      <Flex gap={5}>
                        <Avatar size={20} radius="md" src={`/images/os/icon-${row.osType}.svg`} alt="Random image" />
                        <Text size={12}>{Ucword(row.osType)} {row.osVersion}</Text>
                      </Flex>
                    </div>
                    <div className='border-l pl-3'>
                      <Text fw={600} size={13} className='pb-1'>Region</Text>
                      <Text size={12}>{Ucword(row.region[0].locationName)} {row.region[0].name}</Text>
                    </div>
                  </SimpleGrid>

                  <SimpleGrid cols={2} className='py-1'>
                    <div >
                      <Text fw={600} size={13} className='pb-1'>Size</Text>
                      <Text size={12}>{row.node.storage}{row.node.storageFormat.toUpperCase()} {row.node.storageType}</Text>
                    </div>
                    <div className='border-l pl-3'>
                      <Text fw={600} size={13} className='pb-1'>Bandwidth</Text>
                      <Text size={12}>{row.node.bandwidth}{row.node.bandwidthType.toUpperCase()}</Text>
                    </div>
                  </SimpleGrid>

                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
          </>
        )
      }
    },

    {
      accessor: 'Plan', title: "Plan", render: (row: any) => {
        return (
          <Text fz={13}>{row.node.vcpu} vCpu / {row.node.memory} {row.node.memoryType.toUpperCase()}</Text>
        )
      }
    },
    { accessor: 'publicIp', title: "In Address" },
    {
      accessor: 'Region', title: "Region", render: (row: any) => {
        return (
          <>
            {row.region[0].locationName}
          </>
        )
      }
    },
    {
      accessor: 'status', width: 150, title: "Status", render: (row) => {

        return (
          <>

            {
              !_.isEmpty(progressState) && _.isEqual(progressState?.orderId, row._id) ?
                <>
                  <Progress size={"sm"} value={_.isEqual(progressState?.orderId, row._id) ? progressState?.percent : 0} striped animate />

                </> :
                <>
                  <Badge size="sm" variant="outline">{row.status}</Badge>
                </>}

          </>
        )
      }
    },
    {
      accessor: 'action', title: "", width: 80, render: (row: any) => {


        return (
          <>
            <Group position='right'>
              <Menu shadow="md" width={200} position="bottom-end" offset={7} withArrow withinPortal >
                <Menu.Target>
                  <ActionIcon disabled={!_.isEqual(row.status, "active")}><IconDots color='#000' size={20} /></ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {

                      serverActionMutation.mutate({ action: "shutdown", orderId: row._id }, {
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
                    }}
                  >Power Off</Menu.Item>
                  <Menu.Item onClick={() => {
                    serverActionMutation.mutate({ action: "reboot", orderId: row._id }, {
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
                  }}>Reboot</Menu.Item>
                  <Menu.Item>Launch Console</Menu.Item>
                  <Menu.Item >Terminate</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </>
        )
      }
    },
  ]

  return (
    <>
      <Head>
        <title>Instance</title>
      </Head>

      <WithTheme props={props}>
        <div className="">
          <Container size={'xl'} className="px-12 space-y-4">



            {_.isEmpty(props?.orders) ? <div className=" flex justify-center flex-col text-center space-y-4 max-w-lg mt-20 mx-auto py-6">
              <div className="mx-auto bg-azure-radiance-500 w-28 h-28 p-5 rounded-full">
                {/* <HostingIcon className=" w-full h-full mx-auto" /> */}
              </div>
              <Text fw={600} size={30}>
                Nodes
              </Text>
              <Text size={18} fw={500}>
                Virtual Machines based on the cloud
              </Text>
              <Text size={16} className=" text-gray-600 mb-8">
                Use a scalable and dependable platform to host your websites, applications, or any other cloud-based workloads.
              </Text>
              <Button
                radius={'xl'}
                component="a"
                // href={`${utilConst.frontUrl}/web-hosting`}
                className=" bg-azure-radiance-500 hover:bg-azure-radiance-600 w-60 mx-auto mt-6"
                fullWidth={false}
              >
                Order New
              </Button>
            </div> : <>

              <Box className=' space-y-6'>
                <Group position='apart'>
                  <Title order={3}>Nodes (VPS)</Title>
                  <TextInput
                    placeholder="Filter"
                    radius={"xl"}
                  // width={400}
                  />
                </Group>

                <Paper className=' min-h-[40vh] border'>
                  <DataTable
                    columns={columns}
                    records={tableList}
                    horizontalSpacing={"xl"}
                    minHeight={300}
                    fetching={listQuery.isLoading}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    totalRecords={tableQueryP?.totalDocs}
                    recordsPerPage={PAGE_SIZE}
                    noRecordsIcon={
                      <Box
                        p={4}
                        mb={4}

                      >
                        <VscServerEnvironment size={60} />
                      </Box>
                    }


                  />
                </Paper>
              </Box>
            </>}




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

  let customer = session.customer[0]
  middleChecker(req, res, customer)

  let orders = await GetVmOrders(context, id)


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
      orders,
    },
  }
}
