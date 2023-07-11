import {
  UnstyledButton,
  Checkbox,
  Text,
  Image,
  SimpleGrid,
  createStyles,
  Radio,
  Group,
} from '@mantine/core'
import { useInputState, useUncontrolled } from '@mantine/hooks'
import { VscSettings } from 'react-icons/vsc'
import SettingsIcon from '../../../Components/icons/SettingsIcon'
import { BsWordpress } from 'react-icons/bs'
import WordpressIcon from '../../../Components/icons/WordpressIcon'
import PrestashopIcon from '../../../Components/icons/ PrestashopIcon'
import JoomlaIcon from '../../../Components/icons/JoomlaIcon'
import LaravelIcon from '../../../Components/icons/LaravelIcon'
import { useState } from 'react'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md'

const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
  button: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    transition: 'background-color 150ms ease, border-color 150ms ease',
    border: `1px solid ${checked
      ? theme.fn.variant({ variant: 'outline', color: theme.primaryColor })
        .border
      : theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[3]
      }`,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    // backgroundColor: checked ? '#e9f3ff !important' : '',
  },

  body: {
    flex: 1,
    marginTop: 10,
  },
}))

interface ImageCheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?(checked: boolean): void
  title: string
  id: string
  description: string
  image: any
}

export function ImageCheckbox({
  checked,
  defaultChecked,
  onChange,
  title,
  id,
  description,
  className,
  image,
  ...others
}: ImageCheckboxProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof ImageCheckboxProps>) {
  const [value, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  })

  const { classes, cx } = useStyles({ checked: value })

  return (
    <UnstyledButton
      {...others}
      onClick={() => handleChange(!value)}
      className={cx(classes.button, className, ` ${checked && "shadow "} hover:bg-slate-50 `)}
    >
      <div className='absolute top-2 left-2'>
        {checked ? <>
          <MdRadioButtonChecked size={22} className=' text-azure-radiance-500' />
        </> : <><MdRadioButtonUnchecked size={22} className=' text-gray-300' /></>}
      </div>

      <div className='pl-6'>

        <div className="flex flex-row  items-center gap-4 w-full">
          {image({ className: 'w-12 h-12' })}
          <Text weight={600} size="md" className='text-gray-800' sx={{ lineHeight: 1, marginBottom: 0 }}>
            {title}
          </Text>
        </div>

        <div className={classes.body}>
          <Text
            className="text-slate-700"
            size={14}
            color={'dimmed'}
            sx={{ lineHeight: 1.5 }}
            mb={5}
          >
            {description}
          </Text>
        </div>

      </div>
      <Radio
        className=" hidden"
        checked={value}
        onChange={() => { }}
        tabIndex={-1}
      />
    </UnstyledButton>
  )
}

const mockdata = [
  {
    id: 'default',
    description: 'Choose to set up your web environment only',
    title: 'Default Settings',
    image: SettingsIcon,
  },
  {
    id: 'wordpress',
    description: 'An easy-to-use CMS to launch your blog or website',
    title: 'WordPress',
    image: WordpressIcon,
  },
  {
    id: 'prestashop',
    description:
      'PrestaShop is a perfect solution for creating your online store',
    title: 'Prestashop',
    image: PrestashopIcon,
  },
  {
    id: 'joomla',
    description:
      'A CMS that you can use to build tailor-made blogs and e-commerce websites',
    title: 'Joomla',
    image: JoomlaIcon,
  },
  {
    id: 'laravel',
    description:
      'Laravel one of the best Php Framework to quick start your project',
    title: 'Laravel',
    image: LaravelIcon,
  },
]

export function ImageCheckboxes({ onChange, value }: {
  onChange: (value: any) => void, value?: string
}) {


  const [activeRadio, setActiveRadio] = useState(value)

  const items = mockdata.map((item) => (
    <ImageCheckbox
      checked={item.id == value}
      onChange={() => {
        onChange(item.id)
      }}
      {...item}
      key={item.title}
      className="  flex flex-col justify-center"
    />
  ))
  return (
    <SimpleGrid
      cols={3}
      spacing={15}
      breakpoints={[
        { maxWidth: 'md', cols: 2 },
        { maxWidth: 'sm', cols: 1 },
      ]}
    >
      {items}
    </SimpleGrid>
  )
}
