import { Button, Card, CardSection, Group, Text } from '@mantine/core'
import React, { useEffect, useRef } from 'react'
import lottieImage from "../../../public/lottie/96085-green-check.json"
import Lottie from "lottie-react";
import CurrencyFormat from 'react-currency-format'
import _ from 'lodash';


const SuccessMessage = (props: any) => {
    const {total, status} = props
    const playLottie = useRef<any>()
    useEffect(() => {
        playLottie.current?.play();
    }, [])

    return (
        <Card className='max-w-xl mx-auto p-10' radius="sm" withBorder>
            <CardSection className=' flex justify-center text-center w-full'>
                <Lottie ref={playLottie} style={{ height: "40%", width: "40%" }} animationData={lottieImage} loop={false} autoPlay={_.isEqual(status, "success")} />
            </CardSection>
            <CardSection className='mb-4 flex justify-center text-center w-full'>
                <Text size={25} fw={600} align='center'>Payment received</Text>
            </CardSection>

            <CardSection className='px-4 mb-6 text-center'>
                <Text>
                    We are happy to confirm that we have received your payment of <strong><CurrencyFormat value={total || 0} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} /></strong>. Thank you for choosing our services!
                </Text>
            </CardSection>

            <CardSection className='px-4 text-center pb-6'>
                <Group spacing={10} position='center'>
                    <Button variant="default" radius="xl">
                        Download Receipt
                    </Button>

                    <Button component='a' href='/' className=' bg-azure-radiance-500 hover:bg-azure-radiance-600' radius="xl">
                        Continue to Account
                    </Button>
                </Group>
            </CardSection>

        </Card>
    )
}

export default SuccessMessage