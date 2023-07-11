import { Avatar, Container, Flex, Group, Header, Image, UnstyledButton } from '@mantine/core'
import { Menu } from '@szhsin/react-menu'
import React from 'react'
import { FiHelpCircle } from 'react-icons/fi'
import LogoIcon from '../../Components/LogoIcon'

type Props = {}

const WelcomeHeader = (props: Props) => {
    return (
        <Header
            height={60}
            className="w-full shadow-sm px-4 relative h-14 py-2 border-b border-b-gray-300 pr-6 z-40 bg-white"
        >

            <Container size={'xl'}>
                <Flex justify={"space-between"} align={'center'}>
                    <div>
                        <UnstyledButton component="a" href="/" className="">
                            <Image src={'../hostspacing_logo.svg'} width={200} alt="logo" />
                        </UnstyledButton>
                    </div>
                    <div>
                        <Avatar
                            src={
                                '/imgs/user.svg'
                            }
                            radius="xl"
                            size={'md'}
                        />
                    </div>
                </Flex>

            </Container>

        </Header>
    )
}

export default WelcomeHeader