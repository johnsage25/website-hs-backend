import { useTheme } from '@emotion/react'
import LogoW from '../../Components/LogoW'
import MenuLinks from './MenuLinks'
import UserHeader from './UserHeader'
import { motion } from 'framer-motion'
import { useState } from 'react'
import LogoIcon from '../../Components/LogoIcon'
import { Toaster } from 'react-hot-toast'
import { createStyles, Navbar, Footer, ScrollArea, Text, Transition, Group, Code, getStylesRef, rem } from '@mantine/core';
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconLayoutGridAdd,
  IconHelp,
} from '@tabler/icons-react';

import {
  VscServerEnvironment,
  VscServer,
  VscGlobe,
  VscDashboard,
  VscAccount,
} from 'react-icons/vsc'
import { SiKubernetes } from 'react-icons/si'
import { CiServer } from 'react-icons/ci'
import { GoMailRead } from 'react-icons/go'
import { HiShoppingBag } from 'react-icons/hi'
import { BsCreditCard, BsShieldLock } from 'react-icons/bs'
import { AiOutlineAppstore } from 'react-icons/ai'
import { TbApps } from 'react-icons/tb'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { IconWorldWww } from '@tabler/icons-react'
import { IconMail } from '@tabler/icons-react'
import { IconUserCircle } from '@tabler/icons-react'


// import { MantineLogo } from '@mantine/ds';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: "#111a26",
  },
  utility: {
    paddingTop: theme.spacing.md,
    // marginBottom: theme.spacing.md,
    borderTop: `${rem(1)} solid #2a394f`,
  },

  header: {
    paddingBottom: theme.spacing.sm,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid #2a394f`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid #2a394f`,
  },

  linkNoIcon: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.md,
    color: theme.colors.gray[4],
    marginBottom: 5,
    padding: "7px 7px",
    '&:hover': {
      backgroundColor: "#19273a",
      color: theme.colors.gray[2],
      borderRadius: 100,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.colors.gray[2],
      },
    },
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.md,
    color: theme.colors.gray[4],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    // fontWeight: 400,

    '&:hover': {
      backgroundColor: "#19273a",
      color: theme.colors.gray[2],

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colors.gray[2],
      },
    },
  },

  link2: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[4],
    padding: "2px 2px",
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: "#19273a",
      color: theme.colors.gray[2],
      [`& .${getStylesRef('icon')}`]: {
        color: theme.colors.gray[2],
      },
    },
  },
}));

const data = [
  { label: 'Dashboard', link: '/', icon: VscDashboard },
  {
    label: 'Cloud Projects',
    icon: VscServerEnvironment,
    link: '/instances',
  },
  {
    label: 'Services',
    icon: CiServer,
    initiallyOpened: true,
    link: '/hosting',
  },

  {
    label: 'Site Protection',
    icon: BsShieldLock,
    link: '/site-protection',
  },
  { label: 'Emails', icon: IconMail, link: '/email' },
  { label: 'Domains', icon: IconWorldWww, link: '/domains' },
]


const data2 = [
  {
    label: 'Marketplace',
    icon: HiShoppingBag,
    link: 'marketplace',
  },
  { label: 'Account', icon: VscAccount, link: '/account/billing' },
  {
    label: 'Support',
    icon: IconHelp,
    link: 'support',
  },

]



interface WithThemeProps {
  primaryColor: string
}

export function WithTheme<T extends WithThemeProps = WithThemeProps>({
  children,
  props,
}: {
  children: any
  props: any
}) {
  // Try to create a nice displayName for React Dev Tools.

  const themeProps = useTheme()
  const [isOpen, setisOpen] = useState<boolean>(false)

  const router = useRouter()
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('/');

  const routerPath = `/${router.pathname.split("/")[1]}` || active;

  const links = data.map((item:any) => (
    <a
      className={!_.isEqual(isOpen, true) ? cx(classes.link, { [classes.linkActive]: item.link === routerPath }) : classes.linkNoIcon}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        router.push(item?.link)
        event.preventDefault();
        setActive(item.link);

        // console.log(item?.link);

      }}
    >
      {_.isEqual(isOpen, true) ? <> <item.icon size={17} /></> : <>
        <item.icon className={classes.linkIcon} size={17} />
        <span>{item.label}</span>
      </>}
    </a>
  ));


  const links2 = data2.map((item:any) => (

    <a
      className={!_.isEqual(isOpen, true) ? cx(classes.link, { [classes.linkActive]: `/${item.link.split("/")[1]}` === routerPath }) : classes.linkNoIcon}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        router.push(item?.link)
        setActive(item.link);
      }}
    >
      {_.isEqual(isOpen, true) ? <> <item.icon size={16} /></> : <>
        <item.icon className={classes.linkIcon} size={20} />
        <span>{item.label}</span>
      </>}

    </a>
  ));



  // props comes afterwards so the can override the default ones.
  return (
    <>
      <main className="flex flex-nowrap  h-full">
        <div className="relative">

          <motion.div
            initial={{ width: 250 }}
            className={' relative'}
            animate={{ width: isOpen ? 68 : 250 }}
          >


            <motion.div
              initial={{ width: 250 }}
              className={
                'overflow-hidden fixed top-0 h-screen shadow-sm md:h-full flex-col justify-between hidden sm:flex'
              }
              animate={{ width: isOpen ? 68 : 250 }}
            >
              <div className="block">
                <Navbar height={"100vh"} width={{ sm: isOpen ? 68 : 250 }} px="md" py="sm" className={classes.navbar}>
                  <Navbar.Section grow>
                    <Group className={classes.header} position="apart">
                      {_.isEqual(isOpen, true) ? <LogoIcon /> : <LogoW className=" w-44 block" />}
                    </Group>
                    {links}
                  </Navbar.Section>

                  <Navbar.Section className={classes.utility}>
                    <a href="#" className={!_.isEqual(isOpen, true) ? classes.link : classes.link2} onClick={(event) => event.preventDefault()}>
                      {_.isEqual(isOpen, true) ? <>
                        <IconLayoutGridAdd size={17} stroke={1.5} />
                      </> : <>
                        <IconLayoutGridAdd className={classes.linkIcon} stroke={1.5} />
                        <span>All Products</span>
                      </>}
                    </a>
                  </Navbar.Section>

                  <Navbar.Section className={classes.footer}>
                    {links2}
                  </Navbar.Section>


                </Navbar>

                {/* <Navbar
                  height={'100vh'}
                  width={{ base: 240 }}
                  className=" bg-fiord-700"
                >
                  <Navbar.Section
                    px={'xs'}
                    className=" bg-fiord-600 py-2.5 px-4  border-b border-b-fiord-800"
                  >
                    {isOpen ? (
                      <div className="logo-small w-8.5">
                        <LogoIcon className="h-8.5 object-contain" />
                      </div>
                    ) : (
                      <div className=" h-8.5">
                        <LogoW className="w-48 block" />
                      </div>
                    )}
                  </Navbar.Section>
                  <Navbar.Section
                    grow
                    component={ScrollArea}
                    mx="-xs"
                    py={10}
                    px="xs"
                  >
                    <MenuLinks hideText={isOpen} />
                  </Navbar.Section>
                </Navbar> */}

              </div>
            </motion.div>
          </motion.div>
        </div>
        <div className=" w-full relative ease-linear duration-200 transition-all ">
          <UserHeader
            props={props}
            onClick={(e) => {
              setisOpen(!isOpen)
            }}
          />
          <div className=" mt-14 relative">{children}</div>
          <Toaster />
        </div>
      </main>
    </>
  )
}
