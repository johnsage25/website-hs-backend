import {
  Anchor,
  Box,
  Button,
  CloseButton,
  Drawer,
  Group,
  Text,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from '@mantine/core'
import React, { useState } from 'react'
import { useForm, yupResolver } from '@mantine/form'
import * as Yup from 'yup';
import { trpc } from '../../utils/trpc';
import { toast } from 'react-hot-toast';

const AddSSHBlock = () => {
  const theme = useMantineTheme()
  const [sshDrawer, setsshDrawer] = useState(false)
  const sshMutation = trpc.profile.addSSH.useMutation()

  const utils = trpc.useContext();

  const schema = Yup.object().shape({
    label: Yup.string().max(100, "Must not be above 100 letters.").required("Label cannot be blank."),
    key: Yup.string().required('Public key cannot be blank.'),
  });

  const form = useForm({
    initialValues: {
      label: '',
      key: '',
    },
    validate: yupResolver(schema),
  })

  return (
    <div>
      <Button
        className=" bg-lochmara-400"
        onClick={() => {
          setsshDrawer(true)
        }}
        radius={'xl'}
      >
        Add SSH Key
      </Button>
      <Drawer
        opened={sshDrawer}
        onClose={() => {
          setsshDrawer(false)
        }}
        overlayProps={{
          color:theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
            opacity:0.55,
            blur:3
        }}

        closeOnClickOutside={false}
        position="right"
        size={"lg"}
        withCloseButton={false}

      >
        <Box className="px-8 py-6 space-y-5">
          <div className="flex justify-between items-center">
            <Title order={4} className="text-gray-700">
              Add SSH Key
            </Title>

            <CloseButton
              onClick={() => {
                setsshDrawer(false)
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
                sshMutation.mutate({...values}, {
                    onSuccess(data, variables, context) {
                        setsshDrawer(false)
                        utils.profile.sshlist.prefetch()
                        form.reset();
                    },
                    onError(error, variables, context) {

                    },
                })

              })}
              className="space-y-4"
            >
              <TextInput label="Label" {...form.getInputProps('label')} />

              <Textarea
                minRows={10}
                label="SSH Public Key"
                {...form.getInputProps('key')}
              />

              <Group position="right" mt="md">
                <Anchor
                  onClick={() => {
                    setsshDrawer(false)
                  }}
                >
                  <Text fw={600}>Cancel</Text>
                </Anchor>
                <Button loading={sshMutation.isLoading} type="submit" radius={'xl'} className="bg-lochmara-400">
                  Add SSH Key
                </Button>
              </Group>
            </form>
          </div>
        </Box>
      </Drawer>
    </div>
  )
}

export default AddSSHBlock
