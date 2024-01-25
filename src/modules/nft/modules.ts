import { ListLoadState } from "../../../types";
import { RequestModule } from "../request/request";
import { Nft, NftPayload, NftQuery } from "./types";

export class NftModule {
  static async getList(query?: NftQuery): Promise<ListLoadState<Nft, 'nfts'>> {
    return RequestModule.get(`/api/v1/tokens`, query);
  }

  static async create(payload: NftPayload): Promise<any> {
    return RequestModule.post(`/api/v1/tokens`, payload);
  }

  static async update(id: string, payload: any): Promise<any> {
    return RequestModule.put(`/api/v1/tokens/${id}`, payload);
  }
}