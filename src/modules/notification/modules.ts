import { RequestModule } from "../request/request";
import { NotificationPayload, NotificationQuery } from "./types";

export class NotificationModule {
  static async getListNotifications(query?: NotificationQuery): Promise<any> {
    return RequestModule.get(`/api/v1/notifications`, query);
  }

  static async addNotification(payload: NotificationPayload) {
    return RequestModule.post(`/api/v1/notifications`, payload);
  }
}