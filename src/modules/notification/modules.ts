import { RequestModule } from "../request/request";
import { NotificationQuery } from "./types";

export class NotificationModule {
  static async getListNotifications(query?: NotificationQuery): Promise<any> {
    return RequestModule.get(``, query);
  }

  static async addNotification(payload: any) {
    return RequestModule.post(``, payload);
  }
}