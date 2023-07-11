import { SVGProps, useState } from 'react'
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
} from '@mantine/core'
import {
  TablerIcon,
  IconCalendarStats,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  //   link: {
  //     fontWeight: 500,
  //     display: 'block',
  //     textDecoration: 'none',
  //     padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
  //     paddingLeft: 31,
  //     marginLeft: 30,
  //     fontSize: theme.fontSizes.sm,
  //     borderLeft: `1px solid ${
  //       theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
  //     }`,

  //     '&:hover': {
  //       backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
  //       color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  //     },
  //   },

  chevron: {
    transition: 'transform 200ms ease',
  },
}))

interface LinksGroupProps {
  icon: TablerIcon | SVGProps<SVGSVGElement> | any
  label: string
  link: string | any
  onHandleClick: (e:any) => void,
  activeLink:string,
  initiallyOpened?: boolean
  links?: { label: string; link: string }[]
  hideMenu?: boolean
}

export function LinksGroup({
  icon: Icon,
  label,
  link,
  activeLink,
  onHandleClick,
  initiallyOpened,
  links,
  hideMenu,
}: LinksGroupProps) {
  const { classes, theme } = useStyles()
  const hasLinks = Array.isArray(links)
  const [opened, setOpened] = useState(initiallyOpened || false)
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft
  const items = (hasLinks ? links : []).map((link) => (
    <Text<'a'>
      component="a"
      className={
        ' block text-mirage-300 px-6 py-3 font-normal hover:bg-lochmara-400'
      }
      href={link.link}
      size={16}
      key={link.label}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Text>
  ))

  return (
    <>
      <UnstyledButton

        onClick={(e) => {
          setOpened((o) => !o)
          onHandleClick(link)
        }}
        className={'block w-full py-3 px-6 text-gray-200 hover:bg-lochmara-600'}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon
              className={
                activeLink == link
                  ? `w-6 h-6   fill-lochmara-300`
                  : `w-6 h-6  fill-gray-50 stroke-sky-500`
              }
              size={20}
            />
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && !hideMenu && (
            <ChevronIcon
              className={classes.chevron}
              size={14}
              stroke={1.5}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)`
                  : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks && !hideMenu ? (
        <Collapse className=" bg-mirage-600" in={opened}>
          {items}
        </Collapse>
      ) : null}
    </>
  )
}

const mockdata = {
  label: 'Releases',
  icon: IconCalendarStats,
  links: [
    { label: 'Upcoming releases', link: '/' },
    { label: 'Previous releases', link: '/' },
    { label: 'Releases schedule', link: '/' },
  ],
}
