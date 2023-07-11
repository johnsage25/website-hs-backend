import React, { useLayoutEffect, useState } from 'react'
import HeaderOrder from '../../order/Component/HeaderOrder'
import { ActionIcon, Avatar, Box, Button, Card, Container, Flex, Group, Input, List, Paper, Select, SimpleGrid, Tabs, Text, TextInput, Title, Tooltip } from '@mantine/core'
import StickyBox from "react-sticky-box";
import { forwardRef } from 'react';
import { MoreNodeButton } from './MoreNodeButton';
import { trpc } from '../../../utils/trpc';
import CurrencyFormat from 'react-currency-format';
import { Ucword } from '../../../Components/TextFormatter';
import { TermsList } from '../../../utils/helpers';
import collect from 'collect.js';

function generateRandomHostname(): string {
    const randomString = Math.random().toString(36).substring(2, 8);
    return randomString;
}

const MiniSection = ({ form, config, props }: { form?: any, config?: any, props?: any }) => {
    const cartid: any = props?.query.id;
    const [quantity, setquantity] = useState(config.quantity || 1)
    const updateVmCartMutation = trpc.cart.updateVmCart.useMutation()
    const completeVOrderMutation = trpc.cart.completeVOrder.useMutation()
    const utils = trpc.useContext()

    const collection = collect(props.config);
    let osImages: any = collection.get('osImages')

    const vm: any = config?.vm[0]

    let pricing = () => {
        let pricing = vm.pricing?.filter((item: any) => item?.period == config?.term);
        return {
            subtotal: pricing[0]?.amount,
            total: (pricing[0]?.amount * quantity)
        }
    }

    return (
        <Box style={{ width: 'calc(((100% - 104px) / 3) - 0.5px)' }} className='w-1/4'>
            <StickyBox offsetTop={20} >
                <Card className='border shadow-sm'>
                    <Card.Section className='border-b py-2 px-4 '>
                        <Text fw={600} fz={17}>Summary</Text>
                    </Card.Section>

                    <Card.Section className='px-3 py-2 border-b'>

                        <SimpleGrid cols={2} className=' items-center'>
                            <Text>Server Quantity</Text>
                            <MoreNodeButton {...form.getInputProps('quantity')} onChange={(item) => {

                                if (item > quantity) {
                                    form.setFieldValue("hostdetails", [...form.values.hostdetails, { tag: "", id: item, hostname: `${osImages.slice(0, 1)[0].id}-${generateRandomHostname()}-${item}` }])
                                }
                                else {
                                    form.setFieldValue("hostdetails", [...form.values.hostdetails.filter((z: any) => z.id !== quantity)])
                                }
                                setquantity(item)

                                form.setFieldValue('quantity', item)

                                updateVmCartMutation.mutate({ quantity: item, id: cartid }, {
                                    onSuccess(data, variables, context) {
                                        utils.cart.refreshVmCart.invalidate()
                                    },
                                    onError(error, variables, context) {
                                        console.log(error);
                                    },
                                })

                            }} />
                        </SimpleGrid>
                    </Card.Section>

                    <Card.Section className='px-6 py-4 border-b'>
                        <Text fw={500}>
                            Details
                        </Text>

                        <List size={13} className='list-disc px-4'>
                            <List.Item><b>Data Center:</b> <span
                                className={`fi fi-${config?.region[0].name.toLowerCase()}`}
                            /> {config?.region[0].locationName}, {config?.region[0].name}</List.Item>
                            <List.Item><b>Contract Period:</b> {TermsList.filter((item: any) => item?.value == config?.term)[0].label}</List.Item>
                            <List.Item><b>OS:</b> {Ucword(config?.osType)} {config?.osVersion}</List.Item>
                            <List.Item><b>Storage:</b>  {vm?.storage} {vm?.storageFormat?.toLocaleUpperCase()} {vm?.storageType}</List.Item>
                            <List.Item><b>Bandwidth:</b> {vm?.bandwidth} {vm?.bandwidthType?.toLocaleUpperCase()}</List.Item>
                        </List>


                    </Card.Section>
                    <Card.Section className='px-6 py-2 border-t'>
                        <Group position='apart'>
                            <Text>Subtotal</Text>
                            <Text fw={600} size={20}>
                                <CurrencyFormat decimalScale={3} value={pricing().subtotal} displayType={'text'} suffix=' USD' thousandSeparator={true} prefix={'$'} />
                            </Text>
                        </Group>

                        <Group position='apart'>
                            <div className='flex gap-2'>
                                <Text>Total</Text>
                                <Text>x{quantity}</Text>
                            </div>
                            <Text fw={600} size={20}>
                                <CurrencyFormat decimalScale={3} value={pricing().total} displayType={'text'} suffix=' USD' thousandSeparator={true} prefix={'$'} />
                            </Text>
                        </Group>

                        <Group py={20}>
                            <Button loading={completeVOrderMutation.isLoading} type='submit' radius={"xl"} size="lg" className=' bg-azure-radiance-500 hover:bg-azure-radiance-600' fullWidth>Order</Button>
                        </Group>
                    </Card.Section>
                </Card>
            </StickyBox>
        </Box>
    )
}

export default MiniSection