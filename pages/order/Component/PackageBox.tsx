import {
    UnstyledButton,
    Checkbox,
    Text,
    Image,
    SimpleGrid,
    createStyles,
    Radio,
    Group,
    Button,
    TypographyStylesProvider,
    Paper,
} from '@mantine/core'
import { useInputState, useUncontrolled } from '@mantine/hooks'

import CurrencyFormat from 'react-currency-format'
import { SSLProductInterface } from '../../../Types/SSLProductInterface'
import { Pricing, CartProductInterface, ProductFeature } from '../../../Types/CartProduct'
import { RadioGroup } from '@headlessui/react'
import { BsCheckLg } from 'react-icons/bs'
import { AiOutlineCheck } from 'react-icons/ai'


const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
    button: {
        display: 'flex',
        alignItems: 'center',
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
        position: "relative",
        backgroundColor: checked ? '#e9f3ff !important' : '',
    },

    body: {
        flex: 1,
        marginTop: 10,
        width: "100%",
        marginBottom: 10,
    },
}))

interface ImageCheckboxProps {
    checked?: boolean
    defaultChecked?: boolean
    onChange?(checked: boolean): void
    productName?: string;
    productRegion?: string;
    serverBandwidth?: string;
    serverCpu?: string;
    pricing?: Pricing[],
    productFeatures?: ProductFeature[],
    ShortDescription?: string,
    serverDiskSpace?: string;
    loading?: boolean,
    featured?: boolean,
    serverRaid?: string;
    serverRam?: string;
    serviceTransfer?: boolean;
}

export function ImageCheckbox({
    checked,
    defaultChecked,
    onChange,
    pricing,
    loading,
    featured,
    productFeatures,
    productName,
    ShortDescription,
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

        <Paper

            className={cx(classes.button, className)}
        >
            {featured && <div className={'rightCornerRibbon'}>
                <svg height="70" width="70">
                    <polygon points="0 0, 0 10, 10 10" fill={`#2686ff77`} strokeWidth="0" />
                    <polygon points="0 0, 70 70, 70 40, 30 0" fill={`#0088ff`} strokeWidth="0" />
                    <polygon points="60 60, 60 70, 70 70" fill={`#2686ff77`} strokeWidth="0" />
                </svg>
                <Text className={'rightCornerRibbonText text-white'} fw={700} size={15}>Popular</Text>
            </div>}


            <div className="flex flex-row  gap-4 w-full">
                <Text weight={600} size="md" className=' text-gray-800' sx={{ lineHeight: 1, marginBottom: 10 }}>
                    {productName}
                </Text>
            </div>

            <div className={classes.body}>
                <Text
                    className=" text-slate-700"
                    size={15}
                    sx={{ lineHeight: 1.5 }}
                    mb={5}
                >
                    {ShortDescription}
                </Text>
            </div>

            <Radio
                className=" hidden"
                checked={value}
                onChange={() => { }}
                tabIndex={-1}
            />

            <div className="w-full divide-y space-y-4">
                <Group className=' justify-between'>
                    <div className="flex items-center gap-1 py-2">
                        <Text size={20} fw={600} className=" text-gray-800">
                            <CurrencyFormat
                                value={30}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                            />
                        </Text>
                        <Text className=" text-azure-radiance-900">/month</Text>
                    </div>
                    <div>
                        <Button loading={loading} onClick={() => handleChange(!value)} className=' bg-azure-radiance-500 hover:bg-azure-radiance-600' radius={"xl"} size="sm">Select plan</Button>
                    </div>
                </Group>
                <div className='py-4'>
                    {productFeatures?.map((item, key) => (
                        <TypographyStylesProvider key={key}>
                            <Group>
                                <AiOutlineCheck color='teal' />
                                <div
                                    className="text-arapawa-600 "
                                    dangerouslySetInnerHTML={{
                                        __html: `${item.label}`,
                                    }}
                                />
                            </Group>
                        </TypographyStylesProvider>
                    ))}

                </div>

            </div>

        </Paper>

    )
}


export function PackageBox({
    onChange,
    data,
    loading,
    defaultValue
}: {
    onChange: (value: any) => void
    data?: CartProductInterface[],
    loading?: boolean,
    defaultValue?: CartProductInterface,
}) {
    const [activeRadio, setActiveRadio] = useInputState(defaultValue)


    const items = data?.map((item, key) => (
        <ImageCheckbox

            checked={item._id == defaultValue?._id}
            loading={loading && item._id == activeRadio?._id}
            onChange={() => {
                setActiveRadio(item)
                onChange(item)
            }}
            {...item}
            key={item.productName}
            className="  flex flex-col justify-center"
        />
    ))
    return (
        <SimpleGrid
            cols={2}
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
