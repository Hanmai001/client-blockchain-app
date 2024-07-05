import { useBlockChain } from "@/share/blockchain/context";
import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ChatModule } from "./modules";
import { ChatPropsContext, ChatStatus, Message } from "./types";

export const ChatContext = createContext<ChatPropsContext>({} as any);

//sever for chat
const ENDPOINT = "http://blockclip.pro.vn:5000";
var socket: Socket;

export const ChatProvider: FC<PropsWithChildren> = (props) => {
  const [status, setStatus] = useState<ChatStatus>({ messages: [], selectedChat: '', recipient: '', chats: [], messageCount: 0, chatCount: 0 });
  const blockchain = useBlockChain();
  const [activePageMessages, setPageMessages] = useState(1);
  const [occurCreateChat, setOccurChat] = useState(false);
  const [activePageChats, setPageChats] = useState(1);
  const [isSent, setIsSent] = useState(false);
  const limitMessages = 20, limitChats = 10;

  const handleChangeChat = async (chatID: string, recipient: string) => {
    try {
      setPageMessages(1);
      setStatus(s => ({ ...s, selectedChat: chatID, recipient, messages: [], messageCount: 0 }));
    } catch (error) {
      setStatus(s => ({ ...s }))
    }
  }

  const checkIfAvailableChat = async (recipient: string) => {
    try {
      const res = await ChatModule.checkAvailableChat(recipient);
      if (Object.keys(res.data).length === 0) return null;
      return res.data;
    } catch (error) {
      return null;
    }
  }

  const createChat = async (payload: any) => {
    try {
      const res = await ChatModule.createChat(payload);
      if (res.data) {
        setOccurChat(true);
        const prevChats = status.chats;
        setStatus(s => ({ ...s, chats: [...prevChats, res.data], selectedChat: res.data.id, recipient: res.data.secondUser, chatCount: prevChats.length + 1, messages: [], messageCount: 0 }));
        setPageMessages(1);
      }
    } catch (error) {
      setStatus(s => ({ ...s }));
      setPageMessages(1);
    }
  }

  const fetchMessages = async (chatID?: string) => {
    try {
      //api get messages
      const res = await ChatModule.fetchMessages({ chatID: chatID ? chatID : status.selectedChat, limit: limitMessages, offset: isSent ? 0 : (activePageMessages - 1) * limitMessages, sort: '-createdAt' });
      if (res.data?.messages.length === 0 && activePageMessages > 1) {
        return null;
      }

      let prevItems = status.messages;
      if (isSent) prevItems = [];

      setStatus(s => ({ ...s, messages: [...prevItems, ...res.data.messages], messageCount: res.data.count }));
    } catch (error) {
      setStatus(s => ({ ...s, messages: [], messageCount: 0 }));
    }
  }

  const initialize = async () => {
    try {
      if (blockchain.wallet && !occurCreateChat) {
        let recipient = '';
        if (blockchain.wallet === status.chats[0].firstUser) recipient = status.chats[0].secondUser;
        else recipient = status.chats[0].firstUser;
        setStatus(s => ({ ...s, recipient }));
      } else {
        setOccurChat(false);
      }
    } catch (error) {

    }
  }

  const fetchChatsOfUser = async (chatID?: string) => {
    try {
      if (!blockchain.wallet) return;
      //api get messages
      const limit = chatID ? limitChats * activePageChats : limitChats;
      const offset = chatID ? 0 : (activePageChats - 1) * limitChats;

      const res = await ChatModule.getListOfChats({ user: blockchain.wallet, limit, offset });
      if (res.data?.chats.length === 0) {
        return null;
      }

      // console.log("chats: ", res)

      const prevItems = chatID ? [] : status.chats;
      setStatus(s => ({ ...s, chats: [...prevItems, ...res.data.chats] || [], selectedChat: chatID ? chatID : res.data.chats[0].id, chatCount: res.data.count }));
    } catch (error) {
      setStatus(s => ({ ...s, chats: [], chatCount: 0 }));
    }
  }

  const sendMessages = async (input: string) => {
    try {
      const payload = { content: input, chatID: status.selectedChat, senderID: blockchain.wallet };
      const res = await ChatModule.sendMessage(payload);
      const count = status.messages.length;

      if (res.data) {
        setOccurChat(true);
        setStatus(s => ({ ...s, messages: [res.data, ...status.messages], messageCount: count + 1 }));
        setIsSent(true);
      }

    } catch (error) {
      setStatus(s => ({ ...s, messages: [] }));
    }
  }

  const setActivePageMessages = () => {
    setPageMessages(s => s + 1);
  }

  const setActivePageChats = () => {
    setPageChats(s => s + 1);
  }

  useEffect(() => {
    if (!blockchain.wallet) return;
    socket = io(ENDPOINT, {
      query: {
        wallet: blockchain.wallet
      }
    });
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
  }, [blockchain.wallet]);

  useEffect(() => {
    fetchChatsOfUser();
  }, [blockchain.wallet, activePageChats])

  useEffect(() => {
    fetchMessages();
  }, [status.selectedChat, status.recipient, activePageMessages]);

  useEffect(() => {
    if (isSent) {
      fetchMessages();
      setIsSent(false);
    }
  }, [isSent])

  useEffect(() => {
    if (occurCreateChat) {
      fetchChatsOfUser(status.selectedChat);
    }
  }, [occurCreateChat])

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (newMessage: Message) => {
      if (newMessage.chatID === status.selectedChat) {
        setOccurChat(true);
        setStatus(s => ({ ...s, messages: [newMessage, ...status.messages] }));
      }
    });

    return () => {
      socket.off('newMessage');
    };
  });

  useEffect(() => {
    initialize();
  }, [blockchain.wallet, status.chats])

  const context: ChatPropsContext = {
    ...status,
    sendMessages,
    checkIfAvailableChat,
    createChat,
    handleChangeChat: handleChangeChat,
    setActivePageMessages: setActivePageMessages,
    setActivePageChats: setActivePageChats
  }

  return <ChatContext.Provider
    value={context}
  >
    {props.children}
  </ChatContext.Provider>
}

export const useChatContext = () => useContext(ChatContext);