import { ListLoadState } from "../../../types";
import { RequestModule } from "../request/request";
import { FriendPayloadRequest, FriendQuery } from "./types";

export class FriendRequestModule {
  static async getListFriends(query?: FriendQuery): Promise<ListLoadState<FriendRequestModule, 'users '>> {
    return RequestModule.get(`/api/v1/friends/myFriends`, query);
  }

  static async create(payload: FriendPayloadRequest) {
    return RequestModule.post(`/api/v1/friends`, payload);
  }

  static async update(payload: any) {
    return RequestModule.patch(`/api/v1/friends`, payload);
  }

  static async getListFriendRequests(query: FriendQuery) {
    return RequestModule.get(`/api/v1/friends`, query);
  }
}