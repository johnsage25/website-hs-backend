import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Drawer,
  Flex,
  Group,
  Image,
  Input,
  Menu,
  Paper,
  ScrollArea,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { IconAlertCircle, IconChevronLeft } from '@tabler/icons'
import React, { useState } from 'react'
import GooglePayIcon from '../../Components/icons/GooglePayIcon'
import MasterCardIcon from '../../Components/icons/MasterCardIcon'
import PaypalIcon from '../../Components/icons/PaypalIcon'
import { useForm } from '@mantine/form'
import CreditCardInput from 'react-credit-card-input'
import { trpc } from '../../utils/trpc'
import _ from 'lodash'
import { IconDots } from '@tabler/icons-react'
import { Ucword } from '../../Components/TextFormatter'
import { isMastercardExpired } from '../../utils/helpers'
import { AiOutlineMore, AiOutlineSetting } from 'react-icons/ai'
import { useDisclosure } from '@mantine/hooks'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js'
import StripePaymentBlock from './StripePaymentBlock'
import CardPaymentIcon from '../../Components/icons/CardPaymentIcon'
import CreditCardIcon from '../../Components/icons/CreditCardIcon'
import { IconChevronRight } from '@tabler/icons-react'
import GooglePayBlock from './GooglePayBlock'
import PaypalBlock from './PaypalBlock'

