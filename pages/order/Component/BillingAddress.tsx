import {
    Anchor,
    Box,
    Button,
    Card,
    CloseButton,
    Divider,
    Drawer,
    Grid,
    Group,
    LoadingOverlay,
    NativeSelect,
    Paper,
    SimpleGrid,
    Space,
    Text,
    TextInput,
    Title,
    UnstyledButton,
    useMantineTheme,
} from '@mantine/core'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm, yupResolver } from '@mantine/form'
import * as Yup from 'yup'
import { Country, State } from 'country-state-city'
import countryList from 'react-select-country-list'
import _ from 'lodash'
import { trpc } from '../../../utils/trpc'
import { BillingType, CustomerType } from '../../../Types/CustomerType'
import { AiOutlineEdit } from 'react-icons/ai'
import { toast } from 'react-hot-toast'
const lookup = require('country-code-lookup')

const BillingAddress = (tempValue: any) => {
    const [drawEdit, setDrawEdit] = useState(false)
    const [details, setdetails] = useState<CustomerType>(tempValue)
    const theme = useMantineTheme()
    const ContactMutation = trpc.billing.billingAddress.useQuery<any>({ text: "" }, {
        onSettled(data: any, error) {
            setdetails(data)
            toast.success("Billing address updated.")
        },
    })
    const updateContact = trpc.billing.updateBilling.useMutation<never[]>()
    const utils = trpc.useContext()


    const { isLoading, isSuccess } = ContactMutation

    const schema = Yup.object().shape({
        firstname: Yup.string().required('First Name is required'),
        lastname: Yup.string().required('Last Name is required'),
        postalcode: Yup.string().required('Postal Code is required'),
        state: Yup.string().required('State is required'),
        address: Yup.string().required('Address is required'),
        country: Yup.string().required('Country is required'),
        city: Yup.string().required('City is required'),
    })

    const billingForm = useForm({
        validate: yupResolver(schema),
        initialValues: {
            firstname: '',
            lastname: '',
            country: '',
            postalcode: '',
            companyname: '',
            state: '',
            city: '',
            address2: '',
            address: '',
        },
    })
    const [stateList, setstateList] = useState<any[]>([{ value: '', label: '-' }])
    const options = useMemo(() => countryList().getData(), [])

    // const details: BillingType | any = data || tempValue

    let country = lookup.byInternet(details?.BillingAddress[0]?.country || "US")



    return (
        <div>
            <Card className='flex px-6 flex-col border  border-gray-200'>
                <Card.Section className="px-6 py-4 border-b flex justify-between border-b-gray-200">
                    <Text size={"lg"} className='text-gray-800' fw={600}>Billing Information</Text>
                    {!_.isEmpty(details) ? (
                        <>

                            <UnstyledButton

                                onClick={() => {
                                    setDrawEdit(true)

                                    const {
                                        _id,
                                        country,
                                        postalcode,
                                        state,
                                        city,
                                        address2,
                                        address,
                                        companyname
                                    } = details.BillingAddress[0]

                                    let states = State.getStatesOfCountry(country).map((item) => {
                                        return {
                                            label: item.name,
                                            value: item.name,
                                        }
                                    })

                                    billingForm.setFieldValue('state', states[0].value)
                                    setstateList(states)

                                    billingForm.setValues({
                                        firstname: details?.firstname,
                                        lastname: details?.lastname,
                                        country,
                                        companyname,
                                        postalcode,
                                        state,
                                        city,
                                        address2,
                                        address,
                                    })
                                }}
                                component='a' className=' text-azure-radiance-500'>
                                <Group spacing={6}>
                                    <AiOutlineEdit />
                                    <Text>Edit</Text>
                                </Group>
                            </UnstyledButton>


                        </>
                    ) : (
                        <>
                            <Anchor
                                size={15}
                                onClick={() => {
                                    setDrawEdit(true)
                                }}
                            >
                                Add new
                            </Anchor>
                        </>
                    )}
                </Card.Section>


                <LoadingOverlay visible={isLoading} overlayBlur={2} />

                <Card.Section className='pt-4 px-6 pb-6'>
                    {/* {!_.isEmpty(details) && ( */}
                    <div>
                        <Group spacing={5} position="apart">
                            <div className='flex space-x-1'>
                                <Text>{details?.firstname}</Text>
                                <Text>{details?.lastname}</Text>
                            </div>

                        </Group>
                    </div>
                    <div>
                        <Text>{details?.BillingAddress[0].address}, {details?.BillingAddress[0].city}, {details?.BillingAddress[0].state}</Text>
                    </div>
                    <div>
                        <Text>{country?.country}</Text>
                    </div>

                </Card.Section>

            </Card>

            <Drawer.Root size="lg" opened={drawEdit} position="right" onClose={() => {
                setDrawEdit(false)
            }}>
                <Drawer.Overlay blur={1} opacity={0.55} color={theme.colorScheme === 'dark'
                    ? theme.colors.dark[9]
                    : theme.colors.gray[2]} />
                <Drawer.Content>
                    <Drawer.Header className='border-b'>
                        <Drawer.Title>
                            {_.isEmpty(details) ? (
                                <Text>Billing Contact Info</Text>
                            ) : (
                                <Text>Edit Billing Contact Info</Text>
                            )}
                        </Drawer.Title>
                        <Drawer.CloseButton />
                    </Drawer.Header>
                    <Drawer.Body>
                        <Box className="px-8 py-6">
                            <form
                                className="py-4 space-y-4"
                                onSubmit={billingForm.onSubmit((values) => {
                                    let data: BillingType = {
                                        _id: details?._id,
                                        ...values,
                                    }

                                    updateContact.mutate(data, {
                                        onSuccess(data, variables, context) {
                                            // console.log(data)
                                            utils.billing.billingAddress.invalidate()
                                        },
                                        onError(error, variables, context) {
                                            // console.log(data)
                                        },
                                    })
                                })}
                            >
                                <SimpleGrid cols={2}>
                                    <TextInput
                                        label="First Name"
                                        placeholder="Enter firstname"
                                        className="w-full"
                                        {...billingForm.getInputProps('firstname')}
                                    />

                                    <TextInput
                                        label="Last Name"
                                        className="w-full"
                                        placeholder="Enter lastname"
                                        {...billingForm.getInputProps('lastname')}
                                    />
                                </SimpleGrid>

                                <TextInput
                                    label="Company Name (Optional)"
                                    className="w-full"
                                    placeholder="Enter company name"
                                    {...billingForm.getInputProps('companyname')}
                                />

                                <TextInput
                                    label="Address"
                                    className="w-full"
                                    placeholder="Enter address"
                                    {...billingForm.getInputProps('address')}
                                />

                                <TextInput
                                    label="Address 2 (Optional)"
                                    className="w-full"
                                    placeholder="Enter address"
                                    {...billingForm.getInputProps('address2')}
                                />

                                <NativeSelect
                                    data={[{ value: '', label: 'Select Country' }, ...options]}
                                    label="Country"
                                    {...billingForm.getInputProps('country')}
                                    onChange={(event) => {
                                        if (event.currentTarget.value.length < 1) {
                                            setstateList([{ value: '', label: '-' }])
                                            return
                                        }

                                        let states = State.getStatesOfCountry(
                                            event.currentTarget.value,
                                        ).map((item) => {
                                            return {
                                                label: item.name,
                                                value: item.name,
                                            }
                                        })

                                        if (billingForm.getInputProps(`country`).onChange) {
                                            billingForm.getInputProps(`country`).onChange(event)
                                        }

                                        if (states.length === 0) {
                                            setstateList([{ value: '', label: '-' }])
                                            return
                                        } else {
                                            billingForm.setFieldValue('state', states[0].value)
                                        }

                                        setstateList(states)
                                    }}
                                    placeholder="Select Country"
                                />

                                <TextInput
                                    label="City"
                                    className="w-full"
                                    placeholder="Enter city"
                                    {...billingForm.getInputProps('city')}
                                />

                                <SimpleGrid cols={2}>
                                    <NativeSelect
                                        data={stateList}
                                        {...billingForm.getInputProps('state')}
                                        label="State/Province/Region"
                                    />
                                    <TextInput
                                        label="Postal Code"
                                        className="w-full"
                                        placeholder="Enter postal code"
                                        {...billingForm.getInputProps('postalcode')}
                                    />
                                </SimpleGrid>

                                <Button
                                    // size="md"
                                    type="submit"
                                    loading={updateContact.isLoading}
                                    radius={'xl'}
                                    className=" bg-lochmara-400"
                                >
                                    Submit
                                </Button>
                            </form>
                        </Box>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>


        </div>
    )
}

export default BillingAddress
