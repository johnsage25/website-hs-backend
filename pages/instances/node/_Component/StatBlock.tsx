import { Group, Progress, Text } from '@mantine/core'
import React from 'react'
import { ProVmStatusInterface } from '../../../../Types/ProVmStatusInterface'
import convertSize from "convert-size";
var bytes = require('bytes');
import moment from 'moment'
import dateFormat, { masks } from "dateformat";
import _ from 'lodash';


function format_time(s) {
    const dtFormat = new Intl.DateTimeFormat('en-GB', {
        timeStyle: 'medium',
        timeZone: 'UTC'
    });

    return dtFormat.format(new Date(s * 1e3));
}


const StatBlock = ({ details, vmOrder }: { details?: ProVmStatusInterface | any, vmOrder:any }) => {


    return (
        <div>
            <div className='py-4 px-6'>
                <div className="grid gap-7 [&>*]:border  sm:grid-cols-2 lg:grid-cols-3">

                    <div className="p-5 bg-white rounded  dark:bg-gray-800">
                        <div className="text-base text-gray-400 dark:text-gray-300">Memory Usage</div>
                        <div className="flex items-center pt-1">
                            <Group spacing={5} className=' items-end'>
                                <Text className="text-2xl font-bold text-lochmara-500 dark:text-gray-100">
                                    {bytes((details?.mem | 0), { fixedDecimals: 1 })}
                                </Text> /
                                <Text> {bytes(details?.maxmem )}</Text>
                            </Group>

                        </div>

                    </div>


                    <div className="p-5 bg-white rounded dark:bg-gray-800">
                        <div className="text-base text-gray-400 dark:text-gray-300">
                            vCPU Usage
                        </div>
                        <div className="flex items-center pt-1">
                            <div className="text-2xl font-bold text-lochmara-500 dark:text-gray-100">
                                {(_.isUndefined(details?.cpu) ? 0 : details?.cpu * 100).toFixed(1)} %
                            </div>

                        </div>

                    </div>

                    <div className="p-5 bg-white rounded  dark:bg-gray-800">
                        <div className="text-base text-gray-400 dark:text-gray-300">
                            UpTime
                        </div>
                        <div className="flex items-center pt-1">
                            <Group spacing={5} className=' items-end'>
                                <Text>{format_time(details?.uptime | 0)}</Text>
                            </Group>

                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default StatBlock