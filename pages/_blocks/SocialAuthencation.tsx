import {
  Anchor,
  Center,
  Group,
  LoadingOverlay,
  Paper,
  Text,
  UnstyledButton,
} from '@mantine/core'
import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { VscGithubInverted } from 'react-icons/vsc'
import { trpc } from '../../utils/trpc'
import { FaCheckCircle } from 'react-icons/fa'
import { useRouter } from 'next/router'

const SocialAuthencation = (props: any) => {
  const [loadingGoogle, setloadingGoogle] = useState(false)
  const [loadingGithub, setloadingGithub] = useState(false)
  let removeAuthMutation = trpc.profile.removeAuth.useMutation()
  const router = useRouter()
  const { googleAuth, githubAuth } = props.session.customer[0] || {}

  return (
    <div>
      <Paper className="flex flex-col px-6 py-6 space-y-4 border">
        <div className="space-y-4">
          <Text size={18} fw={500} className="text-gray-700">
            Authentication Methods
          </Text>

          <Text size={15} className="text-gray-500 block space-y-2">
            Your HostSpacing account can be accessed using your HostSpacing
            login information or those from another service provider, such as
            Google or GitHub. We strongly recommend setting up Two-Factor
            Authentication (2FA).
          </Text>
        </div>
        <div className="flex space-x-4">
          {googleAuth ? (
            <UnstyledButton
              onClick={() => {
                setloadingGoogle(true)
                removeAuthMutation.mutate(
                  { action: 'google' },
                  {
                    onSuccess(data, variables, context) {
                      setloadingGoogle(false)
                      router.reload()
                    },
                    onError(error, variables, context) {
                      setloadingGoogle(false)
                    },
                  },
                )
              }}
              className="py-2 relative px-6 overflow-hidden border-gray-200 border border-solid rounded-full shadow hover:bg-gray-50"
            >
              <LoadingOverlay visible={loadingGoogle} overlayBlur={10} />
              <div className="bg-white absolute z-30 w-full h-full opacity-70"></div>
              <Center inline className="absolute z-50 inset-0 ">
                <FaCheckCircle size={30} className="bg-white fill-green-500" />
              </Center>
              <Group spacing="xs">
                <FcGoogle size={35} />
                <Text size={20}>Google</Text>
              </Group>
            </UnstyledButton>
          ) : (
            <UnstyledButton
              target={'_blank'}
              component="a"
              href="/api/google"
              className="py-2 relative px-6 overflow-hidden border-gray-200 border border-solid rounded-full shadow hover:bg-gray-50"
            >
              <Group spacing="xs">
                <FcGoogle size={35} />
                <Text size={20}>Google</Text>
              </Group>
            </UnstyledButton>
          )}

          {githubAuth ? (
            <UnstyledButton
              onClick={() => {
                setloadingGithub(true)
                removeAuthMutation.mutate(
                  { action: 'github' },
                  {
                    onSuccess(data, variables, context) {
                      setloadingGithub(false)
                      router.reload()
                    },
                    onError(error, variables, context) {
                      setloadingGithub(false)
                    },
                  },
                )
              }}
              className="py-2 relative px-6 overflow-hidden border-gray-200 border border-solid rounded-full shadow hover:bg-gray-50"
            >
              <LoadingOverlay visible={loadingGithub} overlayBlur={10} />
              <div className="bg-white absolute z-30 w-full h-full opacity-70"></div>
              <Center inline className="absolute z-50 inset-0 ">
                <FaCheckCircle size={30} className="bg-white fill-green-500" />
              </Center>
              <Group spacing="xs">
                <VscGithubInverted size={35} />
                <Text size={20}>GitHub</Text>
              </Group>
            </UnstyledButton>
          ) : (
            <UnstyledButton
              component="a"
              target={'_blank'}
              href="/api/github"
              className="py-2 px-6 border-gray-200 border border-solid rounded-full shadow hover:bg-gray-50"
            >
              <Group spacing="xs">
                <VscGithubInverted size={35} />
                <Text size={20}>GitHub</Text>
              </Group>
            </UnstyledButton>
          )}
        </div>
      </Paper>
    </div>
  )
}

export default SocialAuthencation
