import { ListLoadState } from "../../../types";
import { RequestModule } from "../request/request";
import { Collection, CollectionPayload, CollectionQuery } from "./types";

export class CollectionModule {
  static async create(payload: CollectionPayload): Promise<any> {
    return RequestModule.post(`/api/v1/collections`, payload)
  }

  static async getList(query?: CollectionQuery): Promise<ListLoadState<Collection>> {
    return RequestModule.get(`/api/v1/collections`, query);
  }

  static async updateAfterMint(id: string, payload: any) {
    return RequestModule.put(`/api/v1/collections/${id}`, payload);
  }

  static async getCollectionByID(id: string): Promise<any> {
    return RequestModule.get(`/api/v1/collections/${id}`);
  }
}