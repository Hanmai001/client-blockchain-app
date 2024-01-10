import { useAccount } from "@/modules/account/context"
import { Group, Stack, Text } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import { ethers } from "ethers"
import { FC } from "react"
import { AccountAvatar } from "./account-avatar"
import { StringUtils } from "@/share/utils"


interface AccountInfoProps {
  wallet: string
}

export const AccountInfo: FC<AccountInfoProps> = (props) => {
  const account = useAccount();
  const clipboard = useClipboard({ timeout: 2000 });

  const copyWallet = () => clipboard.copy(props.wallet);

  const isValid = account.wallet === ethers.getAddress(props.wallet);

  if (isValid) return <Group onClick={copyWallet}>
    <AccountAvatar src={account.information?.avatar} size={48} />
    <Stack>
      <Text size="12">{StringUtils.compact(props.wallet, 2, 5)}</Text>
      <Text size="12">{account.information?.username ? account.information?.username : 'unknown'}</Text>
    </Stack>
  </Group>

  return (
    <Group onClick={copyWallet}>
      <Text size="12">{StringUtils.compact(props.wallet, 2, 5)}</Text>
      <Text size="12">{account.information?.username ? account.information?.username : 'unknown'}</Text>
    </Group>
  )

}