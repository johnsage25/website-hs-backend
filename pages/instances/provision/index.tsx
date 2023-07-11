import React, { useLayoutEffect, useState } from 'react'
import HeaderOrder from '../../order/Component/HeaderOrder'
import { ActionIcon, Avatar, Box, Button, Card, Container, Flex, Group, Input, List, Paper, Select, SimpleGrid, Tabs, Text, TextInput, Title, Tooltip } from '@mantine/core'
import StickyBox from "react-sticky-box";
import { forwardRef } from 'react';
import { OSImages } from '../_Component/OSImages';
import { useForm, yupResolver } from '@mantine/form';
import collect from 'collect.js';
import { Config } from '../../../node/Config';
import { ServerSideProps } from '../../../Types/ServerInterface';
import { AuthCheck } from '../../../node/AuthCheck';
import { ServerRegionsD } from '../../../node/ServerRegionsD';
import { VirtualizationProducts } from '../../../node/VirtualizationProducts';
import { BsCpu, BsHddNetwork } from 'react-icons/bs';
import { CgSmartphoneRam } from 'react-icons/cg';
import { GrStorage } from 'react-icons/gr';
import { RegionsCheckBox } from '../_Component/Regions';
import { VmAuthBox } from '../_Component/VmAuthBox';
import { AiOutlineDelete, AiOutlineInfoCircle } from 'react-icons/ai';
import { PasswordInputBox } from '../_Component/PasswordInput';
import SSHKeyInput from '../_Component/SSHKeyBox';
import _, { truncate } from 'lodash';
import { MoreNodeButton } from '../_Component/MoreNodeButton';
import { TermsList } from '../../../utils/helpers';
import { ServerCartConfig } from '../../../node/ServerCartConfig';
import { Ucword } from '../../../Components/TextFormatter';
import { IconDatabase } from '@tabler/icons';
import { HiOutlineDatabase } from 'react-icons/hi';
import CurrencyFormat from 'react-currency-format';
import { trpc } from '../../../utils/trpc';
import { CreateNodeInterface } from '../../../Types/CreateNodeInterface';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import MiniSection from '../_Component/MiniSection';
import YupPassword from 'yup-password'
import StepperBox from '../_Component/Stepper';
import Head from 'next/head';
YupPassword(Yup)

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  description: string;
}

function generateRandomHostname(): string {
  const randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
}

