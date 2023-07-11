import { Card } from '@mantine/core'
import React from 'react'

type Props = {}

const MemoryUsageGraph = ({ vmDetails }: { vmDetails: any }) => {
    return (
        <div className='px-5'>
            <Card className=' shadow border max-w-5xl px-4 mx-auto'>
                {/* top, right, left margins are negative – -1 * theme.spacing.xl */}
                <Card.Section>First section</Card.Section>


                {/* bottom, right, left margins are negative – -1 * theme.spacing.xl */}
                <Card.Section>Last section</Card.Section>
            </Card>
        </div>
    )
}

export default MemoryUsageGraph