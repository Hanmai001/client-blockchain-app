import { useChatContext } from "@/modules/chat/context";
import { StringUtils } from "@/share/utils";
import { Avatar, Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { FC } from "react";

export const ChatBox: FC<{ chat: any, onChange: (chatID: string, recipient: string) => void }> = ({ chat, onChange }) => {
  const theme = useMantineTheme();
  const chatContext = useChatContext();

  return <Group
    mb={8}
    p={10}
    mr={10}
    style={{
      borderRadius: '10px',
      cursor: 'pointer',
      backgroundColor: chatContext.selectedChat === chat.id ? theme.colors.gray[2] : ''
    }}
    onClick={() => onChange(chat.id, chat.recipient.wallet)}
  >
    <Avatar w={64} h={64} src={chat.recipient.avatar || '/images/default/avatar.png'} />

    <Stack h={64} gap={0} justify="center">
      <Text c={theme.colors.text[1]} fw={500}>{StringUtils.limitCharacters(chat.recipient.username, 15)}</Text>
      <Text c={theme.colors.gray[7]}>{chat.lastText}</Text>
    </Stack>
  </Group>
}