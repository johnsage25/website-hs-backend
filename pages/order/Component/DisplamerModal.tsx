import { ActionIcon, CloseButton, Group, List, Stack, Text, Title } from '@mantine/core'
import React from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { useDisclosure } from '@mantine/hooks';
import { Modal, useMantineTheme } from '@mantine/core';

const DisplamerModal = (props: any) => {

    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();


    return (
        <div>
            <ActionIcon onClick={open}>
                <AiOutlineQuestionCircle size={18} />
            </ActionIcon>


            <Modal
                opened={opened}
                onClose={close}
                size="calc(100vw - 20rem)"
                withCloseButton={false}
                overlayProps={{
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                    opacity: 0.55,
                    blur: 3,
                }}


            >

                <Group position="apart" className=' px-4'>
                    <Text fw={700} size={20}>Disclaimers</Text>
                    <CloseButton onClick={close} title="Close popover" size="xl" iconSize={20} />
                </Group>
                <div className='p-10'>
                    <List className='list-disc space-y-4'>
                        <List.Item>
                            <Text>
                                ICANN fees, taxes, transfers, premium domains, premium templates, Search Engine Visibility advertising budget, gift cards or Trademark Holders/Priority Pre-registrations, and pre-registration fees are not eligible for discounts. Please note that this offer cannot be combined with any other promotions, sales, discounts, or offers. Discounted products will renew at the current renewal list price after the initial purchase term. This offer is valid for new product purchases only and cannot be applied to product renewals.
                            </Text>
                        </List.Item>
                        <List.Item>
                            This special offer price is applicable for one new or transfer domain per customer within the specified offer term. Once the initial purchase term is completed, customers may purchase additional years or domains at the regular or then-current price. Please note that discount offers cannot be combined with other promotions or offers. Some payment methods may not be accepted with this offer, and only acceptable payments will be displayed during checkout. The discount will be applied in your shopping cart. After the initial purchase term, discounted products will renew at the then-current renewal rate. HostSpacing reserves the right to deny the use of this offer and/or cancel domains purchased through this offer if it is found to be abused or used fraudulently, as determined by HostSpacing in its sole discretion.
                        </List.Item>
                        <List.Item>Private Registration will renew at the regular renewal rate.</List.Item>
                        <List.Item>Savings are based on HostSpacing regular pricing.</List.Item>
                        <List.Item>Annual discounts available on NEW purchases only.</List.Item>
                    </List>


                </div>
            </Modal>

        </div>
    )
}

export default DisplamerModal