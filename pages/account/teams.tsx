import { Box, Button, Container, Drawer, Paper } from '@mantine/core'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _ from 'lodash'
import { TeamMemberTableBlock } from '../_blocks/TeamMemberTableBlock'
import TeamButtonDrawer from '../../Components/TeamButtonDrawer'
import Head from 'next/head'
import { DataTable } from 'mantine-datatable'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { AiOutlineTeam } from 'react-icons/ai'
import middleChecker from '../../node/middleChecker'

function Teams() {
  return (
    <div className=" min-h-[40vh] mb-16">
      <Paper  className="w-full min-h-[100px] px-4 border">
        <Box sx={{ height: 300 }}>
          <DataTable
            columns={[
              { accessor: 'Username' },
              { accessor: 'email', width: 150 },
              { accessor: 'company' },
              { accessor: 'created' },
              { accessor: 'action' }
            ]}
            horizontalSpacing={"xl"}
            verticalSpacing={"sm"}
            records={[]}
            noRecordsIcon={
              <Box
                p={4}
                mb={4}

              >
                <AiOutlineTeam size={80} strokeWidth={1.5} />
              </Box>
            }
            noRecordsText="No records found"
          />

        </Box>
      </Paper>
    </div>
  )
}

let pageLout = Teams

Teams.getLayout = function getLayout(page: any) {
  return (
    <WithTheme props={page.props}>
      <Head>
        <title>Team Members - HostSpacing</title>
      </Head>
      <TabLayout title={'Team Members'} buttonAction={<TeamButtonDrawer />}>
        {page}
      </TabLayout>
    </WithTheme>
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

  return {
    props: {
      session,
    },
  }
}
