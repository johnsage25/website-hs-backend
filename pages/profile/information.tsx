import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Group,
  HoverCard,
  Image,
  Notification,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { WithTheme } from '../_Layout/HocLayout'
import TabLayout from '../_Layout/TabLayout'
import _ from 'lodash'
import { ServerSideProps } from '../../Types/ServerInterface'
import { AuthCheck } from '../../node/AuthCheck'
import ProfileTab from '../_Layout/ProfileTab'
import { RxOpenInNewWindow, RxQuestionMarkCircled } from 'react-icons/rx'
import { CustomerType } from '../../Types/CustomerType'
import { NextPage } from 'next'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'
import AvatarListImage from '../../Components/icons/AvatarListImage'
import AvatarList from '../../public/svg/avatarlist.svg'
import { BsPlusCircle } from 'react-icons/bs'
import { useState } from 'react'
import { trpc } from '../../utils/trpc'
import { toast } from 'react-hot-toast'
import { IconCheck } from '@tabler/icons'
import Head from 'next/head'
import middleChecker from '../../node/middleChecker'

function Information(props: NextPage | any) {
  const [timezoneDefault, setTimezoneDefault] = useState<any | string>(
    props.session.customer[0].timezone || '',
  )
  const [username, setUsername] = useState<any | string>(
    props.session.customer[0].username || '',
  )
  const [email, setEmail] = useState<any | string>(
    props.session.customer[0].email || '',
  )
  const [enableUserButon, setenableUserButon] = useState<any>(true)
  const [enableEmailButon, setenableEmailButon] = useState<any>(true)
  const [enableTimezoneButon, setenableTimeZoneButon] = useState<any>(true)
  const [isEmailVerify, setisEmailVerify] = useState(true)
  const [messageEmail, setmessageEmail] = useState<string>("")

  /// Username update mutation
  let usernameMutation = trpc.profile.usernameUpdate.useMutation()
  let timezoneMutation = trpc.profile.updateTimezone.useMutation()
  let emailMutation = trpc.profile.updateEmail.useMutation<any>()


  return (
    <WithTheme props={props}>
      <ProfileTab
        title={'Profile Information'}
        buttonAction={<div className="h-[36px]"></div>}
      >
        <div className=" min-h-[40vh] mb-16">
          <div className="flex flex-col min-h-[200px]">
            <Paper className="flex flex-col min-h-[200px] pt-4 pb-12 px-8 divide-y space-y-3 border rounded-none" >
              <div className="flex space-x-3 py-3">
                <div className="flex space-x-3 py-3">
                  <Avatar size={120} radius={200} src={props.session.image_url} />
                  <div className="basis-1/2 space-y-3">
                    <div className="flex space-x-2">
                      <Text size={19} fw={500} className="text-gray-700">
                        Profile photo
                      </Text>

                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <ActionIcon radius={'xl'}>
                            <RxQuestionMarkCircled size={25} />
                          </ActionIcon>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size={15}>
                            Use the same email address you use for your HostSpacing
                            account to sign up for a{' '}
                            <Anchor href="https://gravatar.com">
                              gravatar.com
                            </Anchor>{' '}
                            account. To instantly link your profile image, upload it
                            to your Gravatar account.
                          </Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </div>

                    <Text className="text-gray-500">
                      Create, upload, and manage your globally recognized avatar
                      from a single place with Gravatar.
                    </Text>
                    <Button
                      component="a"
                      href="https://gravatar.com"
                      target={'_blank'}
                      className=" bg-lochmara-400"
                      radius={'xl'}
                      rightIcon={<RxOpenInNewWindow />}
                    >
                      Add photo{' '}
                    </Button>
                  </div>
                </div>

                <div className="h-48 w-52 relative">
                  <Image
                    src={'/svg/avatarlist.svg'}
                    alt={''}
                    className="w-full h-full opacity-50"
                  />
                  <div className="absolute h-10 w-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl">
                    <HoverCard width={280} shadow="md" withArrow>
                      <HoverCard.Target>
                        <ActionIcon
                          color="blue"
                          size={40}
                          className=" bg-lochmara-300 shadow-2xl"
                          radius="xl"
                          variant="filled"
                        >
                          <BsPlusCircle size={28} />
                        </ActionIcon>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <Text size="sm">
                          Click here to select from a list of HostSpacing custom
                          Avatar images.
                        </Text>
                      </HoverCard.Dropdown>
                    </HoverCard>
                  </div>
                </div>
              </div>

              <div>
                <div className=" py-4 flex items-center">
                  <div className="basis-1/2">
                    <TextInput
                      placeholder="Profile Username"
                      label="Profile Username"
                      value={username}
                      onChange={(e) => {
                        if (e.target.value == props.session.customer[0].username) {
                          setenableUserButon(true)
                        } else {
                          setenableUserButon(false)
                        }
                        setUsername(e.target.value)
                      }}
                    />
                  </div>
                  <div className="basis-1/2 flex justify-end">
                    <Button
                      radius={'xl'}
                      disabled={enableUserButon}
                      loading={usernameMutation.isLoading}
                      className=" bg-lochmara-300 hover:bg-lochmara-400"
                      onClick={() => {
                        usernameMutation.mutate(
                          { name: username },
                          {
                            onSuccess(data, variables, context) {
                              setenableUserButon(true)
                              toast.success('Username successfully updated!')
                            },
                            onError(error, variables, context) {
                              toast.error('Unknown error')
                              setenableUserButon(false)
                            },
                          },
                        )
                      }}

                    >
                      Update Username
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className=" py-4 flex items-center">
                  <div className="basis-1/2">
                    <TextInput
                      value={email}
                      error={!props.session.customer[0].isEmailVerify || !isEmailVerify ? messageEmail : messageEmail}
                      onChange={(e) => {
                        if (e.target.value == props.session.customer[0].email) {
                          setenableEmailButon(true)
                        } else {
                          setenableEmailButon(false)
                        }

                        setEmail(e.target.value)
                      }}
                      placeholder="Email Address"
                      label="Email Address"
                    />
                  </div>
                  <div className="basis-1/2 flex justify-end">
                    <Button
                      radius={'xl'}
                      disabled={enableEmailButon}
                      loading={emailMutation.isLoading}
                      onClick={() => {
                        emailMutation.mutate({ email: email }, {
                          onSuccess(data, variables, context) {
                            setisEmailVerify(false)
                            setenableEmailButon(true)
                            setmessageEmail("Email verification is required.")
                            toast.success('Email successfully updated!')
                            setEmail(email)
                          },
                          onError(error: any, variables: any, context) {
                            setenableEmailButon(false)
                            // console.log(error?.data.code);
                            setEmail(email)
                            if (error?.data.code == "INTERNAL_SERVER_ERROR") {
                              setmessageEmail("This email is already connected to an account.")
                            } else

                              toast.error('Unknown error')
                          },
                        })

                      }}
                      className=" bg-lochmara-300 hover:bg-lochmara-400"
                    >
                      Update Email
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className=" py-4 flex items-center">
                  <div className="basis-1/2">
                    <Select
                      searchable
                      data={props.session.timezones?.default?.map((d: any) => {
                        return { value: d.tzCode, label: d.label }
                      })}
                      label="Timezone"
                      value={timezoneDefault}
                      onChange={(e) => {
                        setTimezoneDefault(e)
                        if (e == props.session.customer[0]?.timezone) {
                          setenableTimeZoneButon(true)
                        } else {
                          setenableTimeZoneButon(false)
                        }
                      }}
                      placeholder="Timezone"
                      dropdownComponent="div"
                    />
                  </div>
                  <div className="basis-1/2 flex justify-end items-center">
                    <Button
                      radius={'xl'}
                      disabled={enableTimezoneButon}
                      loading={timezoneMutation.isLoading}
                      onClick={() => {
                        timezoneMutation.mutate({ timezone: timezoneDefault }, {
                          onSuccess(data, variables, context) {
                            toast.success('Timezone successfully updated!')
                            setenableTimeZoneButon(true)
                          },
                          onError(error, variables, context) {
                            toast.error('Unknown error')
                            setenableTimeZoneButon(false)
                          },
                        })
                      }}
                      className=" bg-lochmara-300 hover:bg-lochmara-400"
                    >
                      Update Timezone
                    </Button>
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </ProfileTab>
    </WithTheme>
  )
}

let pageLout = Information

Information.getLayout = function getLayout(page: any) {

  return (
    <>
      <Head>
        <title>Profile Information - HostSpacing</title>
      </Head>

      {page}

    </>
  )
}

export default pageLout

export async function getServerSideProps({ req, res }: ServerSideProps) {
  let session: any = await AuthCheck(req, res)

  if (_.isEmpty(session)) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  let customer = session.customer[0]
  middleChecker(req, res, customer)


  return {
    props: {
      session,
      data: {
        title: 'My Page',
        content: 'Lorem ipsum dolor sit amet'
      }
    },
  }
}
