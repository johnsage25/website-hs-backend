import Link from 'next/link'
import React, { ComponentType } from 'react'
import { useRouter } from 'next/router'

const ActiveLinkTab = ({
  action,
  title,
}: {
  action?: string | any
  title?: string
}) => {
  const router = useRouter()

  return (
    <Link
      href={action}
      className={`inline-block text-sm ${
        action == router.pathname
          ? 'border-lochmara-500 active dark:text-lochmara-500 dark:border-lochmara-500 border-b-2 text-lochmara-500'
          : 'border-b-2 border-transparent text-gray-500 hover:text-gray-600  hover:border-gray-300 dark:hover:text-gray-300'
      }
         p-4 rounded-t-lg `}
    >
      {title}
    </Link>
  )
}

export default ActiveLinkTab
