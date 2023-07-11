import {
  Box,
  Button,
  Image,
  Paper,
  Switch,
  Text,
  Modal,
  useMantineTheme,
  Stepper,
  ActionIcon,
  UnstyledButton,
  Alert,
  TextInput,
  CopyButton,
  Tooltip,
  List,
  SimpleGrid,
  Anchor,
  Divider,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconCheck,
  IconCopy,
  IconDownload,
} from '@tabler/icons'
import React, { useState } from 'react'
import AuthyIcon from '../../Components/icons/AuthyIcon'
import GoogleAuthIcon from '../../Components/icons/GoogleAuthIcon'
import OnePassword from '../../Components/icons/OnePassword'
import { trpc } from '../../utils/trpc'
import { toast } from 'react-hot-toast'
import { useSetState } from '@mantine/hooks'
import BrokenShield from '../../Components/BrokenShield'

function download(text: any, filename: any) {
  var blob = new Blob([text], { type: 'text/plain' })
  var url = window.URL.createObjectURL(blob)
  var a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

function ProfileSecurityBlock(props: any) {
  const theme = useMantineTheme()
  const [setup2fa, setsetup2fa] = useState(false)
  const [disableModal, setdisableModal] = useState(false)
  const enable2faMutation = trpc.profile.enable2fa.useMutation()
  const disable2faMutation = trpc.profile.disable2fa.useMutation()
  const create2faMutation = trpc.profile.create2fa.useMutation()
  const [twofaImage, settwofaImage] = useSetState({
    image2fa: '',
    recoveryCodes: [],
    secret: { base32: '' },
  })
  const [active, setActive] = useState(0)
  const [text2fa, settext2fa] = useState('')
  const [enableFinsh, setenableFinsh] = useState(true)
  const [done2fa, setdone2fa] = useState(
    props.session.customer[0].twoFactorEnabled || false,
  )
  const [error, seterror] = useState('')
  const {
    data,
    isSuccess,
  }: { data: any; isSuccess: boolean } = enable2faMutation
  return (
    <div>
      <Paper className="flex flex-col space-y-2 py-7 min-h-[80px]">
        <Text size={18} fw={500} className="text-gray-700">
          Two-factor authentication
        </Text>

        <div className="flex flex-row items-center  space-y-4 basis-1/1">
          <div className="space-y-4">
            <Text size={15} className="text-gray-500 block space-y-2">
              Add an extra layer of security to your account. To sign in,
              you&apos;ll need to provide a code along with your username and
              password.
            </Text>
          </div>

          <div className="basis-1/4 md:basis-1/4 flex justify-end">
            {done2fa ? (
              <Button
                radius={'xl'}
                onClick={() => {
                  setdisableModal(true)
                }}
                size="md"
                className="hover:bg-lochmara-500 bg-lochmara-400"
              >
                Disable 2FA
              </Button>
            ) : (
              <Button
                radius={'xl'}
                loading={create2faMutation.isLoading}
                onClick={() => {
                  create2faMutation.mutate(
                    { action: '' },
                    {
                      onSuccess(data: any, variables, context) {
                        setsetup2fa(true)
                        settwofaImage(data)
                      },
                      onError(error, variables, context) {
                        toast.error('Unknown error')
                      },
                    },
                  )
                }}
                size="sm"
                className="hover:bg-lochmara-500 bg-lochmara-400"
              >
                SetUp 2FA
              </Button>
            )}
          </div>
        </div>
      </Paper>

      <Modal.Root closeOnClickOutside={false} size={'xl'} opened={setup2fa} onClose={() => {
        setsetup2fa(false)
        setenableFinsh(true)
        setActive(0)
      }}>
        <Modal.Overlay opacity={0.55} blur={3} color={theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2]} />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Text size={18} fw={500}>
                Set up two factor authentication
              </Text>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Box>
              <Stepper
                active={active}
                orientation="vertical"
                size="sm"
                className={
                  'flex space-x-5 divide-x divide-gray-200 border-t py-4 border-t-gray-200 pb-4'
                }
              >
                <Stepper.Step label="Choose Method" className="w-48">
                  <div className="px-4 min-h-[400px] space-y-8">
                    <Text className=" text-gray-600">
                      You can generate security codes on your phone using an
                      authenticator app without needing to be text messaged. We
                      support any of these apps if you don&apos;t already have one.
                    </Text>
                    <div className="flex justify-center space-x-4">
                      <UnstyledButton>
                        <AuthyIcon className="block w-16 h-16 rounded-full" />
                      </UnstyledButton>

                      <UnstyledButton className=" py-2 px-2">
                        <OnePassword className="w-16 h-16" />
                      </UnstyledButton>

                      <UnstyledButton>
                        <GoogleAuthIcon className="w-16 h-16" />
                      </UnstyledButton>
                    </div>

                    <Alert icon={<IconAlertCircle size={16} />} radius="xs">
                      Get codes from an app like Authy, 1Password, Microsoft
                      Authenticator, or Google Authenticator. Download from either
                      google store or appstore.
                    </Alert>
                  </div>

                  <div className="flex justify-end justify-self-end">
                    <Button
                      className=" bg-lochmara-400"
                      size="md"
                      onClick={() => {
                        setActive(1)
                      }}
                      radius={'xl'}
                    >
                      NEXT
                    </Button>
                  </div>
                </Stepper.Step>
                <Stepper.Step label="Verify" className="w-48">
                  <div className="px-4 space-y-4 min-h-[400px]">
                    <Text fw={500} size={18}>
                      Connect your app
                    </Text>
                    <Text size={15} className=" text-gray-600">
                      Using an authenticator app like Authy, 1Password, Microsoft
                      Authenticator, or Google Authenticator, scan the QR code.
                    </Text>
                    <div className="">
                      <Image
                        src={twofaImage.image2fa}
                        alt="2facode"
                        height={200}
                        width={200}
                      />
                    </div>
                    <Text className=" text-gray-600">
                      Or copy code for manual entry:
                    </Text>
                    <div className="flex">
                      <div className="py-2 px-3 bg-gray-100 border border-gray-200">
                        {twofaImage.secret.base32}
                      </div>
                      <div className="py-2 px-3 border border-gray-200 border-l-0">
                        <CopyButton
                          value={props.session.customer[0].secret2fa}
                          timeout={2000}
                        >
                          {({ copied, copy }) => (
                            <Tooltip
                              label={copied ? 'Copied' : 'Copy'}
                              withArrow
                              position="right"
                            >
                              <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                onClick={copy}
                              >
                                {copied ? (
                                  <IconCheck size={23} />
                                ) : (
                                  <IconCopy size={23} />
                                )}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </div>
                    </div>

                    <Text size={15} className=" text-gray-600">
                      Once you have connected your app, enter your most recent 6
                      digit verification code:
                    </Text>

                    <div className="w-52">
                      <TextInput
                        placeholder="Code"
                        error={error}
                        label="6-character code"
                        onChange={(e) => {
                          settext2fa(e.target.value)
                        }}
                        size="md"
                        withAsterisk
                      />
                    </div>
                  </div>

                  <div className="flex justify-end justify-self-end">
                    <Button
                      className=" bg-lochmara-400"
                      size="md"
                      disabled={text2fa == ''}
                      loading={enable2faMutation.isLoading}
                      onClick={() => {
                        enable2faMutation.mutate(
                          { code: text2fa },
                          {
                            onSuccess(data: any, variables, context) {
                              if (data.status) {
                                setActive(2)
                                setdone2fa(true)
                              } else {
                                seterror('Invalid code.')
                              }
                              // console.log(data)
                            },
                            onError(error, variables, context) {
                              seterror('Invalid code.')
                            },
                          },
                        )
                        setActive(1)
                      }}
                      radius={'xl'}
                    >
                      SUBMIT
                    </Button>
                  </div>
                </Stepper.Step>
                <Stepper.Step label="Add Backup" className="w-48">
                  <div className="px-7 min-h-[400px] space-y-6">
                    <Text fw={500} size={18} className=" text-gray-800">
                      Backup codes
                    </Text>

                    <Text size={15} className=" text-gray-500">
                      Make a copy of your codes. Store them using a password manager
                      or in an encrypted file.
                    </Text>

                    {isSuccess && (
                      <>
                        <Paper
                          shadow="xs"
                          className=" mx-14 bg-gray-100 space-y-4 divide-y divide-gray-400"
                        >
                          <SimpleGrid
                            className="gap-1"
                            spacing="xs"
                            cols={4}
                            p={'md'}
                          >
                            {twofaImage?.recoveryCodes.map(
                              (item: any, key: any) => (
                                <Text p={0} size={14} key={key}>
                                  {item}
                                </Text>
                              ),
                            )}
                          </SimpleGrid>
                          <div className="p-2 flex space-x-6 items-center mt-4">
                            <div>
                              <CopyButton
                                value={twofaImage?.recoveryCodes.join('\n')}
                                timeout={2000}
                              >
                                {({ copied, copy }) => (
                                  <Tooltip
                                    label={copied ? 'Copied' : 'Copy'}
                                    withArrow
                                  // position="right"
                                  >
                                    <UnstyledButton
                                      onClick={() => {
                                        setenableFinsh(false)
                                        copy()
                                      }}
                                      color={copied ? 'teal' : 'gray'}
                                      className={
                                        'flex space-x-2 items-center hover:p-0 hover:m-0'
                                      }
                                    >
                                      {copied ? (
                                        <IconCheck size={18} />
                                      ) : (
                                        <IconCopy size={18} />
                                      )}

                                      <Text size={14}>Copy</Text>
                                    </UnstyledButton>
                                  </Tooltip>
                                )}
                              </CopyButton>
                            </div>
                            <UnstyledButton
                              onClick={() => {
                                setenableFinsh(false)
                                download(
                                  data.customer.recoveryCodes.join('\n'),
                                  'download.txt',
                                )
                              }}
                              className={'flex space-x-2 items-center'}
                            >
                              <IconDownload size={18} />
                              <Text size={14}>Download as .txt file</Text>
                            </UnstyledButton>
                          </div>
                        </Paper>
                      </>
                    )}

                    <Text className=" text-gray-500 mt-6">
                      If you lose access to your default authentication method, use
                      one of these codes to regain access to your account.
                    </Text>
                  </div>
                  <div className="flex justify-end justify-self-end pt-6">
                    <Button
                      className=" bg-lochmara-400"
                      size="md"
                      disabled={enableFinsh}
                      loading={enable2faMutation.isLoading}
                      onClick={() => {
                        setdone2fa(true)
                        setsetup2fa(false)
                      }}
                      radius={'xl'}
                    >
                      FINISH
                    </Button>
                  </div>
                </Stepper.Step>
              </Stepper>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      {/* <Modal
        opened={setup2fa}
        closeOnClickOutside={false}
        title={
          <Text size={18} fw={500}>
            Set up two factor authentication
          </Text>
        }
        onClose={() => {
          setsetup2fa(false)
          setenableFinsh(true)
          setActive(0)
        }}
        size={'xl'}
        overlayProps={{
          color: theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3
        }}

      >

      </Modal> */}

      <Modal
        title={
          <Text size={20} fw={500}>
            Disable two-factor authentication
          </Text>
        }
        opened={disableModal}
        onClose={() => {
          setdisableModal(false)
        }}
        closeOnClickOutside={false}
        overlayProps={{
          color: theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3
        }}
      >
        <div className=" flex justify-center flex-col space-y-6 py-6 text-center">
          <BrokenShield className="justify-self-center mx-auto w-36" />
          <Text>
            This lowers your account&apos;s security level and is not advised.
            Are you certain you want to go on?
          </Text>
        </div>
        <div className="flex justify-end space-x-3 items-center">
          <Anchor
            size={'md'}
            onClick={() => {
              setdisableModal(false)
            }}
          >
            Cancel
          </Anchor>
          <Button
            loading={disable2faMutation.isLoading}
            onClick={() => {
              disable2faMutation.mutate(
                { action: '' },
                {
                  onSuccess(data: any, variables, context) {
                    // console.log(data)
                    if (data.status) {
                      setdone2fa(false)
                      setdisableModal(false)
                    }

                  },
                  onError(error, variables, context) { },
                },
              )
            }}
            color="red"
            radius={'xl'}
            className=" bg-red-500 hover:bg-red-600"
            size="md"
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default ProfileSecurityBlock
