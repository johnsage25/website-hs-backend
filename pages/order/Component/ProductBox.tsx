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
} from '@mantine/core'
import { useInputState, useUncontrolled } from '@mantine/hooks'

import CurrencyFormat from 'react-currency-format'
import { SSLProductInterface } from '../../../Types/SSLProductInterface'
import { Pricing, CartProductInterface, ProductFeature } from '../../../Types/CartProduct'


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
    serverRaid?: string;
    serverRam?: string;
    serviceTransfer?: boolean;
}

export function ImageCheckbox({
    checked,
    defaultChecked,
    onChange,
    pricing,
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
        <UnstyledButton
            {...others}
            onClick={() => handleChange(!value)}
            className={cx(classes.button, className)}
        >
            <div className="flex flex-row  gap-4 w-full">
                <Text weight={600} size="md" className=' text-arapawa-700' sx={{ lineHeight: 1, marginBottom: 10 }}>
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
                        <Text size={20} fw={600} className=" text-azure-radiance-700">
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
                        <Button className=' bg-azure-radiance-500 hover:bg-azure-radiance-600' radius={"xl"} size="sm">Select plan</Button>
                    </div>
                </Group>
                <div className='py-4'>
                    {productFeatures?.map((item, key) => (
                        <TypographyStylesProvider key={key}>
                            <div
                                className="text-arapawa-600 "
                                dangerouslySetInnerHTML={{
                                    __html: `${item.label}`,
                                }}
                            />
                        </TypographyStylesProvider>
                    ))}

                </div>
                {/* {pricing?.length != 0 ? (
                    <Text size={12} color={'dimmed'} className=" text-center ">
                        Billed Yearly
                    </Text>
                ) : (
                    <Text size={12} color={'dimmed'} className=" text-center ">
                        Free
                    </Text>
                )} */}
            </div>
        </UnstyledButton>
    )
}


export function ProductBox({
    onChange,
    data,
    defaultValue
}: {
    onChange: (value: any) => void
    data?: CartProductInterface[],
    defaultValue?: CartProductInterface,
}) {
    const [activeRadio, setActiveRadio] = useInputState(defaultValue)

    const items = data?.map((item) => (
        <ImageCheckbox
            checked={item._id == defaultValue?._id}
            onChange={() => {

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
