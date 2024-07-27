import { AppHeader } from "@/components/app/app-header";
import { AppTitle } from "@/components/app/app-title";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { ChatBox } from "@/components/chat/chat-box";
import { UserMessage } from "@/components/chat/user-message";
import { EmptyMessage } from "@/components/empty-message";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { useChatContext } from "@/modules/chat/context";
import { UserModule } from "@/modules/user/modules";
import { UserInformation } from "@/modules/user/types";
import { AppShell, Avatar, Box, Group, Loader, Stack, Text, TextInput, useMantineTheme } from "@mantine/core";
import { IconPhoto, IconSearch } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';

export const MessagesScreen: FC = () => {
  return <AppShell
    mah={'100vh'}
    header={{ height: 70 }}
    navbar={{ width: { sm: 70, md: 360, lg: 360 }, breakpoint: 'sm' }}
    styles={{
      header: {
        border: 'none'
      },
      navbar: {
        // border: 'none'
      },
    }}
  >
    <AppTitle />
    <AppShell.Header style={{ zIndex: 99 }}>
      <AppHeader />
    </AppShell.Header>

    <AppShell.Navbar style={{ zIndex: 99 }}>
      <SideBoxChats />
    </AppShell.Navbar>

    <AppShell.Main style={{ zIndex: 99 }}>
      <BoundaryConnectWallet>
        <MainChat />
      </BoundaryConnectWallet>
    </AppShell.Main>
  </AppShell>
}

const SideBoxChats: FC = () => {
  const theme = useMantineTheme();
  const chatContext = useChatContext();
  const account = useAccount();
  const [chats, setChats] = useState<any[]>([]);
  const { isMobile, isTablet } = useResponsive();

  const fetchChats = async () => {
    try {
      const res: any = [];
      for (const v of chatContext.chats) {
        let wallet = '';
        if (account.information?.wallet === v.secondUser) wallet = v.firstUser;
        else wallet = v.secondUser;
        const user = await UserModule.getByWallet(wallet);
        res.push({ ...v, recipient: user });
      }
      setChats(res);
    } catch (error) {
      setChats([]);
    }
  }

  const handleSelectChatBox = async (chatID: string, recipient: string) => {
    await chatContext.handleChangeChat(chatID, recipient);
  }

  useEffect(() => {
    fetchChats();
  }, [chatContext.chats, chatContext.messages])

  return <Stack pl={20} mt={20}>
    <Box mr={20}>
      <TextInput
        placeholder="Tìm kiếm tin nhắn"
        rightSection={<IconSearch />}
        radius={24} miw='100%'
        styles={{
          input: {
            height: '45px',
            paddingLeft: `${theme.spacing.md}`,
          },
          section: {
            paddingRight: `${theme.spacing.md}`
          }
        }}
      />
    </Box>

    <InfiniteScroll
      style={{
        overflowY: 'scroll'
      }}
      height={'calc(100vh - 160px)'}
      dataLength={chats.length}
      next={() => chatContext.setActivePageChats()}
      hasMore={chats.length < chatContext.chatCount ? true : false}
      loader={<Group justify="center"><Loader color={theme.colors.primary[5]} size={24} /></Group>}
    >
      {function () {
        if (chats.length === 0) return <EmptyMessage />

        return <>
          {chats.map((v, k) => <ChatBox onChange={handleSelectChatBox} chat={v} key={k} />)}
        </>
      }()}
    </InfiniteScroll>
  </Stack>
}

const MainChat: FC = () => {
  const theme = useMantineTheme();
  const chatContext = useChatContext();
  const account = useAccount();
  const [input, setInput] = useState<string>("");
  const [istyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [recipient, setRecipient] = useState<UserInformation>();
  const { isMobile, isTablet } = useResponsive();

  const handleSendMessages = async () => {
    try {
      //api send message payload: {content, chatID}
      chatContext.sendMessages(input);
      setInput('');
    } catch (error) {

    }
  }

  const fetchMessages = async () => {
    try {
      const res: any = [];
      for (const v of chatContext.messages) {
        const user = await UserModule.getByWallet(v.senderID);
        res.push({ ...v, sender: user });
      }
      setMessages(res);
    } catch (error) {

    }
  }

  const fetchRecipient = async () => {
    try {
      const recipient = await UserModule.getByWallet(chatContext.recipient);
      setRecipient(recipient);
    } catch (error) {
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [chatContext.selectedChat, chatContext.messages]);

  useEffect(() => {
    fetchRecipient();
  }, [chatContext.recipient])

  return <Stack h={'calc(100vh - 70px)'} justify="space-between">
    <Group p={10} style={{
      borderBottom: `1px solid ${theme.colors.gray[2]}`,
      boxShadow: `0 1px 4px rgba(0, 0, 0, 0.1)`,
    }}>
      <Avatar w={48} h={48} src={recipient?.avatar || '/images/default/avatar.png'} />

      <Text c={theme.colors.text[1]} fw={500}>{recipient?.username}</Text>
    </Group>

    <InfiniteScroll
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        padding: '0 10px',
        gap: '15px'
      }}
      height={'calc(100vh - 240px)'}
      dataLength={messages.length || 0}
      next={chatContext.setActivePageMessages}
      hasMore={messages.length < chatContext.messageCount ? true : false}
      loader={<Group justify="center"><Loader color={theme.colors.primary[5]} size={24} /></Group>}
      inverse={true}
    >
      {messages.map((v, k) => <UserMessage key={k} message={v} />)}
    </InfiniteScroll>

    <Group p={10} h={80} style={{
      borderTop: `1px solid ${theme.colors.gray[2]}`,
      boxShadow: `0px 1px 4px rgba(0, 0, 0, 0.1)`,
    }}>
      <IconPhoto size={32} stroke={1.5} color={theme.colors.primary[7]} />
      <TextInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessages();
          }
        }}
        placeholder="Aa"
        radius={24} miw='90%'
        styles={{
          input: {
            height: '45px',
            paddingLeft: `${theme.spacing.md}`,
          },
          section: {
            paddingRight: `${theme.spacing.md}`
          }
        }}
      />
    </Group>
  </Stack>
}

