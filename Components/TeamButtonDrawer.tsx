import {
  Alert,
  Box,
  Button,
  CloseButton,
  Switch,
  TextInput,
  Title,
} from '@mantine/core'
import React, { useState } from 'react'
import { Drawer, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons'
const TeamButtonDrawer = () => {
  const theme = useMantineTheme()
  const [addTeam, setaddTeam] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  })

  return (
    <div>
      <Button
        onClick={() => {
          setaddTeam(true)
        }}
        className=" bg-lochmara-400"
        radius={'xl'}
      >
        Add New User
      </Button>

      <Drawer
        onClose={() => {
          setaddTeam(false)
        }}
        position="right"
        size={'38%'}
        opened={addTeam}
        closeOnClickOutside={false}
        withCloseButton={false}
        overlayProps={{
          color: theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3
        }}

      >
        <Box className="px-8 py-6 space-y-6">
          <div className="flex justify-between items-center">
            <Title order={4}>Add a User</Title>

            <CloseButton
              onClick={() => {
                setaddTeam(false)
              }}
              title="Close"
              size="xl"
              radius={'xl'}
              iconSize={25}
            />
          </div>

          <div>
            <form
              onSubmit={form.onSubmit((values) => {
                console.log(values)
              })}
              className="space-y-4"
            >
              <TextInput
                withAsterisk
                label="Enter team name"
                placeholder="Enter team name"
                size="md"
                {...form.getInputProps('name')}
              />

              <TextInput
                withAsterisk
                size="md"
                label="Enter team email address"
                placeholder="Enter team email"
                {...form.getInputProps('email')}
              />

              <Switch label="The account's features will be fully accessible to this user. This can be changed later." />

              <Alert icon={<IconAlertCircle size={16} />}>
                The user will be sent an email to set their password
              </Alert>

              <Button
                // size="md"
                type="submit"

                radius={'xl'}
                className=" bg-lochmara-400"
              >
                Submit
              </Button>
            </form>
          </div>
        </Box>
      </Drawer>
    </div>
  )
}

export default TeamButtonDrawer
