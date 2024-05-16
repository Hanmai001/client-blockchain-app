import { ModalBuyNft } from '@/components/modals/modal-buy-nft';
import { ModalCancel } from '@/components/modals/modal-cancel';
import { ErrorModal } from '@/components/modals/modal-error';
import { ModalListNft } from '@/components/modals/modal-list-nft';
import { ModalNftDetail } from '@/components/modals/modal-nft-detail';
import { ModalShareNft } from '@/components/modals/modal-share-nft';
import { ModalSuccess } from '@/components/modals/modal-success';
import { AccountProvider } from '@/modules/account/context';
import { AppModule } from '@/modules/app/modules';
import { ChatProvider } from '@/modules/chat/context';
import { ConfigsProvider, PRIMARY_COLOR, PRIMARY_DARK_COLOR, useConfig } from '@/modules/configs/context';
import { NotificationProvider } from '@/modules/notification/context';
import { store } from '@/redux/store';
import { BlockChainProvider } from '@/share/blockchain/context';
import '@/styles/globals.scss';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import { Notifications } from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import { AppProps } from "next/app";
import { Nunito } from 'next/font/google';
import { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { ModalSubscribeCollection } from '@/components/modals/modal-subscribe-collection';

const nunito = Nunito({
  weight: '500',
  subsets: ['latin'],
});

const App: FC<PropsWithChildren> = (props) => {

  return (
    <>
      {/* <Notifications /> */}
      <main className={nunito.className}>
        {props.children}

        {/* APP MODALS */}
        <ModalSuccess />
        <ErrorModal />
        <ModalListNft />
        <ModalBuyNft />
        <ModalCancel />
        <ModalShareNft />
        <ModalNftDetail />
        <ModalSubscribeCollection />
      </main>
    </>
  )
}

export default function ({ Component, pageProps }: AppProps) {
  const { isDarkMode } = useConfig();
  const themeColors = AppModule.getThemeColors();
  return <MantineProvider
    theme={{
      colors: {
        ...themeColors,
        text: ['#F8F9FA', '#364145']
      },
      primaryColor: !isDarkMode ? PRIMARY_COLOR : PRIMARY_DARK_COLOR,
      components: {
        Text: {
          defaultProps: (theme: any) => ({
            // color: colorSchemeManager.get('dark') === 'dark' ? theme.colors.text[0] : theme.colors.text[1]
          })
        }
      }

    }}
  >
    <BlockChainProvider>
      <ConfigsProvider>
        <AccountProvider>
          <ChatProvider>
            <NotificationProvider>
              <Provider store={store}>
                <App>
                  <Component {...pageProps} />
                </App>
              </Provider>
            </NotificationProvider>
          </ChatProvider>
        </AccountProvider>
      </ConfigsProvider>
    </BlockChainProvider>
  </MantineProvider>
}
