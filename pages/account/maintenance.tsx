import { Box, Button, Container, Paper, Text, Title } from '@mantine/core'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _ from 'lodash'
import { ServerSideProps } from '../../Types/ServerInterface'
import { AuthCheck } from '../../node/AuthCheck'
import Head from 'next/head'
import { DataTable } from 'mantine-datatable'
import { GrHostMaintenance } from 'react-icons/gr'
import { IconTool } from '@tabler/icons'
import { VscServerProcess } from 'react-icons/vsc'
import middleChecker from '../../node/middleChecker'

function Maintenance() {
  return (
    <div className=" min-h-[40vh] mb-16">
      <div className="flex flex-col min-h-[200px]">
        <Paper className="flex flex-col min-h-[200px] border">
          <DataTable
            columns={[{ accessor: 'serverId' }, { accessor: 'product' }, { accessor: 'date' }, { accessor: 'action' }]}
            minHeight={300}
            records={[]}
            horizontalSpacing={"xl"}
            verticalSpacing={"sm"}
            noRecordsIcon={
              <Box
                p={4}
                mb={4}

              >
                <VscServerProcess size={80} />
              </Box>
            }
            noRecordsText="No records found"
          // ...
          />
        </Paper>
      </div>
    </div>
  )
}

let pageLout = Maintenance

Maintenance.getLayout = function getLayout(page: any) {
  return (
    <WithTheme props={page.props}>
      <Head>
        <title>Maintenance - HostSpacing</title>
      </Head>
      <TabLayout
        title={'Maintenance'}
        buttonAction={<div className="h-[36px]"></div>}
      >
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
