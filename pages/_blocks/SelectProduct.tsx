import { Button, Group, Modal, Text, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconChevronDown, IconCloudComputing, IconMessageCircle, IconPhoto, IconSettings, IconWall, IconWorldWww } from '@tabler/icons'
import React from 'react'
import { Menu, MenuItem, MenuButton, MenuDivider } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { VscServerEnvironment } from 'react-icons/vsc';
import { IconServer } from '@tabler/icons-react';
import { AiOutlineCluster, AiOutlineMail } from 'react-icons/ai';
import { HiOutlineServer } from 'react-icons/hi';
import { IconDatabase } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import {  CgServer } from 'react-icons/cg';

type Props = {}

const SelectProduct = (props: Props) => {
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter()
    const theme = useMantineTheme();
    return (
        <div>

            <Menu
                className={" w-32"}
                menuButton={<Button onClick={open} radius={"xl"} rightIcon={<IconChevronDown stroke={1.5} size={24} />} className=' bg-azure-radiance-500  hover:bg-azure-radiance-500'>
                    Create
                </Button>}
                onItemClick={(e) =>  console.log(`[Menu] ${e.value} clicked`)}
            >
                <MenuItem href="/instances/create" >
                    <Group>
                        <VscServerEnvironment className=' fill-azure-radiance-600' size={26} />
                        <div>
                            <Text fw={500}>Node</Text>
                            <Text size={14} className=' font-normal text-gray-500'>High performance SSD Linux servers</Text>
                        </div>
                    </Group>
                </MenuItem>

                <MenuItem
                    href="/instances/volume"

                >
                    <Group>
                        <IconServer className=' text-azure-radiance-600' size={26} />
                        <div>
                            <Text fw={500}>Volume</Text>
                            <Text size={14} className=' font-normal text-gray-500'>Attach additional storage to your node</Text>
                        </div>
                    </Group>
                </MenuItem>
                <MenuItem >
                    <Group>
                        <AiOutlineCluster className=' text-azure-radiance-600' size={26} />
                        <div>
                            <Text fw={500} >NodeBalancer</Text>
                            <Text size={14} className=' font-normal text-gray-500'>Ensure your services are highly available</Text>
                        </div>
                    </Group>
                </MenuItem>

                <MenuItem >
                    <Group>
                        <IconWall className=' text-azure-radiance-600' size={26} />
                        <div>
                            <Text fw={500}>Firewall</Text>
                            <Text size={14} className=' font-normal text-gray-500'>Control network access to your nodes</Text>
                        </div>
                    </Group>
                </MenuItem>

                <MenuDivider />

                <MenuItem >
                    <Group>
                        <IconDatabase className=' text-azure-radiance-600' size={26} />
                        <div>
                            <Text fw={500} >Database</Text>
                            <Text size={14} className=' font-normal text-gray-500'>Create database clusters</Text>
                        </div>
                    </Group>
                </MenuItem>
                <MenuDivider />

                <MenuItem href='/'>
                    <Group>
                        <IconCloudComputing className=' text-azure-radiance-600' size={26} />
                        <div>
                            <Text fw={500} >Web Hosting</Text>
                            <Text size={14} className=' font-normal text-gray-500'>Save time and host using Plesk or Cpanel</Text>
                        </div>
                    </Group>
                </MenuItem>

                <MenuItem >
                    <Group>
                        <IconWorldWww className=' text-azure-radiance-600' size={26} />
                        <div>
                            <Text fw={500} >Domains</Text>
                            <Text size={14} className=' font-normal text-gray-500'>Link or register a new domain</Text>
                        </div>
                    </Group>
                </MenuItem>

                <MenuItem >
                    <Group>
                        <CgServer className=' text-azure-radiance-600' size={26} />
                        <div>
                            <Text fw={500}>Bare-Metal Servers</Text>
                            <Text size={14} className=' font-normal text-gray-500'>Powerful physical servers</Text>
                        </div>
                    </Group>
                </MenuItem>


            </Menu>


            {/* <Menu shadow="md" width={200}>
                <Menu.Target>

                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
                    <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
                    <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>

                </Menu.Dropdown>
            </Menu> */}

        </div>
    )
}

export default SelectProduct