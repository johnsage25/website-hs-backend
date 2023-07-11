import {
    UnstyledButton,
    Checkbox,
    Text,
    Image,
    SimpleGrid,
    createStyles,
    rem,
    Group,
} from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { Country, State, City } from 'country-state-city'
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
    button: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        transition: 'background-color 150ms ease, border-color 150ms ease',
        border: `${rem(1.9)} solid ${checked
            ? theme.fn.variant({ variant: 'outline', color: theme.primaryColor }).border
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[3]
            }`,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        backgroundColor: checked
            ? theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.white,
    },

    body: {
        flex: 1,
        marginLeft: theme.spacing.md,
    },
}));

interface ImageCheckboxProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?(checked: boolean): void;
    name: string;
    locationName: string;
    image: string;
}

export function ImageCheckbox({
    checked,
    defaultChecked,
    onChange,
    name,
    locationName,
    className,
    image,
    ...others
}: ImageCheckboxProps & Omit<React.ComponentPropsWithoutRef<'button'>, keyof ImageCheckboxProps>) {
    const [value, handleChange] = useUncontrolled({
        value: checked,
        defaultValue: defaultChecked,
        finalValue: false,
        onChange,
    });

    let country: any = Country.getCountryByCode(name)
    const { classes, cx } = useStyles({ checked: value });

    return (
        <UnstyledButton
            {...others}
            onClick={() => handleChange(!value)}
            className={cx(classes.button, `bg-white py-5`)}
        >
            <div className=' pr-2'>
                {checked ? <>
                    <MdRadioButtonChecked size={22} className=' text-azure-radiance-500' />
                </> : <><MdRadioButtonUnchecked size={22} className=' text-gray-300' /></>}
            </div>
            <span
                className={`fi fi-${country.isoCode.toLowerCase()}`}
            />

            <div className={classes.body}>
                <Group position='apart'>
                    <Text weight={500} size="md" sx={{ lineHeight: 1 }}>
                        {locationName}
                    </Text>
                    <Text color="dimmed" size="xs" sx={{ lineHeight: 1 }} mb={5}>
                        {name?.toLocaleUpperCase()}
                    </Text>
                </Group>
            </div>

            <Checkbox
                checked={value}
                onChange={() => { }}
                className=" hidden"
                tabIndex={-1}
                styles={{ input: { cursor: 'pointer' } }}
            />
        </UnstyledButton>
    );
}


export function RegionsCheckBox({ regions, value, onChange }: { regions: any[], value?: string, onChange: (value: any) => void, }) {

    const items = regions?.map((item) => <ImageCheckbox onChange={() => {
        onChange(item._id)
    }} checked={item._id?.toLocaleLowerCase() == value} {...item} key={item._id} />);

    return (
        <SimpleGrid
            cols={3}
            breakpoints={[
                { maxWidth: 'md', cols: 2 },
                { maxWidth: 'sm', cols: 1 },
            ]}
        >
            {items}
        </SimpleGrid>
    );
}