import { ModalBuyNft } from '@/components/modals/modal-buy-nft';
import { ModalCancel } from '@/components/modals/modal-cancel';
import { ModalCreateCollection } from '@/components/modals/modal-create-collection';
import { ModalCreateNft } from '@/components/modals/modal-create-nft';
import { ErrorModal } from '@/components/modals/modal-error';
import { ModalListNft } from '@/components/modals/modal-list-nft';
import { ModalNftDetail } from '@/components/modals/modal-nft-detail';
import { ModalReport } from '@/components/modals/modal-report';
import { ModalShareNft } from '@/components/modals/modal-share-nft';
import { ModalSubscribeCollection } from '@/components/modals/modal-subscribe-collection';
import { ModalSuccess } from '@/components/modals/modal-success';
import { AccountProvider } from '@/modules/account/context';
import { AppModule } from '@/modules/app/modules';
import { ChatProvider } from '@/modules/chat/context';
import { ConfigsProvider, PRIMARY_COLOR, PRIMARY_DARK_COLOR, useConfig } from '@/modules/configs/context';
import { NotificationProvider } from '@/modules/notification/context';
import { store } from '@/redux/store';
import { BlockChainProvider } from '@/share/blockchain/context';
import '@/styles/globals.scss';
import '@mantine/carousel/styles.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import { AppProps } from "next/app";
import { Nunito } from 'next/font/google';
import { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

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
        <ModalCreateCollection />
        <ModalCreateNft />
        <ModalReport />
      </main>
    </>
  )
}

App.displayName = "App";

export default function MyApp({ Component, pageProps }: AppProps) {
  const { isDarkMode } = useConfig();
  const themeColors = AppModule.getThemeColors();
  return (
    <MantineProvider
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
  )
}