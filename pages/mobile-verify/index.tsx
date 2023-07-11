import { Alert, Box, Button, Grid, Group, Header, Image, Input, PinInput, Text, UnstyledButton } from '@mantine/core'
import { Menu, MenuItem } from '@szhsin/react-menu'
import Head from 'next/head'
import React, { useState } from 'react'
import { AiOutlineGlobal } from 'react-icons/ai'
import { trpc } from '../../utils/trpc'
import { useForm } from '@mantine/form'
import { SignupMobileInterface } from '../../Types/SignupMobileInterface'
import PhoneInput from 'react-phone-input-2'
import StepWizard from 'react-step-wizard'
import { useRouter } from 'next/router'
import { IconAlertCircle } from '@tabler/icons'
import OtpTimer from 'otp-timer'

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
                            Confirm
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



const Index = (props: any) => {

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

export default Index