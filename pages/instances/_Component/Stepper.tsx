import { useState } from 'react';
import { Stepper, createStyles, rem } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    root: {
        padding: theme.spacing.sm,
    },

    separator: {
        height: rem(2),
        borderTop: `${rem(2)} dashed ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4]}`,
        borderRadius: theme.radius.xl,
        backgroundColor: 'transparent',
    },

    separatorActive: {
        borderWidth: 0,
        backgroundImage: theme.fn.linearGradient(45, theme.colors.blue[6], theme.colors.blue[8]),
    },

    stepIcon: {
        borderColor: 'transparent',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
        borderWidth: 0,

        '&[data-completed]': {
            borderWidth: 0,
            backgroundColor: 'transparent',
            backgroundImage: theme.fn.linearGradient(45, theme.colors.blue[6], theme.colors.blue[8]),
        },
    },

    step: {
        transition: 'transform 150ms ease',

        '&[data-progress]': {
            transform: 'scale(1.05)',
        },
    },
}));

function StepperBox({step = 1}: {step: number}) {
    const { classes } = useStyles();
    return (
        <Stepper size="sm" classNames={classes} active={step}  breakpoint="sm">
            <Stepper.Step label="Customization" description="Server option selection" />
            <Stepper.Step label="Payment" description="Payment options" />
            <Stepper.Step label="Confirmation" description="Payment and receipt" />
        </Stepper>
    );
}

export default StepperBox