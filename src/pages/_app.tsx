import { ConfigsProvider, PRIMARY_COLOR, PRIMARY_DARK_COLOR, useConfig } from '@/modules/configs/context'
import '@/styles/globals.scss'
import '@mantine/core/styles.css';
import type { AppProps } from 'next/app'
import { FC, PropsWithChildren } from 'react'
import { MantineProvider } from '@mantine/core'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { AppModule } from '@/modules/app/modules'
import { BlockChainProvider } from '@/share/blockchain/context';
import { AccountProvider } from '@/modules/account/context';
import { ErrorModal } from '@/components/modals/modal-error';

const App: FC<PropsWithChildren> = (props) => {

  return (
    <AccountProvider>
      <main>
        {props.children}

        {/* APP MODALS */}
        <ErrorModal />
      </main>
    </AccountProvider>
  )
}

export default function ({ Component, pageProps }: AppProps) {
  const { isDarkMode } = useConfig();
  const themeColors = AppModule.getThemeColors();

  return <BlockChainProvider>
    <MantineProvider
      theme={{
        fontFamily: 'Roboto, sans-serif',
        colors: {
          ...themeColors,
          text: ['#F8F9FA', '#364145']
        },
        primaryColor: !isDarkMode ? PRIMARY_COLOR : PRIMARY_DARK_COLOR,
        components: {
          Text: {
            defaultProps: (theme: any) => ({
              color: theme.colorScheme === 'dark' ? theme.colors.text[0] : theme.colors.text[1]
            })
          }
        }

      }}
    >
      <ConfigsProvider>
        <Provider store={store}>
          <App>
            <Component {...pageProps} />
          </App>
        </Provider>
      </ConfigsProvider>
    </MantineProvider>
  </BlockChainProvider>
}
