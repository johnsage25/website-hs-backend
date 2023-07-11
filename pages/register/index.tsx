import {
  Grid,
  Header,
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  Title,
  Text,
  PasswordInput,
  Anchor,
  Alert,
  SimpleGrid,
  Select,
  NativeSelect,
  Image,
  Container,
  UnstyledButton,
  Input,
  Divider,
  PinInput,
} from '@mantine/core'
import React, { useMemo, useState } from 'react'
import LogoW from '../../Components/LogoW'
import { useForm, yupResolver } from '@mantine/form'
import { trpc } from '../../utils/trpc'
import * as Yup from 'yup'
import { SignUpInterface } from '../../Types/SignUpInterface'
import { IconAlertCircle } from '@tabler/icons'
import { useSetState } from '@mantine/hooks'
import { useRouter } from 'next/router'
import StepWizard from 'react-step-wizard'
import countryList from 'react-select-country-list'
import { Country, State, City } from 'country-state-city'
import { Menu, MenuItem, MenuButton, MenuDivider } from '@szhsin/react-menu'
import { AiOutlineGlobal } from 'react-icons/ai'
import Link from 'next/link'
import { SignUpBillingInterface } from '../../Types/SignUpBillingInterface'
import PhoneInput from 'react-phone-input-2'
import { SignupMobileInterface } from '../../Types/SignupMobileInterface'
import dynamic from 'next/dynamic'
import OtpTimer from 'otp-timer'
import _ from 'lodash'
import { AuthCheck } from '../../node/AuthCheck'
import { ServerSideProps } from '../../Types/ServerInterface'
import { FcGoogle } from 'react-icons/fc'
import { VscGithubInverted } from 'react-icons/vsc'
import Head from 'next/head'

const OTPInput = dynamic(() => import('otp-input-react'), { ssr: false })

const Step1 = (props: any) => {
  const { isActive } = props

  const [error, seterror] = useSetState({
    message: '',
    status: false,
  })

  const signUpMutation = trpc.signup.create.useMutation()
  const { isLoading } = signUpMutation

  const schema = Yup.object().shape({
    email: Yup.string()
      .email('Must be a valid email')
      .max(255)
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password is too short - should be 6 chars minimum.')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Password must contain special symbol, lowercase uppercase and number.',
      ),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords must match',
    ),
    tos: Yup.boolean().oneOf(
      [true],
      'You must accept the terms and conditions',
    ),
  })

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      tos: false,
    },
  })

  return (
    <Box className=" px-20 py-20 space-y-4 overflow-hidden  min-h-screen">
      <Text fw={600} size={26}>
        Sign Up
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
      {error.status && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          className=" border border-red-500"
          color="red"
        >
          {error.message}
        </Alert>
      )}

      <form
        className="space-y-6"
        onSubmit={form.onSubmit((values) => {
          let data: SignUpInterface = {
            email: values.email,
            password: values.password,
            tos: values.tos,
          }
          signUpMutation.mutate(data, {
            onSuccess(data, variables, context) {

              // console.log(data);

              if (data.error) {
                if (data.duplicated) {
                  seterror({
                    message:
                      'Sorry, that email address is already associated with an account',
                    status: true,
                  })
                }
              }

              if (data.status == 'success') {
                props.nextStep()
              }
            },
            onError(error, variables, context) {
              // console.log(error);

            },
          })
        })}
      >
        <TextInput
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          placeholder="Password"
          label="Password"
          {...form.getInputProps('password')}
        />

        <PasswordInput
          placeholder="Password"
          label="Re-enter Password"
          {...form.getInputProps('passwordConfirmation')}
        />

        <Checkbox
          {...form.getInputProps('tos', { type: 'checkbox' })}
          label={
            <>
              I have read and agree to the{' '}
              <Anchor href="#">Terms of Service</Anchor> and
              <Anchor className="px-1" href="#">
                Privacy Policy Notice.
              </Anchor>{' '}
            </>
          }
        />

        <Button
          fullWidth
          size="md"
          type="submit"
          loading={isLoading}
          radius={'xl'}
          className=" bg-lochmara-400"
        >
          Sign Up
        </Button>

        <Divider
          my="xs"
          label={<Text size={15}>Or</Text>}
          labelPosition="center"
        />

        <div className="text-center">
          <Text size={15}>
            Already have an account? <Anchor href={'/login'}>Login.</Anchor>
          </Text>
        </div>
      </form>
    </Box>
  )
}

