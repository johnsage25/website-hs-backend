import React, { useState } from 'react'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import { Menu, MenuItem, MenuButton, MenuDivider } from '@szhsin/react-menu'
import {
  Alert,
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  Group,
  Header,
  Image,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { AiOutlineGlobal } from 'react-icons/ai'
import Link from 'next/link'
import _ from 'lodash'
import { useForm, yupResolver } from '@mantine/form'
import * as Yup from 'yup'
import { trpc } from '../../utils/trpc'
import { LoginInterface } from '../../Types/LoginInterface'
import { IconAlertCircle } from '@tabler/icons'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { FcGoogle } from 'react-icons/fc'
import { VscGithubInverted } from 'react-icons/vsc'
import Head from 'next/head'

const Index = (props: AppProps) => {
  let loginMutation = trpc.login.doEmail.useMutation()
  const { isLoading } = loginMutation
  const [invalidLogin, setinvalidLogin] = useState(false)
  const router = useRouter()
  const schema = Yup.object().shape({
    email: Yup.string().required('Email or Username is required'),
    password: Yup.string().required('Password is required'),
  })

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
      trust_device: false,
    },
  })

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main>
        <Header
          height={60}
          className="shadow z-50 relative flex px-14 items-center justify-between w-full border-b border-b-gray-300 bg-white"
        >
          <UnstyledButton href={'/'} component={'a'}>
            <Image src={'./hostspacing_logo.svg'} width={200} alt="logo" />
          </UnstyledButton>
          <div className="lang-icon">
            <Menu
              position="initial"
              menuButton={
                <UnstyledButton className="py-1">
                  <Group>
                    <AiOutlineGlobal />
                    <div style={{ flex: 1 }}>
                      <Text size="sm" weight={500}>
                        English (US)
                      </Text>
                    </div>

                    {/* <IconChevronRight size={14} stroke={1.5} /> */}
                  </Group>
                </UnstyledButton>
              }
            >
              <MenuItem>French</MenuItem>
              <MenuItem>German</MenuItem>
            </Menu>
          </div>
        </Header>
        <div className="overflow-hidden min-h-screen bg-slate-100">
          <Grid columns={20} className="divide-x" m={0}>
            <Grid.Col className="min-h-screen" span={12}></Grid.Col>
            <Grid.Col span={8} className="bg-white">
              <Paper className=" px-20 py-28 space-y-4 z-30 overflow-hidden min-h-screen">
                <Text fw={600} size={26}>
                  Log in
                </Text>
                <div className="flex space-x-2">
                  <Button
                    radius={'xl'}
                    leftIcon={<FcGoogle size={28} />}
                    fullWidth
                    variant="default"
                  >
                    <Text>Google</Text>
                  </Button>

                  <Button
                    radius={'xl'}
                    leftIcon={<VscGithubInverted size={28} />}
                    fullWidth
                    variant="default"
                  >
                    <Text>Github</Text>
                  </Button>
                </div>
                <Divider />
                {invalidLogin && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    title=" Incorrect email or password"
                    className=" border border-red-500"
                  >
                    <Text size={15}>
                      The email or password you entered is incorrect. Please try
                      again or <Anchor href="/support">contact support</Anchor>{' '}
                      if you are unable to access your account.
                    </Text>
                  </Alert>
                )}

                <form
                  onSubmit={form.onSubmit((values) => {
                    let loginData: LoginInterface = {
                      ...values,
                    }

                    loginMutation.mutate(loginData, {
                      onSuccess(data: any, variables, context) {
                        if (data?.status) {
                          let { redirectTo, redirect } = router.query

                          if(redirect){
                            window.location.href = `${redirect}`
                          }
                          // console.log(router.query);

                          if (redirectTo) {
                            router.push('/order/summary')
                          } else {
                            router.push('/')
                          }

                        }
                      },
                      onError(error, variables, context) {
                        // console.log(error)
                        setinvalidLogin(true)
                      },
                    })
                  })}
                  className="space-y-6"
                >
                  <TextInput
                    label="Username"
                    size="md"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                  />

                  <PasswordInput
                    placeholder="Password"
                    label="Password"
                    size="md"
                    {...form.getInputProps('password')}
                  />

                  <Checkbox
                    mt="md"
                    label="Trust this device for 30 days"
                    {...form.getInputProps('trust_device', {
                      type: 'checkbox',
                    })}
                  />

                  <div>
                    <Button
                      size="md"
                      type="submit"
                      fullWidth
                      loading={isLoading}
                      radius={'xl'}
                      className=" bg-lochmara-400"
                    >
                      Submit
                    </Button>
                  </div>
                  <div className="text-center">
                    <Anchor size={'md'}>
                      <Text size={14}>Forgot your password?</Text>
                    </Anchor>
                    <Divider
                      my="xs"
                      label={<Text size={15}>Or</Text>}
                      labelPosition="center"
                    />
                    <Text size={14}>
                      Need an account?{' '}
                      <Anchor href={'/register'}>Sign up here.</Anchor>
                    </Text>
                  </div>
                </form>
              </Paper>
            </Grid.Col>
          </Grid>
        </div>
      </main>
    </>
  )
}

export default Index

export async function getServerSideProps({ req, res }: ServerSideProps) {
  let session = await AuthCheck(req, res)

  if (!_.isEmpty(session)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
