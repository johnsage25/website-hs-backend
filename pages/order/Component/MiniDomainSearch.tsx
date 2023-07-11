import { ActionIcon, Badge, Box, Button, Group, Loader, Popover, Skeleton, Text, TextInput, Title, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { trpc } from '../../../utils/trpc';
import { IconSearch, IconX } from '@tabler/icons';
import _, { truncate } from 'lodash';
import { BsCheckLg } from 'react-icons/bs';
import CurrencyFormat from 'react-currency-format';
import { AiOutlineInfoCircle, AiOutlinePlus } from 'react-icons/ai';
import DomainListItem from './DomainListItem';
import { domainState } from '../../../atoms/domainState';
import { useRecoilState } from 'recoil';
import { getHotkeyHandler, useOs } from '@mantine/hooks';
import { calculateDiscountPercentageHelper } from '../../../utils/helpers';

const MiniDomainSearch = (props: any) => {

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [openCart, setopenCart] = useState(false)
    const searchMutation: any = trpc.search.query.useMutation({})
    const [domainName, setdomainName] = useState<{ name: string, ext: string }>()
    let addToCartMutation = trpc.search.addToCart.useMutation()
    const [selectTld, setselectTld] = useRecoilState<any>(domainState);
    let utils = trpc.useContext()
    const theme = useMantineTheme();
    const form = useForm({
        initialValues: {
            search: "",
        },
    });

    let domainCartQuery = trpc.cart.domainCart.useQuery({})

    let featuredListQuery = trpc.search.featuredList.useQuery({ name: domainName?.name, ext: domainName?.ext }, {
        keepPreviousData: true,
        onSuccess(data) {
            setfeatureListArray(data)
        },
    })

    useEffect(() => {

        document.body.addEventListener(
            'keydown',
            getHotkeyHandler([
                ['Enter', () => searchMutation.mutate({ query: searchTerm })],
            ])
        );


    }, [])


    const [featureListArray, setfeatureListArray] = useState<any[]>(searchMutation?.data?.featuredList)

    const [hiddenBox, setHiddenBox] = useState(false)

    let domainMain: any = searchMutation?.data
    let cart: any = domainCartQuery?.data


    return (
        <Box className=' px-6 pb-8'>
            <Box className=' shadow-xs px-2 w-full border  overflow-hidden border-gray-200 rounded-full divide-y'>
                <form onSubmit={form.onSubmit((values) => {
                    return false;

                })} onChange={form.onSubmit((values) => {
                    // console.log(values);

                    setSearchTerm(values.search)
                })}>
                    <div className='flex w-full items-center'>
                        <TextInput
                            icon={<IconSearch size={20} className=' text-gray-400' stroke={4} />}
                            radius="xl"
                            size="xl"

                            className=' border-0 font-semibold text-gray-700 w-full'
                            styles={{
                                input: {
                                    border: "none"
                                }
                            }}
                            placeholder="Search for domains.."
                            {...form.getInputProps('search')}
                            rightSectionWidth={42}

                            rightSection={
                                <div className={`pr-4 ${_.isEmpty(form.values.search) ? "hidden" : "flex"}`}>
                                    <ActionIcon onClick={() => {
                                        form.setValues({ search: "" })
                                        setSearchTerm("")
                                    }} size={26} radius="xl" color={theme.primaryColor}
                                        className=' bg-gray-300' variant="filled">
                                        <IconX size={20} stroke={4} />
                                    </ActionIcon>
                                </div>
                            }

                        />
                        <Button loading={searchMutation.isLoading} radius={"xl"} onClick={() => {
                            if (!_.isEmpty(form.values.search)) {
                                searchMutation.mutate({ query: form.values.search })
                            }

                        }} className=' bg-azure-radiance-500 hover:bg-azure-radiance-600'>Search</Button>
                    </div>
                </form>
            </Box>
            {_.isEqual(searchMutation.isLoading, true) && <Box className='flex justify-center py-10'>
                <Loader size={"md"} />
            </Box>}

            <Box hidden={searchMutation.isLoading} className='mt-6'>


                <Box className={`border rounded-md divide-y ${_.isEqual(domainMain?.status, "register") ? "divide-blue-400 border-blue-400" : 'divide-red-200 border-red-200'}`} hidden={_.isEmpty(domainMain)}>
                    <div className='p-3'>
                        {_.isEqual(domainMain?.status, "register") ? <Text fw={600} className='text-blue-400'>Domain is available!</Text> : <Text fw={600} className='text-red-400'>Sorry, this domain is already taken</Text>}
                    </div>
                    <div className='flex p-4 items-center justify-between'>
                        <Text fw={600}>{domainMain?.domain}</Text>

                        {_.isEqual(domainMain?.status, "register") &&
                            <>

                                {domainMain?.promo && <Badge size="md">{`SAVED ${calculateDiscountPercentageHelper(domainMain?.price, domainMain?.promoPrice).toFixed(1)}%`}</Badge>}



                                <Group>

                                    {domainMain?.promo ? (
                                        <>
                                            <div className='flex justify-between'>
                                                <Popover width={250} position="bottom" withArrow shadow="md">
                                                    <Popover.Target>
                                                        <ActionIcon><AiOutlineInfoCircle /></ActionIcon>
                                                    </Popover.Target>
                                                    <Popover.Dropdown className=' bg-gray-900 text-gray-50'>
                                                        <Text size="sm">
                                                            We offer a lower first-year price to help you
                                                            get up and running online. After the first
                                                            year, your domain will renew at the standard <Text fw={700}><CurrencyFormat fixedDecimalScale={true} decimalScale={2} value={domainMain?.price} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix='/yr' />.</Text>
                                                        </Text>
                                                    </Popover.Dropdown>
                                                </Popover>
                                                <div className='flex flex-col justify-end'>

                                                    <div className='flex-col items-center'>
                                                        <Group spacing={2}>
                                                            <Text size={16} fw={600} className=' text-arapawa-600'>
                                                                <CurrencyFormat fixedDecimalScale={true} decimalScale={2} value={domainMain?.promoPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix='/yr' />
                                                            </Text>
                                                        </Group>

                                                        <Text size={"sm"} className='line-through '>
                                                            <CurrencyFormat fixedDecimalScale={true} decimalScale={2} value={domainMain?.price} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix='/yr' />
                                                        </Text>

                                                    </div>

                                                </div>
                                            </div>

                                        </>
                                    ) : (
                                        <>
                                            <div className=' flex flex-col justify-end text-right'>
                                                <Text size={16} fw={700} align="right" className=' text-arapawa-600'>
                                                    <CurrencyFormat fixedDecimalScale={true} decimalScale={2} value={domainMain?.price} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix='/yr' />

                                                </Text>
                                                <Text fz={"sm"}>
                                                    {'then'} <CurrencyFormat fixedDecimalScale={true} decimalScale={2} value={domainMain?.renewPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix='/yr' />
                                                </Text>
                                            </div>

                                        </>
                                    )}


                                    {_.some(selectTld?.inner, { domain: domainMain.domain }) || _.some(cart?.domainSelected, { domainName: domainMain.domain }) ?

                                        <>
                                            <Button disabled={true} radius={"xl"} className=' bg-azure-radiance-500'>
                                                In Cart
                                            </Button>

                                        </> : <>
                                            <Button disabled={_.some(selectTld?.inner, { domain: domainMain.domain }) || _.some(cart?.domainSelected, { domainName: domainMain.domain })} onClick={() => {

                                                addToCartMutation.mutate({ name: domainMain.domain, id: domainMain.id }, {
                                                    onSuccess(data, variables, context) {
                                                        utils.cart.domainCart.invalidate()
                                                        utils.cart.cartMiniBox.invalidate()
                                                        setselectTld({ inner: [...selectTld.inner, domainMain] });
                                                    },
                                                })

                                            }} radius={"xl"} loading={addToCartMutation.isLoading} leftIcon={<AiOutlinePlus />} className=' bg-azure-radiance-500'>
                                                Add
                                            </Button>
                                        </>}

                                </Group>
                            </>
                        }

                        {_.isEqual(domainMain?.status, "transfer") && <>
                            <Button disabled={true} radius={"xl"} className=' bg-azure-radiance-500'>
                                Taken
                            </Button>
                        </>}

                    </div>
                </Box>

                {!_.isEmpty(domainMain?.featuredList) && <Box className=' divide-y border mt-8 rounded-md overflow-hidden'>
                    <div className='py-4 text-center'>
                        <Text fw={600}>More options</Text>
                    </div>
                    {domainMain.featuredList.map((item) => {
                        return (
                            <DomainListItem onChange={(selected) => {

                                setselectTld({ inner: [...selectTld.inner, selected] });

                            }} selected={selectTld?.inner} key={item.domain} item={item} />
                        )
                    })}
                </Box>}
            </Box>

        </Box>
    )
}

export default MiniDomainSearch