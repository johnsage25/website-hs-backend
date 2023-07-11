import React, { useState } from 'react'
import { trpc } from '../../../../utils/trpc'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { Card, Group, Loader, Select, Text } from '@mantine/core';
import { ChartData, RRDChartInterface } from '../../../../Types/RRDChartInterface';
import _ from 'lodash';
import dateFormat, { masks } from "dateformat";
const bytes = require('bytes');

const CPUGraphBlock = ({ vmDetails }: { vmDetails: any }) => {
    const [timeframe, settimeframe] = useState("hour")

    const [cpuchart, setdataChart] = useState<RRDChartInterface>([])
    const [memChart, setmemChart] = useState<RRDChartInterface>([])
    const [diskIOChart, setdiskIOChart] = useState<RRDChartInterface>([])
    const [networkChart, setnetworkChart] = useState<RRDChartInterface>([])

    trpc.node.cpuUsage.useQuery({ orderId: vmDetails._id, timeframe }, {
        onSuccess(data: any) {


            let chart: RRDChartInterface = data?.data || [];

            let dataChart: any = chart.map((item: ChartData) => {

                let date = new Date(item?.time * 1000);
                return {
                    cpu: !_.isUndefined(item?.cpu) ? parseFloat((item?.cpu * 100)?.toFixed(1)) : 0,
                    name: dateFormat(date, "mm/dd/yyyy HH:MM")
                };
            })
            setdataChart(dataChart)
            // memory chart

            let memChart: any = chart.map((item: ChartData) => {

                let date = new Date(item?.time * 1000);
                return {
                    mem: !_.isUndefined(item?.mem) ? item?.mem : 0,
                    name: dateFormat(date, `mm/dd/yyyy HH:MM`)
                };
            })

            setmemChart(memChart)

            let networkTranffic: any = chart.map((item: ChartData) => {

                let date = new Date(item?.time * 1000);
                return {
                    netin: !_.isUndefined(item?.netin) ? item?.netin : 0,
                    netout: !_.isUndefined(item?.netout) ? item?.netout : 0,
                    name: dateFormat(date, `mm/dd/yyyy HH:MM`)
                };
            })

            setnetworkChart(networkTranffic)

            let diskIo: any = chart.map((item: ChartData) => {

                let date = new Date(item?.time * 1000);
                return {
                    diskwrite: !_.isUndefined(item?.diskwrite) ? item?.diskwrite : 0,
                    diskread: !_.isUndefined(item?.diskread) ? item?.diskread : 0,
                    name: dateFormat(date, `mm/dd/yyyy HH:MM`)
                };
            })


            setdiskIOChart(diskIo)


            console.log(data);

        },
        onError(err) {

        },
    })

    function memformatYAxis(value) {

        return bytes(value)
    }




    return (
        <div className='px-6 space-y-8 pb-8'>
            <Group position='apart' className=''>
                <Text>Usage Graphs</Text>
                <div>
                    <Select
                        size='sm'
                        defaultValue={"hour"}
                        onChange={(e:any) => {
                            settimeframe(e)
                        }}

                        data={[
                            { value: 'hour', label: 'Hour' },
                            { value: 'day', label: 'Day' },
                            { value: 'week', label: 'Week' },
                            { value: 'month', label: 'Month' },
                            { value: 'year', label: 'Year' },
                        ]}
                    />
                </div>
            </Group>
            <Card className='border  px-4 mx-auto'>
                <Card.Section p={8}>
                    <Text>CPU Usage</Text>
                </Card.Section>
                <Card.Section withBorder>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            width={500}
                            height={450}
                            data={cpuchart}

                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={13} />
                            {/* <YAxis /> */}
                            <YAxis fontSize={13} dataKey="cpu" stroke={"30"}>

                            </YAxis>
                            <Tooltip />
                            <Area type="monotone" dataKey="cpu" strokeWidth={"2"} stroke="rgb(53, 162, 235)" fill="rgba(53, 162, 235, 0.5)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card.Section>

            </Card>

            <Card className=' border px-4 mx-auto'>
                {/* top, right, left margins are negative – -1 * theme.spacing.xl */}
                <Card.Section p={8}>Memory Usage</Card.Section>


                {/* bottom, right, left margins are negative – -1 * theme.spacing.xl */}
                <Card.Section withBorder>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            width={500}
                            height={450}
                            data={memChart}
                            className='px-3'
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={13} />
                            {/* <YAxis /> */}
                            <YAxis fontSize={11} tickFormatter={memformatYAxis} dataKey="mem" stroke={"30"}>
                                {/* <Label
                                    style={{
                                        textAnchor: "middle",
                                        fontSize: "100%",
                                        fill: "#000",
                                    }}
                                    angle={270}
                                    value={"Bytes"} /> */}
                            </YAxis>
                            <Tooltip formatter={memformatYAxis} />
                            <Area type="monotone" dataKey="mem" strokeWidth={"2"} stroke="rgb(53, 162, 235)" fill="rgba(53, 162, 235, 0.5)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card.Section>
            </Card>

            <Card className=' border px-4 mx-auto'>
                {/* top, right, left margins are negative – -1 * theme.spacing.xl */}
                <Card.Section p={8}>Network traffic</Card.Section>


                {/* bottom, right, left margins are negative – -1 * theme.spacing.xl */}
                <Card.Section withBorder>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            width={500}
                            height={450}
                            data={networkChart}

                            className='px-3'
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={13} />
                            {/* <YAxis /> */}
                            <YAxis fontSize={11} tickFormatter={memformatYAxis} stroke={"30"}>
                                {/* <Label
                                    style={{
                                        textAnchor: "middle",
                                        fontSize: "100%",
                                        fill: "#000",
                                    }}
                                    angle={270}
                                    value={"Bytes"} /> */}
                            </YAxis>
                            <Tooltip formatter={memformatYAxis} />
                            <Area type="monotone" dataKey="netin" stackId="1" stroke="#22c55e" fill="#22c55e" />
                            <Area type="monotone" dataKey="netout" stackId="1" strokeWidth={"2"} stroke="rgb(53, 162, 235)" fill="rgba(53, 162, 235, 0.5)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card.Section>
            </Card>


            <Card className=' border max-w-5xl px-4 mx-auto'>
                {/* top, right, left margins are negative – -1 * theme.spacing.xl */}
                <Card.Section p={8}>Disk IO</Card.Section>


                {/* bottom, right, left margins are negative – -1 * theme.spacing.xl */}
                <Card.Section withBorder>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            width={500}
                            height={450}
                            data={diskIOChart}

                            className='px-3'
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={13} />
                            {/* <YAxis /> */}
                            <YAxis fontSize={11} tickFormatter={memformatYAxis} stroke={"30"}>
                                {/* <Label
                                    style={{
                                        textAnchor: "middle",
                                        fontSize: "100%",
                                        fill: "#000",
                                    }}
                                    angle={270}
                                    value={"Bytes"} /> */}
                            </YAxis>
                            <Tooltip formatter={memformatYAxis} />
                            <Area type="monotone" dataKey="diskread" stackId="1" stroke="#22c55e" fill="#22c55e" />
                            <Area type="monotone" dataKey="diskwrite" stackId="1" strokeWidth={"2"} stroke="rgb(53, 162, 235)" fill="rgba(53, 162, 235, 0.5)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card.Section>
            </Card>
        </div>
    )
}

export default CPUGraphBlock