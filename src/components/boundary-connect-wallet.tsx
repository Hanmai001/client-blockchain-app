import { useAccount } from '@/modules/account/context';
import { useConfig } from '@/modules/configs/context';
import { useBlockChain } from '@/share/blockchain/context';
import { Card, Center, Skeleton, Stack, Title, Text, useMantineTheme, Box } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';
import { ConnectWallet } from './buttons/connect-wallet';
import { AppHeader } from './app/app-header';

export const BoundaryConnectWallet: FC<PropsWithChildren> = ({ children }) => {
  const account = useAccount();
  const blockchain = useBlockChain();
  const config = useConfig();
  const theme = useMantineTheme();

  return (
    <>
      {function () {
        const isMatchedChain = config.chainId === blockchain.chainId

        if (!account.isInitialized || !blockchain.isInitialized) return <Skeleton height={400} />
        if (!account.information || !isMatchedChain) return <>
          <AppHeader />
          <Center>
            <Card withBorder shadow='md' miw={400} py={"xl"} radius={10} mt={100}>
              <Stack align='center'>
                <Title c={theme.colors.text[1]} order={4}>Liên kết</Title>
                {function () {
                  if (!isMatchedChain) return <Text style={{ textAlign: 'center' }}>Kết nối tới mạng không được hỗ trợ, vui lòng đổi mạng khác</Text>
                  return <Text c={theme.colors.text[1]} style={{ textAlign: 'center' }}>Kết nối ví để sử dụng tính năng này bạn nhé!!!</Text>
                }()}
                <ConnectWallet />
              </Stack>
            </Card>
          </Center>
        </>

        return <>
          {children}
        </>
      }()}
    </>
  )
}