const Provision = (props: any) => {
  const collection = collect(props.config);
  let osImages: any = collection.get('osImages')
  let regions = props?.regions || []

  const router = useRouter();
  // const [selectedSize, setselectedSize] = useState(props?.virtualizations[0])

  const [inputState, setinputState] = useState<{ osType: string }>({ osType: osImages.slice(0, 1)[0].id })
  const updateVmCartMutation = trpc.cart.updateVmCart.useMutation()
  const completeVOrderMutation = trpc.cart.completeVOrder.useMutation()



  const cartid: any = props?.query.id;
  const [config, setconfig] = useState(props.vmConfig)

  const [selectedAuth, setselectedAuth] = useState(config?.vmAuth || "sshKey")

  const utils = trpc.useContext()

  trpc.cart.refreshVmCart.useQuery({ id: cartid }, {
    onSuccess(data) {
      setconfig(data)
    },
    onError(err) {
      toast.error("Unable to update VM config")
    },
  })

  const [quantity, setquantity] = useState(config?.quantity || 1)

  const vm: any = config?.vm[0]

  const [selectOsVersion, setselectOsVersion] = useState(osImages.filter((item) => {
    if (item?.id == config?.osType) {
      return item;
    }
    return item[0];
  })[0]?.versions)



  let passwordSchema = selectedAuth == "password" && {
    password: Yup.string()
      .required('No password provided.')
      .min(
        8,
        'password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special'
      )
      .minLowercase(1, 'password must contain at least 1 lower case letter')
      .minUppercase(1, 'password must contain at least 1 upper case letter')
      .minNumbers(1, 'password must contain at least 1 number')
      .minSymbols(1, 'password must contain at least 1 special character'),

  }

  let sshKeySchema = selectedAuth == "sshKey" && {
    sshKey: Yup.string().required('sshkey is required'),
    hostname: Yup.string().required('hostname is required'),
  }

  const schema = Yup.object().shape({
    ...passwordSchema,
    ...sshKeySchema
  });

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      // vSize: selectedSize?._id,
      term: 'm',
      osType: osImages.slice(0, 1)[0].id,
      osVersion: selectOsVersion[0].value,
      vmAuth: "sshKey",
      sshKey: "",
      sskLabel: "",
      password: "",
      quantity: 1,
      tag: '',
      hostname: '',
      ...config,
      region: config?.region[0]?._id,
      vm: config?.vm[0]?._id
    }
  });

  let vmprice = vm.pricing?.map((item) => {
    return { value: item.period }
  })

  let pricing = () => {
    let pricing = vm.pricing?.filter((item: any) => item?.period == config?.term);
    return {
      subtotal: pricing[0]?.amount,
      total: (pricing[0]?.amount * quantity)
    }
  }

  const filteredArray = TermsList.filter((element) => {
    return vmprice.some((includedElement) => includedElement.value === element.value);
  });


  return (
    <>
      <Head>
        <title>Server option selection</title>
      </Head>
      {/* #1d426d */}
      <div>
        <HeaderOrder {...props} />
        <Box className='py-2  border-b border-b-gray-200 bg-white'>
          <Container>
            <StepperBox step={1} />
          </Container>
        </Box>
        <Container size={"lg"} className=' py-20 px-8 '>

          <form onSubmit={form.onSubmit((values: any) => {

            let _d: CreateNodeInterface = {
              ...values,
              id: cartid
            }

            completeVOrderMutation.mutate(_d, {
              onSuccess(data: any, variables, context) {
                console.log(data);

                if (data.status == true) {
                  router.push({ pathname: "/instances/payment", query: { id: cartid } })
                }

              },
              onError(error, variables, context) {
                toast.error("Unable to place order, please try again.")
              },
            })

          })}>

            <Flex gap={20}>
              <Box className=' bg-white border divide-y w-3/4'>

                <Paper className='py-3 px-6 relative space-y-2 divide-y z-30 rounded-none shadow-md '>
                  <div className='flex items-center '>
                    <Box className='w-2/5'><Text size={19} fw={600}>{vm?.title}</Text></Box>
                    <SimpleGrid cols={4} className='w-3/5 gap-0'>
                      <div className='text-center w-full space-y-1 flex justify-center flex-col'>
                        <Text fw={700}>{vm?.vcpu}</Text>
                        <Group spacing={5} className='mx-auto'>
                          <BsCpu className=' text-gray-600' />
                          <Text size={13} className=' text-gray-700'>vCPUs</Text>
                        </Group>
                      </div>
                      <div className='text-center w-full space-y-1 flex justify-center flex-col'>
                        <Text fw={700}>{vm?.memory} {vm?.memoryType?.toLocaleUpperCase()}</Text>
                        <Group spacing={5} className='mx-auto '>
                          <CgSmartphoneRam className=' text-gray-600' />
                          <Text size={13} className=' text-gray-700'>RAM</Text>
                        </Group>
                      </div>
                      <div className='text-center w-full space-y-1 flex justify-center flex-col'>
                        <Group spacing={5} className='mx-auto'>
                          <Text fw={700}>{vm?.storage} {vm?.storageFormat?.toLocaleUpperCase()}</Text>
                          <Text size={12}>{vm?.storageType}</Text>
                        </Group>
                        <Group spacing={5} className='mx-auto'>
                          <HiOutlineDatabase className=' text-gray-600' />
                          <Text size={13} className=' text-gray-700'>Storage</Text>
                        </Group>
                      </div>
                      <div className='text-center w-full space-y-1 flex justify-center flex-col'>
                        <Text fw={700}>{vm?.bandwidth} {vm?.bandwidthType?.toLocaleUpperCase()}</Text>
                        <Group spacing={5} className='mx-auto'>
                          <BsHddNetwork className=' text-gray-600' />
                          <Text size={13} className=' text-gray-700'>Bandwidth</Text>
                        </Group>
                      </div>
                    </SimpleGrid>
                  </div>
                </Paper>

                <Box className='space-y-4 px-8 py-5' >
                  <Text size={20} fw={500}>Select your term length</Text>
                  <Box className=''>
                    <SimpleGrid cols={2}>
                      <Select
                        {...form.getInputProps('term')}
                        onChange={(event: any) => {

                          updateVmCartMutation.mutate({ term: event, id: cartid }, {
                            onSuccess(data, variables, context) {
                              utils.cart.refreshVmCart.invalidate()
                            },
                            onError(error, variables, context) {
                              console.log(error);
                            },
                          })

                          form.getInputProps(`term`).onChange(event)
                        }}
                        data={filteredArray}
                      />
                    </SimpleGrid>

                  </Box>
                </Box>

                <Box className='space-y-4 px-8 py-5' >
                  <Text size={20} fw={500}>Choose Region</Text>
                  <Box className=''>
                    <RegionsCheckBox {...form.getInputProps('region')} regions={regions}
                      onChange={(event: any) => {

                        updateVmCartMutation.mutate({ region: event, id: cartid }, {
                          onSuccess(data, variables, context) {
                            utils.cart.refreshVmCart.invalidate()
                          },
                          onError(error, variables, context) {
                            console.log(error);
                          },
                        })

                        form.getInputProps(`region`).onChange(event)
                      }}
                    />
                  </Box>
                </Box>

                <Box className=' space-y-7 px-8 py-6'>
                  <Box className='space-y-2'>
                    <Text size={20} fw={600}>Operating system</Text>
                    <Text size={14}>Select your instance&lsquo;s operating system and version from an image, snapshot or existing volume.</Text>
                  </Box>
                  <Tabs defaultValue="gallery">
                    <Tabs.List>
                      <Tabs.Tab value="gallery" >Image</Tabs.Tab>
                      <Tabs.Tab value="messages">Snapshot</Tabs.Tab>
                      <Tabs.Tab value="apps">Apps & Panel</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="gallery" pt="xs" >
                      <Box className=' space-y-4 pt-4'>
                        <OSImages data={osImages}  {...form.getInputProps('osType')} onChange={(item) => {
                          form.setFieldValue("osType", item.toLocaleLowerCase())

                          form.setFieldValue("hostdetails",
                            form.values.hostdetails.map((obj) => {

                              const replacedHostname = obj.hostname.replace(/^([a-z]{2,})/, `${item}`); // replace any string at the start of "hostname" with specified OS name
                              // console.log(obj);
                              // console.log(replacedHostname);
                              return { ...obj, hostname: replacedHostname };

                            })

                          )

                          const osBox = collect(osImages);
                          let version = osBox.firstWhere("id", item).versions

                          setinputState(item)
                          setselectOsVersion(version)
                          form.setFieldValue('osVersion', version[0].value)

                          updateVmCartMutation.mutate({ osVersion: version[0].value, osType: item, id: cartid }, {
                            onSuccess(data, variables, context) {
                              utils.cart.refreshVmCart.invalidate()
                            },
                            onError(error, variables, context) {
                              console.log(error);
                            },
                          })


                        }} />

                        <Select
                          className=' w-72'
                          label="Version"
                          size='sm'
                          {...form.getInputProps('osVersion')}
                          data={selectOsVersion}

                          onChange={(event: any) => {

                            updateVmCartMutation.mutate({ osVersion: event, id: cartid }, {
                              onSuccess(data, variables, context) {
                                utils.cart.refreshVmCart.invalidate()
                              },
                              onError(error, variables, context) {
                                console.log(error);
                              },
                            })

                            form.getInputProps(`osVersion`).onChange(event)
                          }}

                        />

                      </Box>
                    </Tabs.Panel>

                    <Tabs.Panel value="messages" pt="xs">
                      Messages tab content
                    </Tabs.Panel>

                    <Tabs.Panel value="apps" pt="xs">
                      Messages tab content
                    </Tabs.Panel>

                  </Tabs>


                </Box>

                <Box className='px-8 py-5 relative z-0'>
                  <Group mb={15}>
                    <Text size={20} fw={500}>Details</Text>
                  </Group>
                  <SimpleGrid cols={2}>
                    <div>
                      <TextInput {...form.getInputProps('hostname')} size='sm' placeholder='Enter a unique name' label="Hostname 1" />
                    </div>
                    <TextInput
                      name={'tag'}
                      // value={ns.tag}
                      {...form.getInputProps('tag')}
                      size='sm'
                      // onChange={e => handleInputChange(e, key)}
                      placeholder="Enter node tag"
                      label={<>Tags (optional)</>}

                    />
                  </SimpleGrid>
                </Box>


                <Box mb={16} className='px-8 py-5 relative z-0'>

                  <Group mb={15}>
                    <Text size={20} fw={500}>Choose Authentication Method</Text>
                  </Group>
                  <Box mb={20}>
                    <VmAuthBox {...form.getInputProps('vmAuth')} data={[
                      { description: 'Use an SSH key pair to connect to your Node.', title: 'SSH Key', value: "sshKey" },
                      { description: 'Connect to your Node as the "root" user using a password.', title: 'Password', value: "password" },
                    ]} onChange={(event: any) => {
                      setselectedAuth(event);

                      updateVmCartMutation.mutate({ vmAuth: event, id: cartid }, {
                        onSuccess(data, variables, context) {
                          utils.cart.refreshVmCart.invalidate()
                        },
                        onError(error, variables, context) {
                          console.log(error);
                        },
                      })

                      form.getInputProps(`vmAuth`).onChange(event)
                    }} />

                  </Box>

                  {selectedAuth == "sshKey" &&
                    <>
                      <Paper className='bg-white  px-6 py-6 relative  border-gray-200 border' >
                        <div className="absolute left-[100px] top-0 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-l border-t border-gray-300"></div>
                        <Text fw={600} size={15}>Include a public SSH key.</Text>
                        <Text mt={5} size={15} className='text-gray-500'>SSH keys are a more secure technique of logging into an SSH server since they are not subject to standard brute-force password hacking attacks.</Text>
                        <Input.Wrapper {...form.getInputProps('sshKey')} >
                          <Box className='pb-2'>
                            {_.isEmpty(form.values.sshKey) ?
                              <SSHKeyInput label={"Add SSH Key"} {...form.getInputProps('sshKey')} onChange={(item) => {
                                form.setFieldValue("sskLabel", item.label)
                                form.setFieldValue("sshKey", item._id)
                              }} />
                              : <>
                                <Box className='py-2 px-4 bg-blue-50 my-2'>


                                  <Group>
                                    <Text>SSH Key: {truncate(form.values.sskLabel, {
                                      length: 40,
                                      omission: "..."
                                    })}</Text>
                                    <ActionIcon onClick={() => {
                                      form.setFieldValue("sskLabel", "")
                                      form.setFieldValue("sshKey", "")
                                    }}>
                                      <AiOutlineDelete />
                                    </ActionIcon>
                                  </Group>



                                </Box>

                                <SSHKeyInput {...form.getInputProps('sshKey')} label={"New SSH Key"} onChange={(item) => {
                                  form.setFieldValue("sskLabel", item.label)
                                  form.setFieldValue("sshKey", item._id)
                                }} />


                              </>}
                          </Box>
                        </Input.Wrapper>
                      </Paper>
                    </>}

                  {selectedAuth == "password" &&
                    <>
                      <Paper className='bg-white px-6 py-6 relative  border-gray-200 border ' >
                        <div className="absolute right-[40%] top-0 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-l border-t border-gray-300"></div>
                        <div className='space-y-4'>
                          <Group spacing={5} >
                            <Text fw={600} size={15}>Create root password</Text>
                            <Tooltip withArrow withinPortal multiline width={200} label={<Text>Please keep your password secure. You will not receive an email containing the Nodes&lsquo; details or password.
                            </Text>}>
                              <ActionIcon><AiOutlineInfoCircle size={20} /></ActionIcon>
                            </Tooltip>
                          </Group>
                          <div className=' max-w-md'><PasswordInputBox {...form.getInputProps('password')} /></div>
                        </div>

                      </Paper>
                    </>}

                </Box>
              </Box>
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
                        <Button loading={completeVOrderMutation.isLoading} type='submit' radius={"xl"} size="md" className=' bg-azure-radiance-500 hover:bg-azure-radiance-600' fullWidth>Order</Button>
                      </Group>
                    </Card.Section>
                  </Card>
                </StickyBox>
              </Box>
            </Flex>
          </form>
        </Container>
      </div>
    </>
  )
}

export default Provision

export async function getServerSideProps(context: any) {
  const { req, res }: ServerSideProps = context;

  const query = context.query;

  let session: any = await AuthCheck(req, res)
  let regions: any = await ServerRegionsD(req, res)
  let vmConfig: any = await ServerCartConfig(context)
  let config = await Config();

  let customer = session?.customer[0]
  // middleChecker(req, res, customer)

  // if (_.isEmpty(session)) {
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   }
  // }

  return {
    props: {
      session,
      vmConfig,
      config,
      query,
      regions
    },
  }
}
