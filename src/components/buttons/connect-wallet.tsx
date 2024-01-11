import { FC } from "react";
import { AppButton } from "../app/app-button";
import { useAccount } from "@/modules/account/context";
import { useConfig } from "@/modules/configs/context";
import { useBlockChain } from "@/share/blockchain/context";
import { Group, Skeleton, rem, useMantineTheme } from "@mantine/core";
import { IconWallet } from "@tabler/icons-react";
import { ProviderType } from "@/share/blockchain/types";

export const ConnectWallet: FC = () => {
  const account = useAccount();
  const config = useConfig();
  const blockchain = useBlockChain();
  const theme = useMantineTheme();

  const handleConnectWallet = async (providerType: ProviderType) => {
    try {
      const user = await account.signIn(providerType);
      console.log("user: ", user)
    } catch (error) {
      throw error;
    }
  }

  if (!account.isInitialized) return <Skeleton width={100} height={40} />

  //If user have already an account in webapp
  if (account.information) {
    if (config.chainId !== blockchain.chainId) {
      return <Group>
        <AppButton
          color={theme.colors.primary[5]}
          height={45}
          width={156}
        >
          Kết nối tới {config.chain.name}
        </AppButton>
      </Group>
    }

    return <Group>

    </Group>
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