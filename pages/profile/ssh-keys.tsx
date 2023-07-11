import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Table,
  Text,
  Title,
  Tooltip,
  createStyles,
  useMantineTheme,
} from '@mantine/core'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _, { truncate } from 'lodash'
import { ServerSideProps } from '../../Types/ServerInterface'
import { AuthCheck } from '../../node/AuthCheck'
import ProfileTab from '../_Layout/ProfileTab'
import { useState } from 'react'
import AddSSHBlock from '../_blocks/AddSSHBlock'
import { trpc } from '../../utils/trpc'
import dateFormat, { masks } from 'dateformat'
import TimeAgo from 'react-timeago'
import { toast } from 'react-hot-toast'
import { BsShieldLock, BsTerminal } from 'react-icons/bs'
import { GoTerminal } from 'react-icons/go'
import Head from 'next/head'
import { DataTable } from 'mantine-datatable';
import { IconBrandTabler } from '@tabler/icons-react'
import { IconEdit, IconTrash } from '@tabler/icons'
import { openConfirmModal } from '@mantine/modals'
import EditSSHBlock from '../_blocks/EditSSHBlock'
import { NextPage } from 'next'
import middleChecker from '../../node/middleChecker'

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    padding: 10,
    zIndex: 10,
    backgroundColor: '#f8fafc',
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[2]
        }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}))

interface TableScrollAreaProps {
  data: {
    key: string
    label: string
    customer: any
    fingerprint: any
    updatedAt: string
    _id: string
    createdAt: string
  }[]
}



function SSHkeys(props: any) {
  const sshListQuery: any = trpc.profile.sshlist.useQuery()
  const theme = useMantineTheme()
  // console.log(sshListQuery.data);
  const [modal, setmodal] = useState(false)
  const removeSSHMutation = trpc.profile.removeSSH.useMutation()
  const utils = trpc.useContext()

  return (
    <WithTheme props={props}>
      <ProfileTab title={'SSH Keys'} buttonAction={<AddSSHBlock />}>
        <div className=" min-h-[30vh] mb-16">
          <div className="flex flex-col min-h-[200px]">
            <Paper className="flex flex-col min-h-[200px] bg-white border">

              <Box sx={{ height: 300 }}>
                <DataTable
                  horizontalSpacing={"xl"}
                  columns={[{
                    accessor: 'label', title: "Label", render(record, index) {
                      return (
                        <>
                          <Tooltip multiline={true} withinPortal label={<Text>{record.label}</Text>}>
                            <Text>
                              {truncate(record.label, {
                                length: 20,
                                omission: '...',
                              })}
                            </Text>
                          </Tooltip>
                        </>
                      )
                    },
                  }, {
                    accessor: 'key', render(record: any, index) {
                      return (
                        <>
                          <Text className=" text-gray-600">
                            {truncate(record.key, {
                              length: 28,
                              omission: '',
                            })}
                          </Text>
                          <Text className=" text-green-700">Fingerprint: {record.fingerprint}</Text></>
                      )
                    },
                  }, {
                    accessor: 'created', render(record: any, index) {
                      return (
                        <>
                          <Text>{dateFormat(record.createdAt, 'ddd mmm d, yyyy, h:MM TT')}</Text>
                        </>
                      )
                    },
                  }, {
                    accessor: 'action', render: (record: any) => {

                      return (
                        <Group spacing={4} position="right" noWrap>
                          <EditSSHBlock record={record} />

                          <ActionIcon loading={removeSSHMutation.isLoading} color="red" onClick={() => {
                            openConfirmModal({
                              title: 'Delete SSH Key',
                              children: (
                                <div className='py-4'>
                                  <Text size="sm">
                                    Do you really want to remove SSH key {record.label}?
                                  </Text>
                                </div>
                              ),
                              cancelProps: {
                                radius: "xl"
                              },
                              overlayProps: {
                                color: theme.colorScheme === 'dark'
                                  ? theme.colors.dark[9]
                                  : theme.colors.gray[2],
                                opacity: 0.55,
                                blur: 3
                              },
                              confirmProps: { className: " bg-red-500 hover:bg-red-600", radius: "xl" },
                              labels: { confirm: 'Confirm', cancel: 'Cancel' },
                              onCancel: () => { },
                              onConfirm: () => {
                                removeSSHMutation.mutate(
                                  { id: record._id },
                                  {
                                    onSuccess(data: any, variables, context) {
                                      // console.log(data)
                                      utils.profile.sshlist.prefetch()

                                    },
                                    onError(error, variables, context) {
                                      toast.error(`Unabled to delete SSH Key ${record.label}`)
                                    },
                                  },
                                )
                              },
                            });
                          }}>
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>)
                    },
                  }]}
                  records={sshListQuery?.data}
                  noRecordsIcon={
                    <Box
                      p={4}
                      mb={4}

                    >
                      <IconBrandTabler size={80} strokeWidth={1.5} />
                    </Box>
                  }
                  noRecordsText="No items to display"
                />
              </Box>


            </Paper>
          </div>
        </div>
      </ProfileTab>
    </WithTheme>


  )
}

let pageLout = SSHkeys

SSHkeys.getLayout = function getLayout(page: any) {
  return (

    <>
      <Head>
        <title>SSH Keys - HostSpacing</title>
      </Head>

      {page}

    </>


  )
}

export default pageLout

export async function getServerSideProps({ req, res }: ServerSideProps) {
  let session: any = await AuthCheck(req, res)

  if (_.isEmpty(session)) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  let customer = session.customer[0]
  middleChecker(req, res, customer)

  var gravatar = require('gravatar')
  let image_url = gravatar.url(session?.customer[0].email, {
    s: '200',
    r: 'pg',
    d: '404',
  })

  return {
    props: {
      session,
      image_url,
    },
  }
}
