import { useBlockChain } from "@/share/blockchain/context";
import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ChatModule } from "./modules";
import { ChatPropsContext, ChatStatus, Message } from "./types";

export const ChatContext = createContext<any>({} as any);

//sever for chat
const ENDPOINT = "http://localhost:5000";
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
      // console.log(chatID, status.recipient, recipient)
      // if(status.selectedChat !== chatID)
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

      console.log("status: ", status)
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
      } else setOccurChat(false);
    } catch (error) {

    }
  }

  const fetchChatsOfUser = async () => {
    try {
      if (!blockchain.wallet) return;
      //api get messages
      const res = await ChatModule.getListOfChats({ user: blockchain.wallet, limit: limitChats, offset: (activePageChats - 1) * limitChats });
      if (res.data?.chats.length === 0) {
        return null;
      }
      const prevItems = status.chats;
      setStatus(s => ({ ...s, chats: [...prevItems, ...res.data.chats] || [], selectedChat: res.data.chats[0].id || [], chatCount: res.data.count }));
    } catch (error) {
      setStatus(s => ({ ...s, chats: [], chatCount: 0 }));
    }
  }

  const sendMessages = async (input: string) => {
    try {
      const payload = { content: input, chatID: status.selectedChat, senderID: blockchain.wallet };
      const res = await ChatModule.sendMessage(payload);
      const count = status.messages.length;
      setStatus(s => ({ ...s, messages: [res.data, ...status.messages], messageCount: count + 1 }));
      setIsSent(true);
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
        wallet: status.recipient
      }
    });
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
  }, [status.recipient]);

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
    if (socket) {
      socket.on("newMessage", (newMessage: Message) => {
        console.log("new message: ", newMessage)
        if (newMessage.chatID === status.selectedChat) {
          console.log(status.selectedChat, newMessage.chatID)
          setStatus(s => ({ ...s, messages: [newMessage, ...status.messages] }));
        }
      });
    }
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