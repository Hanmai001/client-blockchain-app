import { useBlockChain } from "@/share/blockchain/context";
import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ChatPropsContext, ChatStatus, Message } from "./types";

export const ChatContext = createContext<any>({} as any);

const messagesTest = [
  {
    readBy: '',
    id: "1",
    sender: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    content: "Hello There",
    chatID: "1",
    createdAt: "2021-05-18T17:01:33.332Z",
    updatedAt: "2021-05-18T17:01:33.332Z",
  },
  {
    readBy: '',
    id: "2",
    sender: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
    content: "Yo Wassup!",
    chatID: "1",
    createdAt: "2021-05-18T17:08:14.447Z",
    updatedAt: "2021-05-18T17:08:14.447Z",
  },
  {
    readBy: '',
    id: "1",
    sender: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    content: "Hello There",
    chatID: "1",
    createdAt: "2021-05-18T17:01:33.332Z",
    updatedAt: "2021-05-18T17:01:33.332Z",
  },
  {
    readBy: '',
    id: "2",
    sender: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    content: "Yo Wassup!",
    chatID: "1",
    createdAt: "2021-05-18T17:08:14.447Z",
    updatedAt: "2021-05-18T17:08:14.447Z",
  },
  {
    readBy: '',
    id: "1",
    sender: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    content: "Hello There",
    chatID: "1",
    createdAt: "2021-05-18T17:01:33.332Z",
    updatedAt: "2021-05-18T17:01:33.332Z",
  },
  {
    readBy: '',
    id: "2",
    sender: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
    content: "Yo Wassup!",
    chatID: "1",
    createdAt: "2021-05-18T17:08:14.447Z",
    updatedAt: "2021-05-18T17:08:14.447Z",
  },
  {
    readBy: '',
    id: "1",
    sender: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    content: "Hello There",
    chatID: "1",
    createdAt: "2021-05-18T17:01:33.332Z",
    updatedAt: "2021-05-18T17:01:33.332Z",
  },
  {
    readBy: '',
    id: "2",
    sender: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    content: "Yo Wassup!",
    chatID: "1",
    createdAt: "2021-05-18T17:08:14.447Z",
    updatedAt: "2021-05-18T17:08:14.447Z",
  },
  {
    readBy: '',
    id: "1",
    sender: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    content: "Hello There",
    chatID: "1",
    createdAt: "2021-05-18T17:01:33.332Z",
    updatedAt: "2021-05-18T17:01:33.332Z",
  },
  {
    readBy: '',
    id: "2",
    sender: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
    content: "Yo Wassup!",
    chatID: "1",
    createdAt: "2021-05-18T17:08:14.447Z",
    updatedAt: "2021-05-18T17:08:14.447Z",
  },
  {
    readBy: '',
    id: "1",
    sender: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    content: "Hello There",
    chatID: "1",
    createdAt: "2021-05-18T17:01:33.332Z",
    updatedAt: "2021-05-18T17:01:33.332Z",
  },
  {
    readBy: '',
    id: "2",
    sender: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    content: "Yo Wassup!",
    chatID: "1",
    createdAt: "2021-05-18T17:08:14.447Z",
    updatedAt: "2021-05-18T17:08:14.447Z",
  },
];

const chatsTest = [
  {
    id: '0',
    firstUser: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    secondUser: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
    lastText: 'Helloooo',
  },
  {
    id: '1',
    firstUser: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
    secondUser: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
    lastText: 'Helloooo',
  },
];

//sever for chat
const ENDPOINT = "http://localhost:5000";
var socket: Socket;

export const ChatProvider: FC<PropsWithChildren> = (props) => {
  const [status, setStatus] = useState<ChatStatus>({ messages: [], selectedChat: '', recipient: '', chats: [] });
  const blockchain = useBlockChain();
  const [socketConnected, setSocketConnected] = useState(false);
  const [activePage, setPage] = useState(1);
  const limit = 20;

  const handleChangeChat = async (chatID: string, recipient: string) => {
    try {
      console.log(chatID, recipient)
      setStatus(s => ({ ...s, selectedChat: chatID, recipient, messages: messagesTest }))
    } catch (error) {
      throw error;
    }
  }

  const fetchMessages = async () => {
    try {
      //api get messages

      setStatus(s => ({ ...s, messages: messagesTest }));
      socket.emit('join chat', status.selectedChat);
    } catch (error) {
      throw error;
    }
  }

  const initialize = async () => {
    try {
      if (blockchain.wallet) {
        let recipient = '';
        if (blockchain.wallet === chatsTest[0].firstUser) recipient = chatsTest[0].secondUser;
        else recipient = chatsTest[0].firstUser;

        console.log("recipient: ", recipient)

        setStatus(s => ({ ...s, messages: messagesTest, chats: chatsTest, selectedChat: chatsTest[0].id, recipient }));
      }
    } catch (error) {

    }
  }

  const fetchChatsOfUser = async () => {
    try {
      if (!blockchain.wallet) return;
      //api get messages

      setStatus(s => ({ ...s, chats: chatsTest }));
    } catch (error) {
      throw error;
    }
  }

  const sendMessages = async (input: string) => {
    try {
      //api send message payload: {content, chatID}
      // const payload = { content: '', chatID: status.selectedChat };
      // const res = await ChatModule.sendMessage(payload);
      // socket.emit("new message", res.data);

      const res = {
        data: {
          readBy: '',
          id: "2",
          sender: '0xCf56d1C5b9f0ac7dCaE5399e5f82f29066d978bc',
          content: input,
          chatID: "1",
          createdAt: "2021-05-18T17:08:14.447Z",
          updatedAt: "2021-05-18T17:08:14.447Z",
        }
      }; //test
      console.log("send", input)
      setStatus(s => ({ ...s, messages: [res.data, ...status.messages] }));
    } catch (error) {
      throw error;
    }
  }

  const setActivePage = () => {
    setPage(activePage + 1);
  }

  useEffect(() => {
    if (blockchain.wallet) return;
    socket = io(ENDPOINT);
    //send event "setup" to sever
    socket.emit("setup", {
      chatID: status.selectedChat,
      recipient: status.recipient
    });

    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
  }, [status.selectedChat]);

  useEffect(() => {
    try {
      fetchMessages();
      console.log("fetch messages", status.selectedChat)
    } catch (error) {
      throw error;
    }
  }, [blockchain.wallet, activePage]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved: Message) => {
      if (newMessageRecieved.chatID === status.selectedChat)
        setStatus(s => ({ ...s, messages: [...status.messages, newMessageRecieved] }));
    });
  });

  useEffect(() => {
    initialize();
  }, [blockchain.wallet])

  const context: ChatPropsContext = {
    ...status,
    socketConnected,
    sendMessages,
    handleChangeChat: handleChangeChat,
    setActivePage
  }

  return <ChatContext.Provider
    value={context}
  >
    {props.children}
  </ChatContext.Provider>
}

export const useChatContext = () => useContext(ChatContext);