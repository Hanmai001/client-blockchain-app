import { useAccount } from "@/modules/account/context"
import { Group, Stack, Text } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import { ethers } from "ethers"
import { FC, useEffect, useState } from "react"
import { AccountAvatar } from "./account-avatar"
import { StringUtils } from "@/share/utils"
import { AccountInformation } from "@/modules/account/types"
import { UserInformation } from "@/modules/user/types"


interface AccountInfoProps {
  account: AccountInformation
}

export const AccountInfo: FC<AccountInfoProps> = (props) => {
  const clipboard = useClipboard({ timeout: 2000 });
  const [information, setInformation] = useState<UserInformation | undefined>(props.account);

  const copyWallet = () => clipboard.copy(props.account.wallet);

  useEffect(() => {
    setInformation(props.account);
  }, [props.account]);

  if (information) {
    return (
      <Group gap={6} onClick={copyWallet}>
        <AccountAvatar src={information.avatar} size={48} />
        <Stack gap={0}>
          <Text style={{ fontSize: '12px' }} fw='bold'>{StringUtils.compact(information.wallet, 2, 5)}</Text>
          <Text style={{ fontSize: '12px' }}>{information.username ? StringUtils.compact(information.username, 2, 5) : 'unknown'}</Text>
        </Stack>
      </Group>
    )
  }

  return null;

}