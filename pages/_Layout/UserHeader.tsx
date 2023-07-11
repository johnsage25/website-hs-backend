import {
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Group,
  Header,
  Image,
  Indicator,
  Text,
  UnstyledButton,
} from '@mantine/core'
import React, { MouseEvent, useState } from 'react'
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuDivider,
  MenuHeader,
} from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import UserIcon from '../../public/imgs/user.svg'
import { IconChevronRight } from '@tabler/icons'
import { FiHelpCircle } from 'react-icons/fi'
import { VscBell, VscChevronDown, VscChevronUp } from 'react-icons/vsc'
import Link from 'next/link'
import { useContext } from 'react'
import { trpc } from '../../utils/trpc'
import { AppCtx } from '../../Providers/UserAuthProvider'
import { truncate } from 'lodash'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { IconChevronUp } from '@tabler/icons-react'
import { IconChevronDown } from '@tabler/icons-react'
import SelectProduct from '../_blocks/SelectProduct'

interface HeaderAction {
  onClick: (e: MouseEvent<HTMLButtonElement, MouseEvent> | any) => void
  props: any,
  isWelcome?: boolean
}

const UserHeader = ({ onClick, props, isWelcome = false }: HeaderAction) => {
  const router = useRouter()
  const [opened, setOpened] = useState(false)
  const [menuOpen, setMenuOpened] = useState(false)

  let logoutMutation = trpc.app.logout.useMutation()
  const customer = useContext(AppCtx)

  return (
    <Header
      height={60}
      className="flex shadow-sm px-4 items-center justify-between w-full relative h-14 border-b border-b-gray-300 pr-6 z-40 bg-white"
    >

      <Group spacing={20}>
        <Burger
          opened={opened}
          size="sm"
          onClick={(e) => {
            onClick(e)
          }}
        />
        <SelectProduct />
      </Group>
      <Group className=" space-x-4">
        <div className="support py-2">
          <Indicator inline offset={3} label="New" size={16}>
            <UnstyledButton className="py-1">
              <VscBell className=" text-gray-500" size={28} />
            </UnstyledButton>
          </Indicator>
        </div>
        <div className="support py-2">
          <UnstyledButton className="py-1">
            <FiHelpCircle className=" text-gray-500" size={28} />
          </UnstyledButton>
        </div>
        <div className="user-icon pr-6">
          <Menu
            direction="bottom"
            offsetX={10}
            offsetY={5}
            menuButton={
              <UnstyledButton
                className="py-1"
                onClick={(e) => {
                  setMenuOpened(!menuOpen)
                }}
              >
                <div className="flex space-x-2 items-center">
                  <Avatar
                    src={
                      props?.session?.image_url
                        ? props?.session?.image_url
                        : '/imgs/user.svg'
                    }
                    radius="xl"
                    size={'md'}
                  />
                  {menuOpen ? (
                    <VscChevronDown size={14} />
                  ) : (
                    <VscChevronUp size={14} />
                  )}
                </div>
              </UnstyledButton>
            }
          >
            <div className="px-6 py-2">
              <Text fw={700} size={18}>
                {truncate(props?.session?.customer[0]?.username || "", {
                  length: 22,
                  omission: '',
                })}
              </Text>
            </div>
            <MenuHeader>MY PROFILE</MenuHeader>
            <MenuDivider />
            <Group p={14}>
              <div className="flex flex-col space-y-2 px-4">
                <Anchor
                  size={15}
                  className={'hover:bg-none'}
                  href="/profile/information"
                  rel="noopener noreferrer"
                >
                  Display
                </Anchor>
                <Anchor size={15} href="/profile/api">
                  API Tokens
                </Anchor>
                <Anchor size={15} href="/profile/referrals">
                  Referrals
                </Anchor>
              </div>
              <div className="flex flex-col space-y-2 px-4">
                <Anchor
                  size={15}
                  className={'hover:bg-none'}
                  href="/profile/settings"
                  rel="noopener noreferrer"
                >
                  My Settings
                </Anchor>
                <Anchor href="/profile/ssh-keys">SSH Keys</Anchor>
                <Anchor
                  size={15}
                  className={'hover:bg-none'}
                  href="/profile/authentication"
                  rel="noopener noreferrer"
                >
                  Authentication
                </Anchor>
              </div>
            </Group>

            <MenuHeader>Account</MenuHeader>
            <MenuDivider />
            <Box px={30} py={6} className="flex flex-col space-y-2">
              <Anchor size={15} href="/account/billing">
                Billing & Contacts Information
              </Anchor>
              <Anchor size={15} href="/account/service-transfer">
                Service Transfer
              </Anchor>
              <Anchor size={15} href="/account/settings">
                Account Settings
              </Anchor>
              <Anchor size={15} href="/account/maintenance">
                Maintenance
              </Anchor>
              <Anchor size={15} href={'/account/logout'}>
                Log Out
              </Anchor>
            </Box>
          </Menu>
        </div>
      </Group>
    </Header>
  )
}

export default UserHeader
