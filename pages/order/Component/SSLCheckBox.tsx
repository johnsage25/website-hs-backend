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

import CurrencyFormat from 'react-currency-format'
import { SSLProductInterface } from '../../../Types/SSLProductInterface'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md'
import { truncate } from 'lodash'

const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
  button: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    position: "relative",
    transition: 'background-color 150ms ease, border-color 150ms ease',
    border: `1px solid ${checked
      ? theme.fn.variant({ variant: 'outline', color: theme.primaryColor })
        .border
      : theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[3]
      }`,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    // backgroundColor: checked ? '#e9f3ff !important' : '',
  },

  body: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
}))

interface ImageCheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?(checked: boolean): void
  name: string
  _id: string
  yearly?: boolean
  price: any | string
  description: string
}

export function ImageCheckbox({
  checked,
  defaultChecked,
  onChange,
  name,
  price,
  yearly,
  id,
  description,
  className,
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
      title={description}
      onClick={() => handleChange(!value)}
      className={cx(classes.button, className, ` ${checked && "shadow "} hover:bg-slate-50`)}
    >

      <div className='absolute top-3.5 left-2'>
        {checked ? <>
          <MdRadioButtonChecked size={22} className=' text-azure-radiance-500' />
        </> : <><MdRadioButtonUnchecked size={22} className=' text-gray-300' /></>}
      </div>


      <div className="flex flex-row pl-5 items-center gap-4 w-full">
        <Text weight={600} size="md" className=' text-gray-800' sx={{ lineHeight: 1, marginBottom: 10 }}>
          {name}
        </Text>
      </div>

      <div className=''>

        <div className={classes.body}>
          <Text
            className=" text-gray-600"
            size={14}
            sx={{ lineHeight: 1.5 }}
            mb={5}
          >
            {truncate(description, {
              length: 100,
              omission: "..."
            })}
          </Text>
        </div>
      </div>

      <Radio
        className=" hidden"
        checked={value}
        onChange={() => { }}
        tabIndex={-1}
      />

      <div className={`border-t w-full  pt-2  ${checked && "border-t-blue-300"}`}>
        <Group position="apart" align='center'>
          <Text size={20} fw={600} className=" text-blue-800">
            <CurrencyFormat
              value={price}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
            />
          </Text>

          <div>
            {price != 0 ? (
              <Text size={12} className=" text-center text-gray-600">
                Billed Yearly
              </Text>
            ) : (
              <Text size={12} className=" text-center text-gray-600">
                Free
              </Text>
            )}
          </div>
        </Group>

      </div>
    </UnstyledButton>
  )
}


export function SSLCheckBox({
  onChange,
  data,
  value
}: {
  onChange: (value: any) => void
  data: SSLProductInterface[],
  value: SSLProductInterface,
}) {
  const [activeRadio, setActiveRadio] = useInputState(value)

  const items = data?.map((item:any) => (
    <ImageCheckbox
      yearly={true}
      checked={item?._id == value}
      onChange={() => {

        onChange(item)
      }}
      {...item}
      key={item.name}
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
