import { Query } from "../../../types"

export interface ChatStatus {
  selectedChat: string,
  recipient: string,
  messages: any[],
  chats: any[],
  messageCount: number,
  chatCount: number,
}

export interface ChatPropsContext extends ChatStatus {
  handleChangeChat: HandleChangeChat,
  checkIfAvailableChat: CheckIfAvailableChat,
  createChat: CreatChat,
  sendMessages: SendMessages,
  setActivePageMessages: SetActivePage,
  setActivePageChats: SetActivePage
}

export interface Chat {
  id: string,
  firstUser: string, 
  secondUser: string,
  messages: Message[],
  updatedAt: Date,
  createdAt: Date
}

export interface Message {
  id: string,
  senderID: string, //wallet user
  content: string,
  updatedAt: Date,
  createdAt: Date
  chatID: string,
  isRead: boolean
}

export interface ChatQuery extends Query {
  user?: string
}

export interface MessageQuery extends Query {
  chatID?: string
}

export type HandleChangeChat = (chatID: string, recipient: string) => Promise<any>;
export type CheckIfAvailableChat = (recipient: string) => Promise<any>;
export type CreatChat = (payload: any) => Promise<any>;
export type SendMessages = (input: string) => Promise<any>;
export type SetActivePage = () => void;