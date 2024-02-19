import { RequestModule } from "../request/request";
import { ChatQuery, MessageQuery } from "./types";

export class ChatModule {
  //chat with recipient (who)
  static async getSingleChat(chatID: string) {
    return RequestModule.get(`/api/v1/chats/${chatID}`);
  }

  static async checkAvailableChat(recipient: string) {
    return RequestModule.get(`/api/v1/chats/recipient/${recipient}`);
  }

  static async createChat(payload: any): Promise<any> {
    return RequestModule.post(`/api/v1/chats`, payload);
  }

  //authen
  static async getListOfChats(query?: ChatQuery) {
    return RequestModule.get(`/api/v1/chats`, query);
  }

  static async sendMessage(payload: any): Promise<any> {
    return RequestModule.post(`/api/v1/messages`, payload);
  }

  static async fetchMessages(query?: MessageQuery) {
    return RequestModule.get(`/api/v1/messages`, query);
  }
}