import { Alert, Box, Button, Group, Input, NativeSelect, SimpleGrid, Switch, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react'
import PhoneInput from 'react-phone-input-2';
import { Country, State, City } from 'country-state-city'
import countryList from 'react-select-country-list';
import { trpc } from '../../../../utils/trpc';
import { WhoisFormInterface } from '../../../../Types/WhoisFormInterface';
import { toast } from 'react-hot-toast';

const WhoisBlock = (order: any) => {

    const form = useForm({
        initialValues: {
            ...order.whois[0]
        },
    });

    const [errorMessage, setErrorMessage] = useState<{
        Code: string,
        Message: string,
        Details: string
    } | any>()
    const [stateList, setstateList] = useState<any[]>([{ value: '', label: '-' }])
    const utils = trpc.useContext()
    const options = useMemo(() => countryList().getData(), [])
    const [domainPrivacy, setdomainPrivacy] = useState(order?.domainPrivacy)

    const domainManagerMutation = trpc.domainManager.updateWhois.useMutation()
    const transferLockMutation = trpc.domainManager.transferLock.useMutation()
    const updateDomainIDMutation = trpc.domainManager.updateDomainID.useMutation()
    const [domainTransferLock, setdomainTransferLock] = useState(order?.domainTransferLock)



    useEffect(() => {

        let states = State.getStatesOfCountry(
            order.whois[0]?.country,
        ).map((item) => {
            return {
                label: item.name,
                value: item.name,
            }
        })

        setstateList(states)

        form.setValues({
            ...order.whois[0]
        })
    }, [])



    return (
        <Box className='px-6'>
            <Group position='apart' className='border-b pb-4'>
                <Title order={3} className=' font-light'>Whois</Title>
            </Group>

            <Box className='mt-6 mb-2 space-y-4'>
                <form onSubmit={form.onSubmit((values) => {

                    setErrorMessage(null)
                    let _d: WhoisFormInterface = {
                        ...values,
                        orderId: order._id
                    }
                    domainManagerMutation.mutate(_d, {
                        onSuccess(data: any, variables, context) {
                            // console.log(data);
                            if (_.isEqual(data.result, "ERROR")) {
                                setErrorMessage(data.error)
                                toast.error(`Whois could not be updated; try again later Or make sure all the information is accurate. `)
                            }
                            else {
                                toast.success(`Whois updated successfully.`)
                            }

                        },
                        onError(error, variables, context) {
                            toast.error(`Whois could not be updated; try again later Or make sure all the information is accurate. `)
                            // console.log(error);

                        },
                    })


                    // // console.log(JSON.stringify(values))
                })}>
                    <Box className='min-h-[40vh]  py-4 px-4'>

                        {_.isEmpty(errorMessage) ? <Alert variant='filled' className=' mb-6' icon={<IconAlertCircle size={30} />} >
                            You can edit the contact information that will appear in the whois information in the following fields. After the transaction, a confirmation email is sent to the registered email address in the whois information and the whois update process is completed if this email is approved.
                        </Alert> :
                            <Alert className=' mb-6' icon={<IconAlertCircle size="1rem" />} title={errorMessage.Details} color="red">
                                {errorMessage.Message}
                            </Alert>
                        }


                        <Box className='space-y-4'>

                            <SimpleGrid cols={3}>
                                <TextInput  {...form.getInputProps('firstname')} label="Full Name" placeholder="First Name" />
                                <TextInput  {...form.getInputProps('lastname')} label="Last Name" placeholder="Last Name" />
                                <TextInput  {...form.getInputProps('email')} label="Email" placeholder="Email" />
                            </SimpleGrid>

                            <TextInput  {...form.getInputProps('company')} label="Company Name" placeholder="Company Name" />

                            <SimpleGrid cols={3} className='mt-4'>
                                <Input.Wrapper

                                    label="Phone"
                                    className="w-full "
                                    error={form.errors.mobile}
                                >
                                    <PhoneInput
                                        country={'us'}
                                        inputClass="w-full"
                                        enableSearch={true}
                                        inputStyle={{ width: "100%" }}
                                        containerClass="w-full"
                                        placeholder="Mobile"
                                        {...form.getInputProps('mobile')}
                                        onChange={(event: any) => {
                                            if (form.getInputProps(`mobile`).onChange) {
                                                form.getInputProps(`mobile`).onChange(event)
                                            }
                                        }}
                                    />

                                </Input.Wrapper>
                                <TextInput label="Address" {...form.getInputProps('address')} placeholder="Address" />
                                <TextInput label="Postalcode" {...form.getInputProps('postalcode')} placeholder="Postalcode" />

                            </SimpleGrid>

                            <SimpleGrid cols={3} className='mt-4'>
                                <TextInput label="City" placeholder="City" {...form.getInputProps('city')} />

                                <NativeSelect
                                    data={[{ value: '', label: 'Select Country' }, ...options]}
                                    label="Country"

                                    {...form.getInputProps('country')}
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

                                        if (form.getInputProps(`country`).onChange) {
                                            form.getInputProps(`country`).onChange(event)
                                        }

                                        if (states.length === 0) {
                                            setstateList([{ value: '', label: '-' }])
                                            return
                                        } else {
                                            form.setFieldValue('state', states[0].value)
                                        }

                                        setstateList(states)
                                    }}
                                    placeholder="Select Country"
                                />

                                <NativeSelect
                                    data={stateList}
                                    placeholder='State'
                                    {...form.getInputProps('state')}
                                    label="State/Province/Region"
                                />
                            </SimpleGrid>

                            <Box className='py-4 space-y-4'>
                                <Switch
                                    onLabel="ON" offLabel="OFF"
                                    checked={domainPrivacy}
                                    onChange={(event) => {


                                        setdomainPrivacy(event.currentTarget.checked)

                                        updateDomainIDMutation.mutate({ orderId: order.id, domain: order.domain, status: event.currentTarget.checked }, {
                                            onSuccess(data: any) {
                                                toast.success("Domain Privacy updated")
                                                utils.orders.asyncOrder.refetch({id: order._id})
                                            },
                                            onError(error) {
                                                // console.log(error);
                                                toast.error("Unable to update domain privacy")
                                            },
                                        })
                                    }}
                                    size="md"
                                    label="ID Protection"
                                />

                                <Switch
                                    onLabel="ON" offLabel="OFF"
                                    checked={domainTransferLock}
                                    onChange={(event) => {
                                        setdomainTransferLock(event.currentTarget.checked)
                                        transferLockMutation.mutate({ orderId: order.id, domain: order.domain, status: event.currentTarget.checked }, {
                                            onSuccess(data, variables, context) {
                                                toast.success("Domain Lock updated")
                                                utils.orders.asyncOrder.invalidate()
                                            },
                                            onError(error, variables, context) {
                                                // console.log(error);
                                                toast.error("Unable to update domain privacy")
                                            },
                                        })
                                    }}
                                    size="md"
                                    label="TransferLock"
                                />
                            </Box>
                        </Box>

                    </Box>
                    <Box className=' border-t'>
                        <Group position="right" mt="md">
                            <Button loading={domainManagerMutation.isLoading} type="submit" radius={"xl"} className=' bg-lochmara-400 hover:bg-lochmara-500'>Whois Update</Button>
                        </Group>

                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default WhoisBlock