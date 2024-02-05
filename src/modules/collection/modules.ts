import { ListLoadState } from "../../../types";
import { getContracts } from "../configs/context";
import { RequestModule } from "../request/request";
import { TokenModule } from "../token/modules";
import { Collection, CollectionPayload, CollectionQuery, CollectionUpdatePayload } from "./types";

export class CollectionModule {
  static async create(payload: CollectionPayload): Promise<any> {
    return RequestModule.post(`/api/v1/collections`, payload)
  }

  static async getList(query?: CollectionQuery): Promise<ListLoadState<Collection, 'collections'>> {
    return RequestModule.get(`/api/v1/collections`, query);
  }

  static async updateAfterMint(id: string, payload: any) {
    return RequestModule.put(`/api/v1/collections/${id}`, payload);
  }

  static async getCollectionByID(id: string): Promise<any> {
    return RequestModule.get(`/api/v1/collections/${id}`);
  }

  static async getCollecionsOfUser(wallet: string, query?: CollectionQuery): Promise<ListLoadState<Collection>> {
    return RequestModule.get(`/api/v1/collections/user/${wallet}`, query);
  }

  static async mintCollection(payload: CollectionPayload) {
    const contractMarket = getContracts().ercs.MARKETPLACE;
    const feeMint = await contractMarket.call({ method: 'getFeeMint' })
    const res = await CollectionModule.create(payload);

    console.log(res)

    let txReceipt = await contractMarket.send({
      method: 'mintCollection',
      args: [payload.creatorCollection, res.data.collectionURI],
      params: {
        value: feeMint
      }
    });

    const payloadUpdate = { ...payload, collectionID: txReceipt.logs[0].args['0'].toString() };
    await this.updateAfterMint(res.data.collection.id, payloadUpdate);
  }

  static async updateCollection(payload: CollectionUpdatePayload, checkMetadataChanged: boolean): Promise<Collection> {
     const res = await RequestModule.put(`/api/v1/collections/collectionID/${payload.collectionID}`, payload);

    if (checkMetadataChanged) {
      const contract = TokenModule.getContractERC721(payload.contractAddress);

      let txReceipt = await contract.send({
        method: 'updateBaseCollectionURI',
        args: [res.data.collectionURI, payload.collectionID],
      });
    }
    return res.data.collection;
  }

  static async increaseTotalViews(id: string): Promise<any> {
    return RequestModule.patch(`/api/v1/collections/${id}/view`);
  }
}