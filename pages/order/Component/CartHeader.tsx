import { Anchor, Container, Header } from '@mantine/core'
import React from 'react'
import LogoW from '../../../Components/LogoW'
import { UserSection1 } from '../../_Layout/UserSection1'
import _ from 'lodash'

const CartHeader = (props: any) => {
    return (
        <Header height={55} className=" bg-azure-radiance-700 py-2 z-40 relative ">
            <Container size={'lg'} className=" flex justify-between items-center">
                <div>
                    <Anchor href='/'>
                        <LogoW className=" w-48" />
                    </Anchor>
                </div>
                <div>
                    {!_.isEmpty(props.session) && <UserSection1 name={`${props.session?.customer[0]?.username}`} image={props?.session?.image_url} />}

                </div>
            </Container>
        </Header>
    )
}

export default CartHeader