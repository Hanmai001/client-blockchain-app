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
import { AppProps } from "next/app";
import { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const App: FC<PropsWithChildren> = (props) => {

  return (
    <AccountProvider>
      <main>
        {props.children}

        {/* APP MODALS */}
        <ModalSuccess />
        <ErrorModal />
        <ModalListNft />
        <ModalBuyNft />
        <ModalCancel />
        <ModalShareNft />
        <ModalNftDetail />
      </main>
    </AccountProvider>
  )
}

export default function ({ Component, pageProps }: AppProps) {
  const { isDarkMode } = useConfig();
  const themeColors = AppModule.getThemeColors();

  // const colorSchemeManager = localStorageColorSchemeManager({
  //   key: 'my-color-scheme',
  // });

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
        <ChatProvider>
          <NotificationProvider>
            <Provider store={store}>
              <App>
                <Component {...pageProps} />
              </App>
            </Provider>
          </NotificationProvider>
        </ChatProvider>
      </ConfigsProvider>
    </BlockChainProvider>
  </MantineProvider>
}