const Step2 = (props: any) => {
  const { isActive } = props
  const [stateList, setstateList] = useState<any[]>([{ value: '', label: '-' }])

  const signUpBillingMutation = trpc.signup.billing.useMutation()

  const { isLoading } = signUpBillingMutation

  const options = useMemo(() => countryList().getData(), [])

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
      state: '',
      city: '',
      address2: '',
      address: '',
    },
  })

  return (
    <>
      <Box className=" px-20 py-14 space-y-4 z-30 overflow-hidden  min-h-screen">
        <Text fw={600} size={26}>
          Billing Address
        </Text>

        <form
          className="space-y-4"
          onSubmit={billingForm.onSubmit((values) => {
            let data: SignUpBillingInterface = {
              ...values,
            }
            signUpBillingMutation.mutate(data, {
              onSuccess(data, variables, context) {
                // console.log(data);

                props.nextStep()
                // console.log(values)
              },
              onError(error, variables, context) {
                // console.log(error);

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

          <Grid columns={20}>
            <Grid.Col span={12}>
              <NativeSelect
                data={stateList}
                {...billingForm.getInputProps('state')}
                label="State/Province/Region"
              />
            </Grid.Col>
            <Grid.Col span={8}>
              <TextInput
                label="Postal Code"
                className="w-full"
                placeholder="Enter postal code"
                {...billingForm.getInputProps('postalcode')}
              />
            </Grid.Col>
          </Grid>

          <Button
            size="md"
            type="submit"
            loading={isLoading}
            radius={'xl'}
            className=" bg-lochmara-400"
          >
            Submit
          </Button>
        </form>
      </Box>
    </>
  )
}

const Step3Mobile = (props: any) => {
  const signUpMobileMutation = trpc.signup.verifyMobile.useMutation()

  const [inputRequired, setinputRequired] = useState(false)

  const form = useForm({
    initialValues: {
      mobile: '',
    },
  })

  const { isLoading } = signUpMobileMutation

  return (
    <>
      <Box className=" px-20 py-28 space-y-8 z-30 overflow-hidden  min-h-screen">
        <div className=" space-y-2">
          <Text fw={600} size={26}>
            Phone Number Verification
          </Text>
          <Text size={15} className=" font-light">
            We need to verify your phone number before getting started.
          </Text>
        </div>

        <form
          onSubmit={form.onSubmit((values) => {
            if (values.mobile.length < 1) {
              setinputRequired(true)
              return
            }
            let datad: SignupMobileInterface = {
              ...values,
            }
            signUpMobileMutation.mutate(datad, {
              onSuccess(data: any, variables, context) {
                if (data?.opt_screen) {
                  props.nextStep()
                }
              },
              onError(error, variables, context) {
                // console.log(error)
              },
            })
          })}
          className=" space-y-6"
        >
          <Input.Wrapper
            size="md"
            label="Your phone"
            className=" space-y-2"
            required
          >
            <PhoneInput
              country={'us'}
              inputClass="w-full"
              enableSearch={true}
              containerClass="w-full"
              {...form.getInputProps('mobile')}
              onChange={(event: any) => {
                if (form.getInputProps(`mobile`).onChange) {
                  form.getInputProps(`mobile`).onChange(event)
                }
              }}
            />
            {inputRequired && (
              <Input.Error size={'md'}>Phone number is required</Input.Error>
            )}
          </Input.Wrapper>

          <Button
            size="md"
            type="submit"
            loading={isLoading}
            radius={'xl'}
            className=" bg-lochmara-400"
          >
            Verify
          </Button>
        </form>
      </Box>
    </>
  )
}

const Step4Otp = (props: any) => {
  const router = useRouter()
  const signUpMobileOtpMutation = trpc.signup.verifyOtpMobile.useMutation()
  const { isLoading } = signUpMobileOtpMutation
  const [useError, setuseError] = useState(false)
  const [inputRequired, setinputRequired] = useState(false)
  const signUpMobileMutation = trpc.signup.verifyMobile.useMutation()

  const form = useForm({
    initialValues: {
      code: '',
    },
  })

  const showResend = () => {
    signUpMobileMutation.mutate({ mobile: 'none' })
  }

  return (
    <>
      {' '}
      <Box className=" px-20 py-28 space-y-8 z-30 overflow-hidden  min-h-screen">
        <div className=" space-y-2">
          <Text fw={600} size={26}>
            Verification Code
          </Text>
          <Text size={15} className=" font-light">
            Please type the verification code sent to your number.
          </Text>
        </div>
        {useError && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="light"
            className=" border border-red-500"
          >
            You entered an expired or invalid code, please press the resend
            button to receive another!
          </Alert>
        )}

        <form
          onSubmit={form.onSubmit((values) => {
            if (values.code.length < 1) {
              setinputRequired(true)
              return
            }

            let datad: SignupMobileInterface = {
              ...values,
            }
            signUpMobileOtpMutation.mutate(datad, {
              onSuccess(data: any, variables, context) {
                if (data!!.status) {
                  router.push('/')
                } else {
                  setuseError(true)
                }
              },
              onError(error, variables, context) {
                setuseError(true)
              },
            })
          })}
          className=" space-y-6"
        >
          <Input.Wrapper size="md" label="Code" className="space-y-2" required>

            <PinInput size='lg' {...form.getInputProps('code')} length={6} />

            {/* <OTPInput

              autoFocus
              OTPLength={6}
              otpType="number"
              inputClassName={' border border-gray-300 otp-input'}
              onChange={(event: any) => {
                if (form.getInputProps(`code`).onChange) {
                  form.getInputProps(`code`).onChange(event)
                }
              }}
              disabled={false}
            />
            {inputRequired && (
              <Input.Error size={'md'}>Code is required</Input.Error>
            )} */}
          </Input.Wrapper>

          <Group>
            <Button
              size="md"
              type="submit"
              loading={isLoading}
              radius={'xl'}
              className=" bg-lochmara-400"
            >
              Verify
            </Button>

            <div className="resend-b">
              <OtpTimer seconds={50} minutes={0} resend={showResend} />
            </div>


          </Group>
        </form>
      </Box>
    </>
  )
}

const Register = () => {
  const [wizardInstance, setwizardInstance] = useState<any>()

  let customTrasition = {
    enterRight: 'animate__fadeIn',
    enterLeft: 'animate__fadeIn',
    exitRight: 'animate__fadeOut',
    exitLeft: 'animate__fadeOut ',
    intro: 'animate__fadeIn',
  }

  return (
    <>
      <Head>
        <title>Register</title>
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
            <Grid.Col className="min-h-screen" span={11}></Grid.Col>
            <Grid.Col span={9} className="bg-white">
              <StepWizard
                initialStep={1}
                instance={setwizardInstance}
                transitions={customTrasition}
              >
                <Step1 stepName={'signup'} />
                <Step2 stepName={'billing'} />
                <Step3Mobile stepName={'Mobile'} />
                <Step4Otp stepName={'otp'} />
              </StepWizard>
            </Grid.Col>
          </Grid>
        </div>
      </main>
    </>
  )
}

export default Register

export async function getServerSideProps({ req, res }: ServerSideProps) {
  let session = await AuthCheck(req, res)

  // if (!_.isEmpty(session)) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   }
  // }

  return {
    props: {
      session,
    },
  }
}
