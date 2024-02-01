import { RequestModule } from "../request/request";

export class ChatModule {
  //chat with recipient (who)
  static async getSingleChat(recipient: string) {
    return RequestModule.get(``);
  }

  //authen
  static async getListOfChats() {
    return RequestModule.get(``);
  }

  static async sendMessage(payload: any): Promise<any> {
    return RequestModule.post(``, payload);
  }

  static async fetchMessages(chatID: string) {
    return RequestModule.get(``);
  }
}