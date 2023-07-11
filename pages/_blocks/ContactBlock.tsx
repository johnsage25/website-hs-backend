import {
  Anchor,
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
  Title,
  useMantineTheme,
} from '@mantine/core'
import React, { useEffect, useMemo, useState } from 'react'
import { SignUpBillingInterface } from '../../Types/SignUpBillingInterface'
import { trpc } from '../../utils/trpc'
import { Country, State } from 'country-state-city'
import { BillingType } from '../../Types/CustomerType'
import { TextInput, Checkbox, Button, Box } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import * as Yup from 'yup'

import countryList from 'react-select-country-list'
import _ from 'lodash'

const ContactBlock = () => {
  const [drawEdit, setDrawEdit] = useState(false)
  const theme = useMantineTheme()
  const ContactMutation = trpc.billing.billingAddress.useQuery<any>({ text: "" })
  const updateContact = trpc.billing.updateBilling.useMutation<never[]>()
  const utils = trpc.useContext()

  useEffect(() => {
    utils.billing.billingAddress.invalidate()
  }, [])

  const { isLoading, data, isSuccess } = ContactMutation

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
  const options = useMemo(() => countryList()?.getData(), [])

  const details: BillingType | any = data


  return (
    <div className='min-h-[200px] bg-white border'>
      <Paper py={10} p="md" className='flex flex-col '>
        <div className="pb-2 flex justify-between border-b border-b-gray-200">
          <Title order={5} fw={400}>
            Billing Contact
          </Title>
          {!_.isEmpty(details) ? (
            <>
              <Anchor
                size={15}
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
                  } = details?.BillingAddress[0]

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
              >
                Edit
              </Anchor>
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
        </div>

        <div className="space-y-2 relative  py-4  min-h-[10rem]">
          <LoadingOverlay visible={isLoading} overlayBlur={2} />

          <>
            {isSuccess && (
              <>
                {/* {!_.isEmpty(details) && ( */}
                <div>
                  <div className="flex space-x-2">
                    <Text size={15} fw={600}>
                      Fullname
                    </Text>
                    :{' '}
                    <Text size={15}>
                      {details?.firstname} {details?.lastname}
                    </Text>
                  </div>
                  <div className="flex space-x-2">
                    <Text fw={600} size={15}>
                      Email:
                    </Text>
                    <Text size={15}>{details?.email}</Text>
                  </div>

                  <div className="flex space-x-2">
                    <Text fw={600} size={15}>
                      Phone:
                    </Text>
                    <Text size={15}>+{details!!.mobile}</Text>
                  </div>

                  <div className="flex space-x-2">
                    <Text size={15} fw={600}>
                      Address:
                    </Text>
                    <Text size={15}>{details?.BillingAddress[0]?.address}</Text>
                  </div>
                  {details!!.address2 && (
                    <div className="flex space-x-2">
                      <Text size={15} fw={600}>
                        Address2:
                      </Text>
                      <Text size={15}>{details?.BillingAddress[0].address2}</Text>
                    </div>
                  )}

                  {details!!.companyname && (
                    <div className="flex space-x-2">
                      <Text size={15} fw={600}>
                        Company:
                      </Text>
                      <Text size={15}>{details!!.companyname}</Text>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Text size={15} fw={600}>
                      City:
                    </Text>
                    <Text size={15}>
                      {details?.BillingAddress[0]?.city} - {details?.BillingAddress[0]?.postalcode}
                    </Text>
                  </div>
                  <div className="flex space-x-2">
                    <Text size={15} fw={600}>
                      State:
                    </Text>
                    <Text size={15}>{details?.BillingAddress[0]?.state}</Text>
                  </div>
                  <div className="flex space-x-2">
                    <Text fw={600} size={15}>
                      Country:
                    </Text>
                    <Text size={15}>
                      {
                        Country.getCountryByCode(`${details?.BillingAddress[0]?.country}`)!!
                          .name
                      }
                    </Text>
                  </div>
                </div>
                {/* )} */}
              </>
            )}
          </>
        </div>
      </Paper>

      <Drawer
        opened={drawEdit}
        onClose={() => {
          setDrawEdit(false)
        }}

        overlayProps={{
          color: theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
        closeOnClickOutside={false}
        withCloseButton={false}
        position="right"
        size="lg"

      >
        <Box className="px-8 py-6">
          <div className="flex justify-between items-center">
            {_.isEmpty(details) ? (
              <Title order={4}>Billing Contact Info</Title>
            ) : (
              <Title order={4}>Edit Billing Contact Info</Title>
            )}

            <CloseButton
              onClick={() => {
                setDrawEdit(false)
              }}
              title="Close"
              size="xl"
              radius={'xl'}
              iconSize={25}
            />
          </div>
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
      </Drawer>
    </div>
  )
}

export default ContactBlock
