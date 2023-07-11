import Head from 'next/head'
import React, { useState } from 'react'
import { WithTheme } from '../../_Layout/HocLayout'
import { ActionIcon, Avatar, Badge, Box, Button, Card, Container, CopyButton, Divider, Flex, Group, Image, Paper, SimpleGrid, Skeleton, Stack, Table, Tabs, Text, Title, Tooltip } from '@mantine/core'
import { AuthCheck } from '../../../node/AuthCheck'
import { ServerSideProps } from '../../../Types/ServerInterface'
import middleChecker from '../../../node/middleChecker'
import { GetVmOrders } from '../../../node/GetVmOrders'
import _ from 'lodash'
import { VmDetails } from '../../../node/VmDetails'
import dateFormat, { masks } from "dateformat";
import { AiOutlineFire, AiOutlinePoweroff, AiOutlineReload } from 'react-icons/ai'
import { VscCircleLargeOutline, VscKey, VscPlay, VscServerEnvironment, VscTerminal } from 'react-icons/vsc'
import { IconCheck, IconCopy, IconRefresh, IconTerminal2 } from '@tabler/icons'
import { BsTerminal } from 'react-icons/bs'
import StatBlock from './_Component/StatBlock'
import { Ucword } from '../../../Components/TextFormatter'
import { trpc } from '../../../utils/trpc'
import { toast } from 'react-hot-toast'
import { ProVmStatusInterface } from '../../../Types/ProVmStatusInterface'
import VmPassword from './_Component/VmPassword'
import ChangeHostname from './_Component/ChangeHostname'
import TerminalComponent from './_Component/TerminalComponent'
import CPUGraphBlock from './_Component/CPUGraphBlock'
import MemoryUsageGraph from './_Component/MemoryUsageGraph'
import StatusBadge from './_Component/StatusBadge'
import SelfPanelControl from './_Block/SelfPanelControl'
import MyLocControl from './_Block/MyLocControl'




const NodeInstance = (props: any) => {



  const [vmDetails, setvmDetail] = useState(props?.vmDetails)

  const serverActionMutation = trpc.node.serverAction.useMutation()
  const utils = trpc.useContext()



  return (
    <>
      <Head>
        <title>Payment</title>
      </Head>

      <WithTheme props={props}>
        {_.isEqual(vmDetails.connection.panel, "proxmox") && <><SelfPanelControl vmdetails={vmDetails} props={props} /></>}
        {_.isEqual(vmDetails.connection.panel, "myloc") && <><MyLocControl vmdetails={vmDetails} props={props} /></>}
      </WithTheme>
    </>
  )
}

export default NodeInstance

export async function getServerSideProps(context: any) {

  let { req, res }: ServerSideProps = context
  let session: any = await AuthCheck(req, res)

  if (_.isEmpty(session)) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const query = context.query;
  let customer = session.customer[0]
  middleChecker(req, res, customer)

  let vmDetails: any = await VmDetails(context)
  const hosturl = `http://localhost:3035/instances/`;




  if (!_.isEqual(vmDetails?.status, "active")) {
    return {
      redirect: {
        destination: '/instances',
        permanent: false,
      },
    }
  }


  return {
    props: {
      session,
      query,
      vmDetails,
      hosturl
    },
  }
}