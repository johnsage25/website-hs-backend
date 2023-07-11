import {
    UnstyledButton,
    Checkbox,
    Text,
    Image,
    SimpleGrid,
    createStyles,
    rem,
} from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';


const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
    button: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        transition: 'background-color 150ms ease, border-color 150ms ease',
        border: `${rem(1.5)} solid ${checked
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
    onChange: () => void;
    title: string;
    description: string;
}

export function ImageCheckbox({
    checked,
    defaultChecked,
    onChange,
    title,
    description,
    className,
    ...others
}: ImageCheckboxProps & Omit<React.ComponentPropsWithoutRef<'button'>, keyof ImageCheckboxProps>) {
    const [value, handleChange] = useUncontrolled({
        value: checked,
        defaultValue: defaultChecked,
        finalValue: false,
        onChange,
    });

    const { classes, cx } = useStyles({ checked: value });

    return (
        <UnstyledButton
            {...others}
            onClick={() => handleChange(!value)}
            className={cx(classes.button, `bg-white py-3`)}
        >

            <div className=' pr-2'>
                {checked ? <>
                    <MdRadioButtonChecked size={22} className=' text-azure-radiance-500' />
                </> : <><MdRadioButtonUnchecked size={22} className=' text-gray-300' /></>}
            </div>
            <div className={classes.body}>

                <Text weight={500} size={16} sx={{ lineHeight: 1 }}>
                    {title}
                </Text>
                <Text size={14} sx={{ lineHeight: 1 }} className=' text-gray-500' mt={10}>
                    {description}
                </Text>
            </div>

            <Checkbox
                checked={value}
                onChange={() => { }}
                tabIndex={-1}
                className='hidden'
                styles={{ input: { cursor: 'pointer' } }}
            />
        </UnstyledButton>
    );
}



export function VmAuthBox({ data, value, onChange }: { data: any[], value?: string, onChange: (value: any) => void, }) {
    const items = data.map((item) => <ImageCheckbox {...item} onChange={() => {
        onChange(item.value)
    }} checked={item.value == value} {...item} key={item.value} />);
    return (
        <SimpleGrid
            cols={2}
            breakpoints={[
                { maxWidth: 'md', cols: 2 },
                { maxWidth: 'sm', cols: 1 },
            ]}
        >
            {items}
        </SimpleGrid>
    );
}