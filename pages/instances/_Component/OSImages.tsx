import {
    UnstyledButton,
    Checkbox,
    Text,
    Image,
    SimpleGrid,
    createStyles,
    rem,
    Radio,
} from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { LinuxImages } from '../../../options';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
    button: {
        display: 'flex',
        alignItems: 'center',
        width: '120px',
        transition: 'background-color 150ms ease, border-color 150ms ease',
        border: `${rem(1.5)} solid ${checked
            ? theme.fn.variant({ variant: 'outline', color: theme.primaryColor }).border
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[3]
            }`,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.lg,
    },

    body: {
        flex: 1,
    },
}));

interface ImageCheckboxProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?(checked: boolean): void;
    title: string;
    id: string,
    versions: any[],
    description: string;
    icon: string;
}

export function ImageCheckbox({
    checked,
    defaultChecked,
    onChange,
    title,
    description,
    className,
    versions,
    icon,
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
            className={cx(classes.button, "bg-white items-center w-full relative justify-center text-center flex-col")}
        >
            <div className='absolute top-2 left-2'>
                {checked ? <>
                    <MdRadioButtonChecked size={22} className=' text-azure-radiance-500' />
                </> : <><MdRadioButtonUnchecked size={22} className=' text-gray-300' /></>}
            </div>

            <Image src={icon} alt={title} width={60} className='mx-auto' />

            <div className={classes.body}>
                <Text color="dimmed" size="xs" sx={{ lineHeight: 1 }} mb={5}>
                    {description}
                </Text>
                <Text weight={500} size="sm" sx={{ lineHeight: 1 }}>
                    {title}
                </Text>
            </div>

            <Checkbox
                checked={value}
                onChange={() => { }}
                tabIndex={-1}
                className=" hidden"
                styles={{ body: { cursor: 'pointer' } }}
            />
        </UnstyledButton>
    );
}



export function OSImages({ data, onChange, value }: {
    data: any[], onChange: (value: any) => void, value?: string
}) {
    const items = data.map((item) => <ImageCheckbox checked={item.id == value}
        onChange={() => {
            onChange(item.id)
        }}
        {...item} key={item.id} />);
    return (
        <div
            className='gap-3 grid grid-cols-5'
        >
            {items}
        </div>
    );
}