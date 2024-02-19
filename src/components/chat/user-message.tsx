import { useAccount } from "@/modules/account/context";
import { DateTimeUtils, StringUtils } from "@/share/utils";
import { Avatar, Box, Group, Text, useMantineTheme } from "@mantine/core";
import { FC } from "react";

export const UserMessage: FC<{ message: any }> = ({ message }) => {
  const theme = useMantineTheme();
  const account = useAccount();
  const isSignedAccount = account.information?.wallet === message.sender.wallet;

  return <>
    {isSignedAccount ? <Group justify="end" gap={6}>
      <Text size="12px" c={theme.colors.gray[7]}>{DateTimeUtils.formatToShow(message.createdAt)}</Text>
      <Box p={10} maw={400} style={{
        borderRadius: '24px',
        backgroundColor: theme.colors.primary[5]
      }}>
        {StringUtils.isURL(message.content) ? <Text<'a'> component='a' target="_blank" rel="noopener noreferrer" href={message.content} c={theme.colors.text[0]} style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          textDecoration: 'underline'
        }}>{message.content}</Text> : <Text c={theme.colors.text[0]} style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}>{message.content}</Text>}
      </Box>
      <Avatar w={48} h={48} src={message.sender.avatar || '/images/default/avatar.png'} />
    </Group> : <Group gap={6}>
      <Avatar w={48} h={48} src={message.sender.avatar || '/images/default/avatar.png'} />
      <Box p={10} maw={400} style={{
        borderRadius: '24px',
        backgroundColor: theme.colors.gray[2],
      }}>
          {StringUtils.isURL(message.content) ? <Text<'a'> component='a' target="_blank" rel="noopener noreferrer" href={message.content} c={theme.colors.text[1]} style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          textDecoration: 'underline'
        }}>{message.content}</Text> : <Text c={theme.colors.text[1]} style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}>{message.content}</Text>}
      </Box>
      <Text size="12px" c={theme.colors.gray[7]}>{DateTimeUtils.formatToShow(message.createdAt)}</Text>
    </Group>}
  </>
}