const PaymentMethods = (props: any) => {
  const theme = useMantineTheme()
  const [paymentDrawer, setPaymentDrawer] = useState(false)
  const [opened, { open, close }] = useDisclosure(false);
  const paymentMethodsQuery = trpc.account.getSavedCards.useQuery()
  const [activeId, setActiveID] = useState("");

  let billingaddress = props?.customer[0].BillingAddress
  let customer = props?.customer[0];

  const [showSelected, setshowSelected] = useState<{ id: string, title: string, descript: string, icon: any } | null>()


  let cards: any = paymentMethodsQuery.data || []

  const paymentMethods: { id: string, title: string, descript: string, icon: any }[] = [
    {
      id: "paypal",
      title: "Connect PayPal",
      icon: PaypalIcon,
      descript: "Connect your PayPal account for automatic payments"
    },
    {
      id: "gpay",
      icon: GooglePayIcon,
      title: "Connect Google Pay",
      descript: "Connect a payment method via your Google Pay account"
    },
    {
      id: "card",
      icon: CreditCardIcon,
      title: "Add a credit card",
      descript: "We accept Visa, Mastercard, American Express, UnionPay, and Discover credit cards."
    }
  ];


  return (
    <>
      <Paper py={15} p="md" className="flex flex-col border">
        <div className="pb-2 flex justify-between border-b border-b-gray-200">
          <Title order={5} fw={400}>
            Payment Methods
          </Title>
          <Anchor
            size={15}
            onClick={() => {
              open()
            }}
          >
            Add Payment Mothod
          </Anchor>
        </div>

        <div className="py-2 space-y-2 ">

          {!_.isEmpty(cards?.data) ? <>

            <Box h={180} type="scroll" offsetScrollbars component={ScrollArea} className=' overflow-visible'>
              <div className=' space-y-3 w-full'>
                {cards.data.slice(0, 4)?.map((item: any, key: number) => {

                  return (
                    <div onClick={() => {
                      setActiveID(item.id)
                    }} key={key} className={` ${_.isEqual(activeId, item.id) ? "  border-azure-radiance-500 border" : " border"} border cursor-pointer hover:bg-slate-50  w-full px-3 rounded-md py-2`}>
                      <UnstyledButton className=' justify-between items-center w-full flex'>
                        <Group spacing={10} className='basis-1/2'>
                          <Image src={`/svg/${item.card?.brand}.svg`} fit="contain" height={30} width={30} alt={item.card?.brand} />
                          <Text fw={500} size={"sm"}>{Ucword(item.card?.brand)}</Text>
                          <IconDots />
                          <Group>
                            {!isMastercardExpired(item.card?.exp_year, item.card?.exp_month) ? (
                              <Badge size='sm' variant="dot" className=' text-azure-radiance-500'>Active</Badge>
                            ) : <><Badge size='sm' variant="dot" color='red' className=' text-red-500'>Expired</Badge></>}

                          </Group>
                        </Group>
                        <Group>
                          <Text color='dimmed' size={'sm'}>{`${item.card?.exp_month}/${item.card?.exp_year}`}</Text>
                          <Menu withArrow shadow="sm" position="bottom-end" >
                            <Menu.Target>
                              <ActionIcon variant='default' radius={"xl"}><AiOutlineMore /></ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item ><Text size={'sm'}>Make a Payment</Text></Menu.Item>
                              <Menu.Item ><Text size={"sm"}>Update Card</Text></Menu.Item>
                            </Menu.Dropdown>
                          </Menu>

                        </Group>

                      </UnstyledButton>
                    </div>
                  )
                })}

              </div>
            </Box>
          </> : <>
            <Alert icon={<IconAlertCircle size={16} />} color="blue">
              You have not added any payment method.
            </Alert>

            <div className="flex justify-center py-4">
              <Group className=" justify-self-center mx-auto">
                <UnstyledButton
                  onClick={() => {
                    open()
                  }}
                  className="py-1 rounded-md border-2 border-solid border-gray-100 px-4"
                >
                  <MasterCardIcon className=" w-12 h-12" />
                </UnstyledButton>
                <UnstyledButton
                  onClick={() => {
                    open()
                  }}
                  className="py-1 rounded-md border-2 border-solid border-gray-100 px-4"
                >
                  <PaypalIcon className=" w-12 h-12" />
                </UnstyledButton>
              </Group>
            </div>
          </>}




        </div>
        <Group position='center' mt={0}>
          <Button variant="subtle" size='sm' radius={"xl"}>View all</Button>
        </Group>
      </Paper>

      <Drawer.Root position="right"

        size={"40%"} closeOnClickOutside={false} opened={opened} onClose={() => {
          setshowSelected(null)
          close()
        }}>
        <Drawer.Overlay color={theme.colorScheme === 'dark'
          ? theme.colors.dark[9]
          : theme.colors.gray[2]} opacity={0.55} blur={3} />
        <Drawer.Content>
          <Drawer.Header className=' px-6 border-b h-14'>
            {_.isEmpty(showSelected) ?
              <>
                <Drawer.Title className="text-gray-700 font-semibold">Add Payment Method</Drawer.Title>
                <Drawer.CloseButton />
              </> :
              <>
                <Group>
                  <ActionIcon onClick={() => {
                    setshowSelected(null)
                  }}>
                    <IconChevronLeft size={19} />
                  </ActionIcon>
                  <div>
                    <Drawer.Title className="text-gray-700 font-semibold">{showSelected.title}</Drawer.Title>

                  </div>
                </Group>

                <Drawer.CloseButton />
              </>
            }

          </Drawer.Header>
          <Drawer.Body>
            {_.isEmpty(showSelected) && <>
              <Box className='py-6 space-y-3 px-6 w-full'>
                {paymentMethods?.map((item, key) => {
                  return (
                    <>
                      <UnstyledButton onClick={() => {
                        setshowSelected(item)
                      }} className='hover:bg-slate-50 border border-gray-300 border-solid w-full px-4 py-4'>
                        <Flex justify={"space-between"} align={"center"}>
                          <div className='flex gap-3 items-center'>
                            <div><item.icon className=' w-10 h-10' /></div>
                            <div>
                              <Text>{item.title}</Text>
                              <Text size={13} className=' text-gray-500'>{item.descript}</Text>
                            </div>
                          </div>
                          <div><IconChevronRight className=' text-gray-500' size={24} /></div>
                        </Flex>
                      </UnstyledButton>
                    </>
                  )
                })}
              </Box></>}

            {_.isEqual(showSelected?.id, "card") && <StripePaymentBlock {...props} />}
            {_.isEqual(showSelected?.id, "gpay") && <GooglePayBlock {...props} />}
            {_.isEqual(showSelected?.id, "paypal") && <PaypalBlock {...props} />}

          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

    </>
  )
}

export default PaymentMethods
