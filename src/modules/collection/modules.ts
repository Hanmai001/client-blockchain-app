import { ListLoadState } from "../../../types";
import { RequestModule } from "../request/request";
import { TokenModule } from "../token/modules";
import { Collection, CollectionPayload, CollectionQuery, CollectionUpdatePayload } from "./types";

export class CollectionModule {
  static async create(payload: CollectionPayload): Promise<any> {
    return RequestModule.post(`/api/v1/collections`, payload)
  }

  static async getList(query?: CollectionQuery): Promise<ListLoadState<Collection>> {
    return RequestModule.get(`/api/v1/collections`, query);
  }

  static async update(id: string, payload: any) {
    return RequestModule.put(`/api/v1/collections/${id}`, payload);
  }

  static async getCollectionByID(id: string): Promise<any> {
    return RequestModule.get(`/api/v1/collections/${id}`);
  }

  static async getCollecionsOfUser(wallet: string, query?: CollectionQuery): Promise<ListLoadState<Collection>> {
    return RequestModule.get(`/api/v1/collections`, {creator: wallet});
  }

  static async updateCollection(payload: CollectionUpdatePayload): Promise<any> {
     const res =  await this.update(payload.collectionID, payload);

    const contract = TokenModule.getContractERC721(payload.contractAddress);

    let txReceipt = await contract.send({
      method: 'updateBaseCollectionURI',
      args: [res.data.tokenURI, payload.collectionID],
    });
  }
}