import { useAccount } from "@/modules/account/context";
import { Avatar, Box, Group, Text, useMantineTheme } from "@mantine/core";
import { FC } from "react";

export const UserMessage: FC<{ message: any }> = ({ message }) => {
  const theme = useMantineTheme();
  const account = useAccount();
  const isSignedAccount = account.information?.wallet === message.sender.wallet;

  return <>
    {isSignedAccount ? <Group justify="end">
      <Box p={10} maw={400} style={{
        borderRadius: '24px',
        backgroundColor: theme.colors.primary[5]
      }}>
        <Text c={theme.colors.text[0]}>{message.content}</Text>
      </Box>
      <Avatar w={48} h={48} src={message.sender.avatar || '/images/default/avatar.png'} />
    </Group> : <Group>
      <Avatar w={48} h={48} src={message.sender.avatar || '/images/default/avatar.png'} />
      <Box p={10} maw={400} style={{
        borderRadius: '24px',
        backgroundColor: theme.colors.gray[2],
      }}>
        <Text c={theme.colors.text[1]}>{message.content}</Text>
      </Box>
    </Group>}
  </>
}