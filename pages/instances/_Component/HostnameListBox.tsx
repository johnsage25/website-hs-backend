import { SimpleGrid, TextInput } from '@mantine/core'
import { useState } from 'react'


const HostnameListBox = ({ onChange , value, ...others }: { onChange: (item:any) => void, value:[] }) => {

    const up = value;


    const handleInputChange = (event: any, index: number) => {

        const { name, value } = event.target;


        const newInputList: any = [...up];
        newInputList[index][name] = value;
        newInputList[index][name] = value;

        onChange(newInputList)

    }



    return (
        <div>
            {value?.map((ns: any, key: number) => {
                return (
                    <SimpleGrid
                        key={key}
                        breakpoints={[
                            { minWidth: 'sm', cols: 2 },
                            { minWidth: 'md', cols: 3 },
                            { minWidth: 1200, cols: 2 },
                        ]}
                    >
                        <TextInput
                            name={`hostname`}
                            value={ns.hostname}
                            onChange={e => handleInputChange(e, key)}
                            placeholder="Enter node hostname"
                            label={`Hostname ${ns.id}`}
                            {...others}
                            size='md'
                        />

                        <TextInput
                            name={'tag'}
                            value={ns.tag}
                            onChange={e => handleInputChange(e, key)}
                            placeholder="Enter node tag"
                            label={`Tag ${ns.id}`}
                            size='md'
                        />

                    </SimpleGrid>
                )
            })}
        </div>
    )
}

export default HostnameListBox