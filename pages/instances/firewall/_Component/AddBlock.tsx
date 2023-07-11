import { Box, Button, Group, Modal, Select, SimpleGrid, Switch, Text, TextInput, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { forwardRef } from 'react'
import { firewallRules } from '../../../../utils/helpers';
import { trpc } from '../../../../utils/trpc';
import { FirewallInterface } from '../../../../Types/FirewallInterface';
import { toast } from 'react-hot-toast';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
    value: string;
    description: string;
}

const AddBlock = (props: any) => {
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();
    const addFirewallMutation = trpc.node.addFirewall.useMutation()
    const utils = trpc.useContext()

    const form = useForm({
        initialValues: {
            type: 'in',
            enable: false,
            action: 'ACCEPT',
            proto: "tcp",
            sport: 0,
            dport: 0
        },
    });



    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
        ({ value, label, description, ...others }: ItemProps, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <div>
                        <Text size="sm" fw={600}>{value}</Text>
                        <Text size="xs" opacity={0.65}>
                            {description}
                        </Text>
                    </div>
                </Group>
            </div>
        )
    );

    return (
        <div>
            <Button onClick={open} className=' bg-azure-radiance-500 hover:bg-azure-radiance-600' radius={"xl"}>Add new</Button>
            <Modal.Root closeOnClickOutside={false} size={"lg"} opened={opened} onClose={close}>
                <Modal.Overlay color={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]} opacity={0.55} blur={3} />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Add Rule</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body >
                        <form onSubmit={form.onSubmit((values) => {
                            let _d: FirewallInterface = {
                                ...values,
                                orderId: props._id
                            }
                            addFirewallMutation.mutate(_d, {
                                onSuccess(data, variables, context) {
                                    toast.success("New rule added successfully.")
                                    utils.node.firewareRules.invalidate()
                                    close()
                                },
                                onError(error, variables, context) {
                                    console.log(error);
                                    toast.error("Unable to add new rule");
                                },
                            })

                        })} >
                            <div className=" min-h-[200px] px-2 py-4  space-y-3">

                                <SimpleGrid cols={2}>
                                    <Select
                                        label="Direction"
                                        placeholder=""
                                        {...form.getInputProps('type')}
                                        data={[
                                            { value: 'in', label: 'In' },
                                            { value: 'out', label: 'Out' },
                                        ]}
                                    />

                                    <Select
                                        label="Direction"
                                        placeholder=""
                                        {...form.getInputProps('action')}
                                        data={[
                                            { value: 'ACCEPT', label: 'ACCEPT' },
                                            { value: 'DROP', label: 'DROP' },
                                            { value: 'REJECT', label: 'REJECT' },
                                        ]}
                                    />


                                </SimpleGrid>



                                <SimpleGrid cols={2}>
                                    <TextInput
                                        withAsterisk
                                        label="Source port"
                                        placeholder=""
                                        {...form.getInputProps('sport')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label="Dest. port"
                                        placeholder=""
                                        {...form.getInputProps('dport')}
                                    />


                                </SimpleGrid>

                                <SimpleGrid cols={2}>
                                    <Select
                                        label="Protocol"
                                        data={firewallRules}
                                        searchable
                                        filter={(value, item) =>
                                            item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
                                            item.description.toLowerCase().includes(value.toLowerCase().trim())
                                        }
                                        itemComponent={SelectItem}
                                        withinPortal
                                        {...form.getInputProps('proto')}

                                    />


                                </SimpleGrid>

                                <Switch
                                    mt="md"
                                    label="Enable"
                                    {...form.getInputProps('enable', { type: 'checkbox' })}
                                />


                            </div>

                            <Group position="right" >
                                <Button loading={addFirewallMutation.isLoading} type="submit" radius={"xl"} className=' bg-azure-radiance-500 hover:bg-azure-radiance-600'>Submit</Button>
                            </Group>
                        </form>

                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>

        </div>
    )
}

export default AddBlock