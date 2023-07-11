import {
  Button,
  Paper,
  Text,
  Modal,
  useMantineTheme,
  Input,
  TextInput,
  Anchor,
  Transition,
  Alert,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useRef, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import { trpc } from '../../utils/trpc'
import AuthCode from 'react-auth-code-input'
import dynamic from 'next/dynamic'

import OtpInput from 'react-otp-input'
import { toast } from 'react-hot-toast'
import { IconAlertCircle } from '@tabler/icons'
import Router from 'next/router'

// const ReactCodeInput = dynamic(import('react-code-input'))

function MobileSecurityBlock(props: any) {
  const [currentNumber, setcurrentNumber] = useState(
    props.session.customer[0].mobile,
  )
  const updateMobileMutation = trpc.profile.updateMobile.useMutation()
  const [modalUpdate, setmodalUpdate] = useState(false)
  const [inputRequired, setinputRequired] = useState(false)
  const inputRef:any = useRef<any>()
  const theme = useMantineTheme()
  const [otpCode, setotpCode] = useState('')
  const verifyMobileMutation = trpc.profile.verifyMobile.useMutation()
  const [verifyCode, setverifyCode] = useState(false)
  const [showError, setshowError] = useState(false)
  const [invalidOtp, setinvalidOtp] = useState(false)
  const [number, setnumber] = useState<any>('')

  const form = useForm({
    initialValues: {
      phone: '',
    },
  })

  const handleOnChange = (value: any) => {
    setotpCode(value)
  }

  return (
    <div>
      <Paper className="flex flex-col space-y-2 py-7 min-h-[80px]">
        <Text size={18} fw={500} className="text-gray-700">
          Phone Verification
        </Text>

        <div className="flex flex-row items-center  space-y-4 basis-1/1">
          <div className="space-y-4 flex">
            <div className="flex flex-col   space-y-4 basis-3/4">
              <div>
                <Text size={15} className="text-gray-500 block space-y-2">
                  A verified phone number gives our staff a safe way to confirm
                  that you are the legitimate holder of your HostSpacing user
                  account. Always send an SMS message with a verification code
                  using this phone number. There can be standard carrier texting
                  charges. You provide consent to receive SMS messages by
                  clicking Update Number.
                </Text>
              </div>
              <div className='flex space-x-2 bg-green-100 w-1/2  py-2.5 px-4 border-l-green-600 border-l-4'>
                <Text size={15} fw={500}>Phone Number:</Text>
                <Text size={15}>+{currentNumber}</Text>
              </div>
            </div>
            <div className="basis-1/4 md:basis-1/4 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  setmodalUpdate(true)
                }}
                radius={'xl'}
                className="hover:bg-lochmara-500 bg-lochmara-400"
              >
                Update Number
              </Button>
            </div>
          </div>
        </div>
      </Paper>

      <Modal
        opened={modalUpdate}
        title={
          <Text size={18} fw={500}>
            Mobile Update
          </Text>
        }
        size={500}
        closeOnClickOutside={false}
        onClose={() => {
          setmodalUpdate(false)
        }}
        overlayProps={{
          color: theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3
        }}
      >
        {verifyCode ? (
          <Transition
            mounted={verifyCode}
            transition="slide-right"
            duration={500}
            timingFunction="ease"
          >
            {(styles) => (
              <Paper py={10} className=" space-y-6" style={styles}>
                <div>
                  <Text fw={500} size={17}>
                    Verification Code
                  </Text>
                  <Text size={15} className=" font-light">
                    Please type the verification code sent to your number.
                  </Text>
                </div>
                {invalidOtp && (
                  <Alert
                    className=" border border-red-500"
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                  >
                    I&apos;m sorry, but the code you provided is invalid. Please
                    double-check it and try again.
                  </Alert>
                )}

                <div className=" flex justify-center">
                  <OtpInput
                    value={otpCode}
                    isInputNum={true}
                    inputStyle={' py-2 px-2 border otp-code h-12'}
                    onChange={handleOnChange}
                    numInputs={6}
                    separator={<span className="px-2"></span>}
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-4 items-center">
                  <Anchor
                    onClick={() => {
                      setverifyCode(false)
                    }}
                  >
                    Cancel
                  </Anchor>
                  <Button
                    loading={updateMobileMutation.isLoading}
                    type="submit"
                    radius={'xl'}
                    onClick={() => {
                      updateMobileMutation.mutate(
                        { number: number, code: otpCode },
                        {
                          onSuccess(data: any, variables, context) {
                            // console.log(data)
                            if (data.status) {

                              setmodalUpdate(false)
                              setTimeout(() => {
                                toast.success(
                                    'Your mobile number is now updated.',
                                  )
                                  setverifyCode(false)
                                  setnumber('')
                                  Router.reload()
                              }, 200);


                            } else {
                                setinvalidOtp(true)
                            }
                          },
                          onError(error, variables, context) {
                            // console.log(error)
                            setinvalidOtp(true)
                          },
                        },
                      )
                    }}
                    disabled={otpCode.length !== 6}
                    className=" bg-lochmara-400"
                  >
                    Verify
                  </Button>
                </div>
              </Paper>
            )}
          </Transition>
        ) : (
          <Paper py={10}>
            <form
              className="space-y-4"
              onSubmit={form.onSubmit((values: any) => {
                if (inputRef.current.numberInputRef.value < 5) {
                  setinputRequired(true)
                } else
                  verifyMobileMutation.mutate(
                    { number: values.mobile },
                    {
                      onSuccess(data: any, variables, context) {
                        if (data.opt_screen) {
                          setnumber(values.mobile)
                          setverifyCode(true)
                        } else {
                          setshowError(true)
                        }
                      },
                      onError(error, variables, context) {
                        setshowError(true)
                      },
                    },
                  )
              })}
            >
              {showError && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                  className=" border border-red-500"
                >
                  If you are seeing this error, it means that the mobile number
                  you are trying to use is either invalid or already in use.
                  This can happen for a number of reasons, so please
                  double-check the number and try again. If you continue to see
                  this error, please contact customer support for assistance.
                </Alert>
              )}

              <div>
                <Text fw={500}>Current Number</Text>
                <div className=" bg-gray-100 px-3 py-2 border border-solid border-gray-300">
                  <Text>{`+${currentNumber}`}</Text>
                </div>
              </div>
              <Input.Wrapper
                size="md"
                label="New Number"
                className=" space-y-2 w-full"
              >
                <PhoneInput
                  country={'us'}
                  inputClass="w-full"
                  ref={inputRef}
                  enableSearch={true}
                  inputStyle={{ width: '100%' }}
                  containerClass="w-full"
                  {...form.getInputProps('mobile')}
                  onChange={(event: any) => {
                    if (form.getInputProps(`mobile`).onChange) {
                      form.getInputProps(`mobile`).onChange(event)
                      setinputRequired(false)
                    }
                  }}
                />
                {inputRequired && (
                  <Input.Error size={'md'}>
                    Phone number is required
                  </Input.Error>
                )}
              </Input.Wrapper>
              <div className="pt-2 flex justify-end">
                <Button
                  loading={verifyMobileMutation.isLoading}
                  type="submit"
                  radius={'xl'}
                  className=" bg-lochmara-400"
                >
                  Update
                </Button>
              </div>
            </form>
          </Paper>
        )}
      </Modal>
    </div>
  )
}

export default MobileSecurityBlock
