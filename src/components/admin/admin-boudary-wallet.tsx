import { useAccount } from "@/modules/account/context";
import { Roles } from "@/modules/user/types";
import { FC, PropsWithChildren } from "react";
import { ConnectWallet } from "../buttons/connect-wallet";
import { Card, Center, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { useBlockChain } from "@/share/blockchain/context";
import { useConfig } from "@/modules/configs/context";

export const AdminBoundaryWallet: FC<PropsWithChildren> = ({ children }) => {
  const theme = useMantineTheme();
  const account = useAccount();
  const blockchain = useBlockChain();
  const config = useConfig();
  const isAdmin = account.information && account.information?.role === Roles.ADMIN;
  const isMatchedChain = config.chainId === blockchain.chainId

  if (!isAdmin) return <Center>
    <Card withBorder shadow='md' miw={400} py={"xl"} radius={10} mt={100}>
      <Stack align='center'>
        <Title c={theme.colors.text[1]} order={4}>Liên kết</Title>
        {function () {
          if (!isMatchedChain) return <Text style={{ textAlign: 'center' }}>Kết nối tới mạng không được hỗ trợ, vui lòng đổi mạng khác</Text>
          return <Text c={theme.colors.text[1]} style={{ textAlign: 'center' }}>Vui lòng đăng nhập bằng tài khoản QUẢN TRỊ VIÊN</Text>
        }()}
        <ConnectWallet />
      </Stack>
    </Card>
  </Center>

  return <>
    {children}
  </>
}