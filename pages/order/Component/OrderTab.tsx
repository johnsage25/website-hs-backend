import { Container, Paper, Stepper, createStyles, rem, } from '@mantine/core'
import React from 'react'

type Props = { active: number }

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


const OrderTab = ({ active }: Props) => {
  const { classes, cx } = useStyles();

  return (
    <Stepper size="sm" classNames={classes} active={active} breakpoint="sm">
      <Stepper.Step label="Select" />
      <Stepper.Step label="Options" />
      <Stepper.Step label="Summary" />
      <Stepper.Step label="Payment" />
    </Stepper>
  )
}

export default OrderTab
