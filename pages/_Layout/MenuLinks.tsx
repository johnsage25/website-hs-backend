import React, { useCallback, useState } from 'react'

import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from '@tabler/icons'
import { Box, Group, ThemeIcon, UnstyledButton } from '@mantine/core'
import { LinksGroup } from './ LinksGroup'
import {
  VscServerEnvironment,
  VscServer,
  VscGlobe,
  VscDashboard,
} from 'react-icons/vsc'
import { SiKubernetes } from 'react-icons/si'
import { CiServer } from 'react-icons/ci'
import { GoMailRead } from 'react-icons/go'
import { HiShoppingBag } from 'react-icons/hi'
import { BsCreditCard, BsShieldLock } from 'react-icons/bs'
import { GrShieldSecurity } from 'react-icons/gr'
import { useRouter } from 'next/router'

const mockdata = [
  { label: 'Dashboard', icon: VscDashboard },
  {
    label: 'Instances',
    icon: VscServerEnvironment,
    link: '/instances',
  },
  {
    label: 'Hosting',
    icon: CiServer,
    initiallyOpened: true,
    link: 'hosting',
  },

  {
    label: 'Kubernetes',
    icon: SiKubernetes,
    link: 'kubernetes',
  },
  {
    label: 'Dedicated Servers',
    icon: VscServer,
    link: 'dedicated-server',
  },
  { label: 'Emails', icon: GoMailRead, link: 'email' },
  { label: 'Domains', icon: VscGlobe, link: 'domains' },
  {
    label: 'Marketplace',
    icon: HiShoppingBag,
    link: 'marketplace',
  },
  { label: 'Billing', icon: BsCreditCard, link: 'billing' },
  {
    label: 'Security',
    icon: BsShieldLock,
    link: 'security',
  },
]

const MenuLinks = (props?: any) => {
  const rounter = useRouter()
  const [activeLink, setactiveLink] = useState('/')
  const handleClick = useCallback((active: any) => {
    setactiveLink(active)
    rounter.push(active)
    // console.log(active)
  }, [])

  return (
    <div>
      {mockdata.map((item, k) => {
        return (
          <LinksGroup
            key={k}
            // links={item.links}
            link={item.link}
            activeLink={activeLink}
            onHandleClick={handleClick}
            icon={item.icon}
            hideMenu={props.hideText}
            label={props.hideText ? '' : item.label}
          />
        )
      })}
    </div>
  )
}

export default MenuLinks
