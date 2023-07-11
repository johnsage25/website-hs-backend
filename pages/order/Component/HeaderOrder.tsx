import { Anchor, Container, Header } from '@mantine/core'
import React from 'react'
import LogoW from '../../../Components/LogoW'
import _ from 'lodash'
import { UserSection1 } from '../../_Layout/UserSection1'

const HeaderOrder = (props: any) => {
    return (
        <Header height={60} className=' shadow-sm py-3' style={{ background: '#232f3e' }}>
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

export default HeaderOrder