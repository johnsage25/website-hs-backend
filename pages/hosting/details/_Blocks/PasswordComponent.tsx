import React from 'react'
import { trpc } from '../../../../utils/trpc'
import { DataTable } from 'mantine-datatable'
import { ActionIcon, Alert, Box, Button, Group, Input, InputBase, PasswordInput, Text, TextInput } from '@mantine/core'
import { AiOutlineMail } from 'react-icons/ai'
import { IconAlertCircle, IconPassword } from '@tabler/icons-react'
import { useForm, yupResolver } from '@mantine/form'
var generator = require('generate-password');
import { IconEPassport } from '@tabler/icons'
import { useClipboard } from '@mantine/hooks'
import { toast } from 'react-hot-toast'
import * as Yup from 'yup';
var password = generator.generate({
    length: 10,
    numbers: true
});

const PasswordComponent = (order: any) => {
    const passwordUpdateMutation = trpc.hostingpanel.passwordUpdate.useMutation()
    const clipboard = useClipboard({ timeout: 500 });

    const schema = Yup.object().shape({
        password: Yup.string().min(6, 'Name should have at least 2 letters').required("Password is a required field"),
        repassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
    });


    // // console.log(mailListList.data);
    const form = useForm({
        validate: yupResolver(schema),
        initialValues: {
            password: '',
            repassword: "",
            username: `${order?.hostMeta[0]?.username}`
        },

    });


    return (
        <Box className='p-4'>
            <Box className='w-4/5 py-6 mx-auto space-y-6'>
                <Alert icon={<IconAlertCircle size="1rem" />} >

                    Update your hosting account&apos;s user password information. For your security, we recommend that you change your password regularly.
                </Alert>

                <form className='w-4/5 mx-auto' onSubmit={form.onSubmit((values) => {

                    passwordUpdateMutation.mutate({ orderId: order.id, ...values }, {
                        onSuccess(data, variables, context) {
                            toast.success("Password updated successfully")

                        },
                        onError(error, variables, context) {
                            // console.log(error);
                            toast.error("Unable to update panel password")
                        },
                    })

                })}>

                    <div className=' space-y-2'>
                        <TextInput
                            placeholder="username"
                            label=""
                            disabled
                            {...form.getInputProps('username')}
                        />
                        <PasswordInput
                            label="Password"
                            {...form.getInputProps('password')}
                        />

                        <PasswordInput
                            label="Repeat password "
                            {...form.getInputProps('repassword')}

                        />

                        <Text className='mt-4' color={'dimmed'}>Set a password which is not a common word and cannot be easily guessed (e.g: use characters such as +-*/% =.)</Text>


                    </div>
                    <Group position="right" mt={15}>
                        <Button onClick={() => {
                            var password = generator.generate({
                                length: 10,
                                numbers: true,
                                // symbols: true,
                                uppercase: true,
                            });

                            form.setValues({
                                password: password,
                                repassword: password,
                            })

                            toast.success("Password copied to clipboard.")

                            clipboard.copy(`${password}`)

                        }} radius={"xl"} variant='default' leftIcon={<IconPassword />}>Generate</Button>
                        <Button loading={passwordUpdateMutation.isLoading} type="submit" radius={"xl"} className=' bg-lochmara-400 hover:bg-lochmara-500'>Submit</Button>
                    </Group>
                </form>
            </Box>
        </Box>
    )
}

export default PasswordComponent