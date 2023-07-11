import '../styles/globals.css'
import 'react-phone-input-2/lib/plain.css'
import '../styles/main.scss'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {
  RecoilRoot,
} from 'recoil';
import type { AppProps } from 'next/app'
import type { AppType } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { trpc } from '../utils/trpc'
import { useRouter } from 'next/router'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import { ModalsProvider } from '@mantine/modals';
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


const MyApp: AppType | any = ({
  Component,
  pageProps,
}: AppPropsWithLayout | AppProps | any) => {
  const router = useRouter()

  const pageName = router.pathname.substring(1);


  const getLayout = Component?.getLayout ?? ((page: any) => page)

  switch (router.pathname.substring(0, router.pathname.lastIndexOf('/'))) {
    case '/account':
      return getLayout(
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS

          theme={{
            // colorScheme: 'light',
            // white: '#f4f4f5',

            fontFamily: `"Source Sans Pro",sans-serif`,
            components: {
              Container: {
                defaultProps: {
                  sizes: {
                    xs: 540,
                    sm: 720,
                    md: 960,
                    // lg: 1240,
                    xl: 1320,
                  },
                },
              },
            },
          }}
        >
          <RecoilRoot>
            <ModalsProvider>
              <Component {...pageProps} pageName={pageName} />
            </ModalsProvider>

          </RecoilRoot>
        </MantineProvider>
      )
    case '/profile':
      return getLayout(<MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
          // white: '#f4f4f5',
          // fontFamily: `"Source Sans Pro",sans-serif`,
          components: {
            Container: {
              defaultProps: {
                sizes: {
                  xs: 540,
                  sm: 720,
                  md: 960,
                  lg: 1240,
                  xl: 1320,
                },
              },
            },
          },
        }}
      >
        <RecoilRoot>
          <ModalsProvider>
            <Component {...pageProps} pageName={pageName} />
          </ModalsProvider>

        </RecoilRoot>
      </MantineProvider>)
    default:
      return (
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'light',
            // white: '#f4f4f5',
            // fontFamily: `"Source Sans Pro",sans-serif`,
            components: {
              Container: {
                defaultProps: {
                  sizes: {
                    xs: 540,
                    sm: 720,
                    md: 960,
                    lg: 1240,
                    xl: 1320,
                  },
                },
              },
            },
          }}
        >
          <RecoilRoot>
            <ModalsProvider>
              <Component {...pageProps} pageName={pageName} />
            </ModalsProvider>

          </RecoilRoot>
        </MantineProvider>
      )
  }
}
export default trpc.withTRPC(MyApp)
