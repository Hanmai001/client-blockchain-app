import { ItemMode, ListLoadState } from "../../../types";
import { CoinsModule } from "../coins/modules";
import { getContracts } from "../configs/context";
import { RequestModule } from "../request/request";
import { Collection, CollectionPayload, CollectionQuery, CollectionUpdatePackagePayload, CollectionUpdatePayload, PackageType } from "./types";

export class CollectionModule {
  static async create(payload: CollectionPayload): Promise<any> {
    return RequestModule.post(`/api/v1/collections`, payload);
  }

  static async mintCollection(payload: CollectionPayload) {
    const contractMarket = getContracts().ercs.MARKETPLACE;
    const feeMint = await contractMarket.call({ method: 'getFeeMint' })
    const res = await CollectionModule.create(payload);

    // console.log(res)

    let txReceipt = await contractMarket.send({
      method: 'createCollection',
      args: [payload.creatorCollection, res.data.collectionURI]
    });

    const payloadUpdate = { ...payload, collectionID: txReceipt.logs[0].args['0'].toString(), contractAddress: getContracts().erc721s.BLOCKCLIP_NFT.address };
    await this.updateAfterMint(res.data.collection.id, payloadUpdate);
    await CoinsModule.fetchUserBalance();
  }

  static async getList(query?: CollectionQuery): Promise<ListLoadState<Collection, 'collections'>> {
    return RequestModule.get(`/api/v1/collections`, query);
  }

  static async getCollectionByID(id: string): Promise<any> {
    return RequestModule.get(`/api/v1/collections/${id}`);
  }

  static async getCollecionsOfUser(wallet: string, query?: CollectionQuery): Promise<ListLoadState<Collection>> {
    return RequestModule.get(`/api/v1/collections/user/${wallet}`, query);
  }

   static async updateAfterMint(id: string, payload: any) {
    return RequestModule.put(`/api/v1/collections/${id}`, payload);
  }

  static async updateCollection(payload: CollectionUpdatePayload, checkMetadataChanged: boolean): Promise<Collection> {
     const res = await RequestModule.put(`/api/v1/collections/collectionID/${payload.collectionID}`, payload);

    if (checkMetadataChanged) {
      const contractMarket = getContracts().ercs.MARKETPLACE;
      let txReceipt = await contractMarket.send({
        method: 'updateBaseCollectionURI',
        args: [res.data.collectionURI, payload.collectionID],
      });
    }
    return res.data.collection;
  }

  static async updatePackage(id: string, payload: CollectionUpdatePackagePayload): Promise<Collection> {
    return RequestModule.put(`/api/v1/collections/collectionID/${id}`, payload);
  }

  static async increaseTotalViews(id: string): Promise<any> {
    return RequestModule.patch(`/api/v1/collections/${id}/view`);
  }

  static getModeName(mode: string | number): string {
    if (mode === ItemMode.PUBLIC) return "Công khai";
    if (mode === ItemMode.COMMERCIAL) return "Thương mại";

    return "";
  }

  static getPackageName(packageType: number | string): string {
    if (packageType === PackageType.A_YEAR) return "12 tháng";
    if (packageType === PackageType.DAYS_30) return "30 ngày";
    if (packageType === PackageType.DAYS_90) return "90 ngày";
    return ""
  }
}