import { Loader, LoadingOverlay, SimpleGrid, Text, UnstyledButton } from '@mantine/core'
import React, { useState } from 'react'
import EmailIcon from '../../../../Components/icons/EmailIcon'
import ForwarderIcon from '../../../../Components/icons/ForwarderIcon'
import BackupIcon2 from '../../../../Components/icons/BackupIcon2'
import FileManager from '../../../../Components/icons/FileManager'
import AddonDomain from '../../../../Components/icons/AddonDomain'
import SubDomain from '../../../../Components/icons/SubDomain'
import MysqlIcon from '../../../../Components/icons/MysqlIcon'
import ScheduleIcon from '../../../../Components/icons/ScheduleIcon'
import { trpc } from '../../../../utils/trpc'
import _ from 'lodash'
import { toast } from 'react-hot-toast'
import StatisticsIcon from '../../../../Components/icons/StatisticsIcon'

const PanelComponents = (order: any) => {
    const [selected, setSelected] = useState("")
    const panelActionMutation = trpc.hostingpanel.panelAction.useMutation({
        onSettled(data: any, variables, context) {
            if (_.isEqual(data.status, true)) {
                window.open(data.url, "_blank")
            }
            else {
                toast.error("Unable to login at this time. Try again.")
            }
        },
        onError(error, variables, context) {
            toast.error("Unknown error, please contact support.")
        },
    })

    return (
        <div>
            <SimpleGrid verticalSpacing={20} cols={4} spacing={1} className='pt-4'>
                <UnstyledButton onClick={() => {
                    setSelected("email")
                    panelActionMutation.mutate({ orderId: order.id, type: "email" })
                }} className=' hover:bg-blue-50 py-3 relative rounded-lg'>
                    <div className='flex flex-col text-center justify-center space-y-2'>

                        {_.isEqual(panelActionMutation.isLoading, true) && _.isEqual(selected, 'email') ? <div className=' w-10 h-10 mx-auto'> <Loader size={"sm"} className=' w-8 h-8 mx-auto fill-lochmara-500' /></div> : <EmailIcon className=' w-10 h-10 mx-auto fill-lochmara-500' />}

                        <Text size={15}>Mail Accounts</Text>
                    </div>
                </UnstyledButton>

                <UnstyledButton onClick={() => {
                    setSelected("statistics")
                    panelActionMutation.mutate({ orderId: order.id, type: "statistics" })
                }} className=' hover:bg-blue-50 py-3 rounded-lg'>
                    <div className='flex flex-col text-center justify-center space-y-2'>
                        {_.isEqual(panelActionMutation.isLoading, true) && _.isEqual(selected, 'statistics') ? <div className=' w-10 h-10 mx-auto'> <Loader size={"sm"} className=' w-8 h-8 mx-auto fill-lochmara-500' /></div>
                            : <StatisticsIcon className=' w-10 h-10 mx-auto fill-lochmara-500' />}

                        <Text size={15}>Statistics</Text>
                    </div>
                </UnstyledButton>

                <UnstyledButton onClick={() => {
                    setSelected("backup")
                    panelActionMutation.mutate({ orderId: order.id, type: "backup" })
                }} className=' hover:bg-blue-50 py-3 rounded-lg'>
                    <div className='flex flex-col text-center justify-center space-y-2'>
                        {_.isEqual(panelActionMutation.isLoading, true) && _.isEqual(selected, 'backup') ? <div className=' w-10 h-10 mx-auto'> <Loader size={"sm"} className=' w-8 h-8 mx-auto fill-lochmara-500' /></div>
                            : <BackupIcon2 className=' w-10 h-10 mx-auto fill-lochmara-500' />}


                        <Text size={15}>Backup</Text>
                    </div>
                </UnstyledButton>


                <UnstyledButton onClick={() => {
                    setSelected("filemanager")
                    panelActionMutation.mutate({ orderId: order.id, type: "filemanager" })
                }} className=' hover:bg-blue-50 py-3 rounded-lg'>
                    <div className='flex flex-col text-center justify-center space-y-2'>
                        {_.isEqual(panelActionMutation.isLoading, true) && _.isEqual(selected, 'filemanager') ? <div className=' w-10 h-10 mx-auto'> <Loader size={"sm"} className=' w-8 h-8 mx-auto fill-lochmara-500' /></div>
                            : <FileManager className=' w-10 h-10 mx-auto fill-lochmara-500' />}
                        <Text size={15}>File Manager</Text>
                    </div>
                </UnstyledButton>

                <UnstyledButton onClick={() => {
                    setSelected("domain")
                    panelActionMutation.mutate({ orderId: order.id, type: "domain" })
                }} className=' hover:bg-blue-50 py-3 rounded-lg'>
                    <div className='flex flex-col text-center justify-center space-y-2'>
                        {_.isEqual(panelActionMutation.isLoading, true) && _.isEqual(selected, 'domain') ? <div className=' w-10 h-10 mx-auto'> <Loader size={"sm"} className=' w-8 h-8 mx-auto fill-lochmara-500' /></div>
                            : <AddonDomain className=' w-10 h-10 mx-auto fill-lochmara-500' />}

                        <Text size={15}>Domains</Text>
                    </div>
                </UnstyledButton>

                <UnstyledButton onClick={() => {
                    setSelected("subdomain")
                    panelActionMutation.mutate({ orderId: order.id, type: "subdomain" })
                }} className=' hover:bg-blue-50 py-3 rounded-lg'>
                    <div className='flex flex-col text-center justify-center space-y-2'>
                        {_.isEqual(panelActionMutation.isLoading, true) && _.isEqual(selected, 'subdomain') ? <div className=' w-10 h-10 mx-auto'> <Loader size={"sm"} className=' w-8 h-8 mx-auto fill-lochmara-500' /></div>
                            : <SubDomain className=' w-10 h-10 mx-auto fill-lochmara-400' />}

                        <Text size={15}>Sub Domains</Text>
                    </div>
                </UnstyledButton>

                <UnstyledButton onClick={() => {
                    setSelected("database")
                    panelActionMutation.mutate({ orderId: order.id, type: "database" })
                }} className=' hover:bg-blue-50 py-3 rounded-lg'>
                    <div className='flex flex-col text-center justify-center space-y-2'>
                        {_.isEqual(panelActionMutation.isLoading, true) && _.isEqual(selected, 'database') ? <div className=' w-10 h-10 mx-auto'> <Loader size={"sm"} className=' w-8 h-8 mx-auto fill-lochmara-500' /></div>
                            : <MysqlIcon className=' w-10 h-10 mx-auto fill-lochmara-500' />}


                        <Text size={15}>Mysql Database</Text>
                    </div>
                </UnstyledButton>

                <UnstyledButton onClick={() => {
                    setSelected("scheduler")
                    panelActionMutation.mutate({ orderId: order.id, type: "scheduler" })
                }} className=' hover:bg-blue-50 py-3 rounded-lg'>
                    <div className='flex flex-col text-center justify-center space-y-2'>
                        {_.isEqual(panelActionMutation.isLoading, true) && _.isEqual(selected, 'scheduler') ? <div className=' w-10 h-10 mx-auto'> <Loader size={"sm"} className=' w-8 h-8 mx-auto fill-lochmara-500' /></div>
                            : <ScheduleIcon className=' w-10 h-10 mx-auto fill-lochmara-500' />}

                        <Text size={15}>Scheduler</Text>
                    </div>
                </UnstyledButton>

            </SimpleGrid>
        </div>
    )
}

export default PanelComponents