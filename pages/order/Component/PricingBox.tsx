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
import { Pricing } from '../../../Types/ProductInterface'
import collect from 'collect.js'
import { PackageTerms } from '../../../utils/helpers'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md'
// export interface pricing {
//     amount:string,
//     period:string,
//     term:string
// }

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
                : theme.colors.gray[4]
            }`,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        backgroundColor: checked ? '#e9f3ff !important' : '',
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
    term: any
    period: string
    amount: string
}

export function ComponentCheckbox({
    checked,
    defaultChecked,
    onChange,
    term,
    period,
    amount,
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

    let connections = collect(PackageTerms)

    const { classes, cx } = useStyles({ checked: value })

    return (
        <UnstyledButton
            {...others}
            onClick={() => handleChange(!value)}
            className={cx(classes.button, className,)}
        >

            <div className='absolute top-2 left-2'>
                {checked ? <>
                    <MdRadioButtonChecked size={22} className=' text-azure-radiance-500' />
                </> : <><MdRadioButtonUnchecked size={22} className=' text-gray-300' /></>}
            </div>


            <div className={classes.body}>
                <Text size={30} fw={700} className=" text-gray-800">
                    <CurrencyFormat
                        value={amount}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                    />
                </Text>
                <Text className=" text-azure-radiance-900">{connections.firstWhere('value', period).label}</Text>
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


export function PricingBox({
    onChange,
    data,
    defaultValue
}: {
    onChange: (value: any) => void
    data: Pricing[],
    defaultValue: String,
}) {
    const [activeRadio, setActiveRadio] = useInputState(defaultValue)


    const items = data?.map((item, key) => (
        <ComponentCheckbox
            checked={item?.period == defaultValue}
            onChange={() => {

                onChange(item)
            }}
            {...item}
            key={key}
            className="  flex flex-col justify-center"
        />
    ))
    return (
        <SimpleGrid
            cols={4}
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
