import { Image } from '@mantine/core'
import React from 'react'
import UserHeader from '../_Layout/UserHeader'

const Index = () => {
  return (
    <div>

        <div className='py-8'>
            <div className='w-3/5 mx-auto object-center flex justify-center border border-gray-200 my-8'>
                <Image className=' w-40' src={'./svg/welcome_step.svg'} alt={""}  width={600} />
            </div>
        </div>
    </div>
  )
}

export default Index