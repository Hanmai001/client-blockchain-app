import { FC } from "react";
import { AppButton } from "../app/app-button";
import { useAccount } from "@/modules/account/context";
import { useConfig } from "@/modules/configs/context";
import { useBlockChain } from "@/share/blockchain/context";
import { Group, Skeleton, rem, useMantineTheme } from "@mantine/core";
import { IconWallet } from "@tabler/icons-react";
import { ChainId, ProviderType } from "@/share/blockchain/types";

export const ConnectWallet: FC = () => {
  const account = useAccount();
  const config = useConfig();
  const blockchain = useBlockChain();
  const theme = useMantineTheme();

  const handleConnectWallet = async (providerType: ProviderType) => {
    try {
      await account.signIn(providerType);
    } catch (error) {

    }
  }

  if (!account.isInitialized) return <Skeleton width={100} height={40} />

  //If user have already an account in webapp
  if (account.information) {
    //User's connected chain is different from default chainId of webapp
    if (blockchain.chainId && config.chainId !== blockchain.chainId) {
      return (
        <Group>
          <AppButton
            async
            color={theme.colors.primary[5]}
            height={45}
            width={156}
            onClick={() => blockchain.connectChain(blockchain.chainId as ChainId).catch(error => { })}
          >
            Đổi mạng
          </AppButton>
        </Group>
      );
    }
  }

  //If user don't have an account in webapp
  return <AppButton
    async
    onClick={(e) => handleConnectWallet('metamask')}
    leftSection={<IconWallet size={24} />}
    radius={8}
    color={theme.colors.primary[5]}
    height={45}
    width={156}
  >
    Kết nối ví
  </AppButton>
}