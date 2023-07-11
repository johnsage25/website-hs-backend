import { Box, Button, Container, Paper, Text, Title } from '@mantine/core'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _ from 'lodash'
import { ServerSideProps } from '../../Types/ServerInterface'
import { AuthCheck } from '../../node/AuthCheck'
import ProfileTab from '../_Layout/ProfileTab'
import Head from 'next/head'
import { DataTable } from 'mantine-datatable'
import { AiOutlineApi } from 'react-icons/ai'
import { NextPage } from 'next'
import middleChecker from '../../node/middleChecker'

function API(props: NextPage) {
  return (
    <WithTheme props={props}>
      <ProfileTab
        title={'API Tokens'}
        buttonAction={<div className="h-[36px]"></div>}
      >
        <div className=" min-h-[40vh] mb-16">
          <div className="flex flex-col min-h-[200px]">
            <Paper className="flex flex-col min-h-[200px] border">

              <DataTable
                columns={[{ accessor: 'label' }, { accessor: 'accesstoken' }, { accessor: 'created' }, { accessor: 'expires' }]}
                records={[]}
                minHeight={300}
                noRecordsIcon={
                  <Box
                    p={4}
                    mb={4}

                  >
                    <AiOutlineApi size={80} strokeWidth={1.5} />
                  </Box>
                }
                noRecordsText="No records found"
              />
            </Paper>
          </div>
        </div>
      </ProfileTab>
    </WithTheme>


  )
}

let pageLout = API

API.getLayout = function getLayout(page: any) {
  return (

    <>
      <Head>
        <title>API Tokens - HostSpacing</title>
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

  return {
    props: {
      session,
    },
  }
}
