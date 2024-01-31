import { RequestModule } from "../request/request";
import { FriendPayloadRequest } from "./types";

export class FriendRequest {
  static async getFriendRequest(wallet: string) {
    return RequestModule.get(``);
  }

  static async create(payload: FriendPayloadRequest) {
    return RequestModule.post(``, payload);
  }

  static async update(payload: any) {
    return RequestModule.put(``, payload);
  }

  static async checkIsFriend(wallet: string) {
    return RequestModule.get(``)
  }
}