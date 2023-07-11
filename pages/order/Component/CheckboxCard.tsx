import { UnstyledButton, Checkbox, Text, createStyles } from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'
import CurrencyFormat from 'react-currency-format'

const useStyles = createStyles((theme) => ({
  button: {
    display: 'flex',
    width: '100%',
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
      }`,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.lg,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[9]
          : theme.colors.gray[0],
    },
  },
}))

interface CheckboxCardProps {
  checked?: boolean
  defaultChecked?: boolean
  amount: number
  freessl: boolean
  onChange(checked: boolean): void
  title: React.ReactNode
  description: React.ReactNode
}

export function CheckboxCard({
  checked,
  defaultChecked,
  onChange,
  title,
  amount,
  freessl,
  description,
  className,
  ...others
}: CheckboxCardProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof CheckboxCardProps>) {
  const { classes, cx } = useStyles()

  const [value, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,

  })

  return (
    <UnstyledButton
      {...others}
      onClick={() => {
        handleChange(!value)
        onChange(!value)
      }}
      className={cx(classes.button, className)}
    >
      <Checkbox
        checked={value}

        tabIndex={-1}
        size="md"
        mr="xl"
        styles={{ input: { cursor: 'pointer' } }}
      />

      <div className="flex justify-between w-full items-center">
        <div>
          <Text weight={500} mb={7} sx={{ lineHeight: 1 }}>
            {title}
          </Text>
          <Text size="sm" color="dimmed">
            {description}
          </Text>
        </div>
        <div>

          {amount > 0 ? (
            <div className='flex gap-1 items-baseline'>
              <Text size={18} fw={600} className=' text-blue-800'>
                <CurrencyFormat
                  value={amount}
                  fixedDecimalScale={true}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
              </Text>
              <Text >/month</Text>
            </div>
          ) : (
            <Text size={18} fw={600}></Text>
          )}

        </div>
      </div>
    </UnstyledButton>
  )
}
