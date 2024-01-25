import { RequestModule } from "../request/request";
import { NftPayload } from "./types";

export class NftModule {
  static async create(payload: NftPayload): Promise<any> {
    return RequestModule.post(`/api/v1/tokens`, payload);
  }

  static async update(id: string, payload: any): Promise<any> {
    return RequestModule.put(`/api/v1/tokens/${id}`, payload);
  }
}