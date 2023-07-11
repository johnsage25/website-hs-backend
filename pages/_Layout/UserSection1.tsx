import {
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Avatar,
    Text,
    createStyles,
    Anchor,
    Box,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons';
import { CustomerType } from '../../Types/CustomerType';
import { VscChevronDown, VscChevronUp } from 'react-icons/vsc';
import { Menu, MenuDivider, MenuHeader } from '@szhsin/react-menu';
import { truncate } from 'lodash';
import { useState } from 'react';


const useStyles = createStyles((theme) => ({
    user: {
        display: 'block',
        width: '100%',
        // padding: theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
            color: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
    },
}));

interface UserButtonProps extends UnstyledButtonProps {
    image: string;
    name: string;
}

export function UserSection1({ image, name }: UserButtonProps) {
    const { classes } = useStyles();
    const [menuOpen, setmenuOpen] = useState(false)
    return (
        <>

            <Menu
                direction="bottom"
                offsetX={200}
                offsetY={5}
                menuButton={
                    <UnstyledButton onClick={(e) => {
                        setmenuOpen(!menuOpen)
                    }} className={classes.user}>
                        <Group>
                            <Avatar src={image} radius="xl" />

                            {/* <div style={{ flex: 1 }}>
                                <Text size="md" color='white' weight={500}>
                                    {name}
                                </Text>
                            </div> */}
                            {menuOpen ? (
                                <VscChevronDown color='white' size={16} />
                            ) : (
                                <VscChevronUp color='white' size={16} />
                            )}
                        </Group>
                    </UnstyledButton>
                }
            >
                <div className="px-6 py-2">
                    <Text fw={700} size={18}>
                        {truncate(name || "", {
                            length: 22,
                            omission: '',
                        })}
                    </Text>
                </div>
                <MenuHeader>MY PROFILE</MenuHeader>
                <MenuDivider />
                <Group p={14}>
                    <div className="flex flex-col space-y-2 px-4">
                        <Anchor
                            size={15}
                            className={'hover:bg-none'}
                            href="/profile/information"
                            rel="noopener noreferrer"
                        >
                            Display
                        </Anchor>
                        <Anchor size={15} href="/profile/api">
                            API Tokens
                        </Anchor>
                        <Anchor size={15} href="/profile/referrals">
                            Referrals
                        </Anchor>
                    </div>
                    <div className="flex flex-col space-y-2 px-4">
                        <Anchor
                            size={15}
                            className={'hover:bg-none'}
                            href="/profile/settings"
                            rel="noopener noreferrer"
                        >
                            My Settings
                        </Anchor>
                        <Anchor href="/profile/ssh-keys">SSH Keys</Anchor>
                        <Anchor
                            size={15}
                            className={'hover:bg-none'}
                            href="/profile/authentication"
                            rel="noopener noreferrer"
                        >
                            Authentication
                        </Anchor>
                    </div>
                </Group>

                <MenuHeader>Account</MenuHeader>
                <MenuDivider />
                <Box px={30} py={6} className="flex flex-col space-y-2">
                    <Anchor size={15} href="/account/billing">
                        Billing & Contacts Information
                    </Anchor>
                    <Anchor size={15} href="/account/service-transfer">
                        Service Transfer
                    </Anchor>
                    <Anchor size={15} href="/account/settings">
                        Account Settings
                    </Anchor>
                    <Anchor size={15} href="/account/maintenance">
                        Maintenance
                    </Anchor>
                    <Anchor size={15} href={'/account/logout'}>
                        Log Out
                    </Anchor>
                </Box>
            </Menu>


        </>

    );
}