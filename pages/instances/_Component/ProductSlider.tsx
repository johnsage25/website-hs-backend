import { ActionIcon, Box, Button, Flex, List, Paper, Text, Title, Transition, UnstyledButton, createStyles, rem, useMantineTheme } from '@mantine/core';
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react';
import { VirtualizationInterface } from '../../../Types/VirtualizationInterface';
import CurrencyFormat from 'react-currency-format';
import { useCallback, useRef, useState } from 'react';
import { Pagination, Navigation } from "swiper";
import { IconChevronLeft, IconChevronRight } from '@tabler/icons';
import { motion } from 'framer-motion'
import _ from 'lodash';

const useStyles = createStyles((theme) => ({
    container: {
        height: rem(190),
    },
    card: {
        height: rem(190),
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 900,
        color: theme.white,
        lineHeight: 1.2,
        fontSize: rem(32),
        marginTop: theme.spacing.xs,
    },

    category: {
        color: theme.white,
        opacity: 0.7,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
}));

interface CardProps {
    image: string;
    title: string;
    category: string;
}

function Card({ item, value, onChange }: { value: string, item: VirtualizationInterface, onChange: (value: any) => void, }) {
    const { classes } = useStyles();

    return (
        <Paper
            py={20}
            onClick={() => {
                onChange(item)
            }}
            className={`${classes.card} cursor-pointer ${value == item._id ? " border border-blue-500" : " border border-gray-300"}`}

        >
            <div className={`w-full border-b pb-3 ${value == item._id ? "  border-blue-500" : "  border-gray-200"}`}>
                <div>
                    <div className='flex justify-center items-baseline'>
                        <Title order={3} className='text-center text-xl'>
                            <CurrencyFormat value={item?.monthlyPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        </Title>
                        <Text>/mo</Text>
                    </div>
                    <div className='flex justify-center items-baseline text-gray-600'>
                        <Text className='text-center' size={14}>
                            <CurrencyFormat value={item?.hourlyPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        </Text>
                        <Text>/hr</Text>
                    </div>
                </div>

            </div>
            <div className='text-center w-full pt-3'>
                <Text className=' text-gray-600' size={13}>{item?.memory}{item.memoryType?.toLocaleUpperCase()} / {item?.vcpu} {item.cpuType?.toLocaleUpperCase()} vCPU </Text>
                <Text className=' text-gray-600' size={13}>{item?.storage}{item.storageFormat?.toLocaleUpperCase()} {item.storageType}</Text>
                <Text className=' text-gray-600' size={13}>{item?.bandwidth}{item.bandwidthType?.toLocaleUpperCase()} Bandwidth</Text>
            </div>
        </Paper>
    );
}


export function ProductSlider({ data, value, onChange, hideNav }: { data: VirtualizationInterface[], value: string, onChange: (value: any) => void, hideNav: boolean }) {

    const [lastNext, sethideNext] = useState(false)

    const slides = data?.map((item) => (
        <SwiperSlide key={item._id}>
            <Card onChange={onChange} value={value} item={item} />
        </SwiperSlide>
    ));

    const navigationNextRef = useRef(null);
    const navigationPrevRef = useRef(null);


    return (
        <Box className='relative'>
            <Swiper
                spaceBetween={13}
                slidesPerView={6}
                onSlideChange={(swiper) => {
                    sethideNext(swiper.isEnd)
                }}
                onSwiper={(swiper) => {

                }}
                modules={[Pagination, Navigation]}
                navigation={{
                    prevEl: '.prev',
                    nextEl: '.next',
                }}

                onBeforeInit={(swiper: any) => {
                    swiper.navigation.nextEl = navigationNextRef.current;
                    swiper.navigation.prevEl = navigationPrevRef.current;
                }}

                pagination={{ clickable: true }}
                className=' relative h-56'
            >
                {slides}

            </Swiper>

            <Box className={hideNav == true ? "hidden" : "block"}>
                <div style={{ display: lastNext == true ? "none" : "block" }} className="next absolute cursor-pointer -right-8 top-[40%] transform -translate-y-1/2  rounded-full  z-10 bg-white p-2 shadow-md"><IconChevronRight /></div>
                <div style={{ display: lastNext == false ? "none" : "block" }} className="prev  absolute cursor-pointer -left-8 top-[40%] transform  -translate-y-1/2  rounded-full  z-10 bg-white p-2 shadow-md "><IconChevronLeft /></div>

            </Box>

        </Box>

    );
}