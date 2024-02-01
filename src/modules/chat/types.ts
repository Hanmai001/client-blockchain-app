export interface ChatStatus {
  selectedChat: string,
  recipient: string,
  messages: any[],
  chats: any[]
}

export interface ChatPropsContext extends ChatStatus {
  socketConnected: boolean,
  handleChangeChat: HandleChangeChat,
  sendMessages: SendMessages,
  setActivePage: SetActivePage
}

export interface Chat {
  id: string,
  firstUser: string, 
  secondUser: string,
  lastText: string,
  updatedAt: Date,
  createdAt: Date
}

export interface Message {
  id: string,
  sender: string, //wallet user
  content: string,
  updatedAt: Date,
  createdAt: Date
  chatID: string,
  isRead: boolean
}

export type HandleChangeChat = (chatID: string, recipient: string) => Promise<any>;
export type SendMessages = (input: string) => Promise<any>;
export type SetActivePage = () => void;