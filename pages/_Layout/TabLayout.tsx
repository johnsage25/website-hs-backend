import { Anchor, Button, Container, Tabs, Title, UnstyledButton } from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentElement } from 'react'
import ActiveLinkTab from '../../Components/ActiveLinkTab'
import Head from 'next/head'

export default function TabLayout({ children, title, buttonAction }: {children:any, title?:any,buttonAction?: any}) {
  return (
    <>

      <Container size={'xl'}  className="px-12 space-y-4">
        <div className='flex justify-between px-2'>
          <Title order={3} className="text-gray-600">{title}</Title>
          <div>
            {buttonAction}
          </div>
        </div>
        <div className="navigation">
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <ActiveLinkTab
                  title="Billing Info"
                  action={'/account/billing'}
                />
              </li>
              <li className="mr-2">
                <ActiveLinkTab title="Team Members" action={'/account/teams'} />
              </li>
              <li className="mr-2">
                <ActiveLinkTab
                  title="Service Transfer"
                  action={'/account/service-transfer'}
                />
              </li>
              <li className="mr-2">
                <ActiveLinkTab
                  title=" Account Settings"
                  action={'/account/settings'}
                />
              </li>
              <li>
                <ActiveLinkTab
                  title=" Maintenance"
                  action={'/account/maintenance'}
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="content">{children}</div>
      </Container>
    </>
  )
}
