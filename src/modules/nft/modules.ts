import { error } from "console";
import { ListLoadState } from "../../../types";
import { getWallet } from "../account/context";
import { RequestModule } from "../request/request";
import { TokenModule } from "../token/modules";
import { Nft, NftPayload, NftQuery, NftUpdatePayload } from "./types";
import { MarketOrderModule } from "../marketorder/modules";

export class NftModule {
  static async getList(query?: NftQuery): Promise<ListLoadState<Nft, 'tokens'>> {
    return RequestModule.get(`/api/v1/tokens`, query);
  }

  static async create(payload: NftPayload): Promise<any> {
    return RequestModule.post(`/api/v1/tokens`, payload);
  }

  static async update(id: string, payload: any): Promise<any> {
    return RequestModule.put(`/api/v1/tokens/${id}`, payload);
  }

  static async getNftByID(id: string): Promise<any> {
    return RequestModule.get(`/api/v1/tokens/${id}`);
  }

  static async getNftsByCollectionID(id: string): Promise<any> {
    return RequestModule.get(`/api/v1/tokens/${id}`);
  }

  static async getAllNftsOfUser(wallet: string, query?: NftQuery): Promise<ListLoadState<Nft, 'tokens'>> {
    return RequestModule.get(`/api/v1/tokens/user/${wallet}`, query);
  }

  static async getFavouritedNftsOfUser(query?: NftQuery): Promise<ListLoadState<Nft, 'tokens'>> {
    return RequestModule.get(`/api/v1/tokens/favorite`, query)
  }

  static async updateLikeNft(id: string) {
    return RequestModule.patch(`/api/v1/tokens/${id}/like`);
  }

  static async checkIsLikeNft(id: string) {
    const res = await RequestModule.get(`/api/v1/tokens/${id}/isLiked`);
    return res.data.isLiked;
  }

  static async updateFavouriteNft(id: string) {
    return RequestModule.patch(`/api/v1/tokens/${id}/favorite`);
  }

  static async checkIsFavouriteNft(id: string) {
    const res = await RequestModule.get(`/api/v1/tokens/${id}/isFavorited`)
    return res.data.isFavorited;
  }

  static async increaseTotalViews(id: string): Promise<any> {
    return RequestModule.patch(`/api/v1/tokens/${id}/view`);
  }

  static async updateToken(payload: NftUpdatePayload): Promise<any> {
     const res =  await NftModule.update(payload.tokenID, payload);

    const contract = TokenModule.getContractERC721(payload.contractAddress);

    let txReceipt = await contract.send({
      method: 'updateBaseNftURI',
      args: [res.data.tokenURI, payload.tokenID],
    });
  }
}