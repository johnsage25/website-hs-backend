import { Box, Button, Container, Paper } from '@mantine/core'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _ from 'lodash'
import Head from 'next/head'
import { DataTable } from 'mantine-datatable'
import {BiTransferAlt} from "react-icons/bi"
import { IconArrowsTransferDown } from '@tabler/icons-react'
import middleChecker from '../../node/middleChecker'

function ServiceTransfer() {
  return (
    <div className=" min-h-[40vh] mb-16">
       <Paper  className="w-full min-h-[100px] px-4 border">
        <Box sx={{ height: 300 }}>
          <DataTable
            columns={[
              { accessor: 'customerId' },
              { accessor: 'product', width: 150 },
              { accessor: 'recieverId' },
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
                <IconArrowsTransferDown size={80} strokeWidth={1.5} />
              </Box>
            }
            noRecordsText="No records found"
          />

        </Box>
      </Paper>
    </div>
  )
}

let pageLout = ServiceTransfer

ServiceTransfer.getLayout = function getLayout(page: any) {
  return (
    <WithTheme props={page.props}>
      <Head>
        <title>Make Service Transfer - HostSpacing</title>
      </Head>
      <TabLayout
        title={'Service Transfer'}
        buttonAction={
          <Button className=" bg-lochmara-400" radius={'xl'}>
            Make Service Transfer
          </Button>
        }
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
