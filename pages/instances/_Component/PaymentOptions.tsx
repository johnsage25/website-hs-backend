import {
    UnstyledButton,
    Checkbox,
    Text,
    Image,
    SimpleGrid,
    createStyles,
    Radio,
    Group,
    Stack,
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
import PaypalIcon2 from '../../../Components/icons/PaypalIcon2'
import CreditCard from '../../../Components/icons/CreditCard'
import GooglePayIcon from '../../../Components/icons/GooglePayIcon'
import GoogleIcon from '../../../Components/icons/GoogleIcon'
import PayStackIcon from '../../../Components/icons/PayStackIcon'
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
        padding: theme.spacing.md,
        backgroundColor: checked ? '#e9f3ff !important' : '',
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
            className={cx(classes.button, className)}
        >
            <div className='absolute top-2 left-2'>
                {checked ? <>
                    <MdRadioButtonChecked size={22} className=' text-azure-radiance-500' />
                </> : <><MdRadioButtonUnchecked size={22} className=' text-gray-300' /></>}
            </div>


            <div className="w-full">
                <Stack justify='center' align="center">
                    {image({ className: 'w-8 h-8 object-fill' })}
                    <Text>{title}</Text>
                </Stack>
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
        title: 'Credit Card',
        image: CreditCard,
    },
    {
        id: 'paypal',
        description: 'An easy-to-use CMS to launch your blog or website',
        title: 'PayPal',
        image: PaypalIcon2,
    },
    {
        id: 'gpay',
        description:
            'PrestaShop is a perfect solution for creating your online store',
        title: 'G-Pay',
        image: GoogleIcon,
    },
    {
        id: 'paystack',
        description:
            'A CMS that you can use to build tailor-made blogs and e-commerce websites',
        title: 'PayStack',
        image: PayStackIcon,
    },

]

export function PaymentOptions({ onChange, defaultValue }: {
    onChange: (value: any) => void, defaultValue?: string
}) {


    const [activeRadio, setActiveRadio] = useState(defaultValue)

    const items = mockdata.map((item) => (
        <ImageCheckbox
            checked={item.id == defaultValue}
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
            cols={5}
            className='mx-auto justify-center'
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
