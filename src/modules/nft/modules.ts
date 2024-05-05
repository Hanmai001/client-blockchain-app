import { error } from "console";
import { ListLoadState } from "../../../types";
import { getWallet } from "../account/context";
import { RequestModule } from "../request/request";
import { TokenModule } from "../token/modules";
import { Nft, NftPayload, NftQuery, NftUpdatePayload } from "./types";
import { MarketOrderModule } from "../marketorder/modules";
import { getContracts } from "../configs/context";
import { CoinsModule } from "../coins/modules";

export class NftModule {
  static async getList(query?: NftQuery): Promise<ListLoadState<Nft, 'tokens'>> {
    return RequestModule.get(`/api/v1/tokens`, query);
  }

  static async getListNftsOfFriends(query?: NftQuery): Promise<ListLoadState<Nft, 'tokens'>> {
    // if (!getWallet()) throw Error("Wallet must be provided");

    return RequestModule.get(`/api/v1/friends/tokens`, query);
  }

  static async create(payload: NftPayload): Promise<any> {
    return RequestModule.post(`/api/v1/tokens`, payload);
  }

  static async mintNft(payload: NftPayload) {
    const contractMarket = getContracts().ercs.MARKETPLACE;
    const feeMint = await contractMarket.call({ method: 'getFeeMint' })
    const res = await NftModule.create(payload);

    let txReceipt = await contractMarket.send({
      method: 'mintNft',
      args: [payload.creator, res.data.tokenURI, payload.collectionID],
      params: {
        value: feeMint
      }
    });

    const payloadUpdate = { ...payload, tokenID: txReceipt.logs[2].args['0'].toString(), contractAddress: getContracts().erc721s.BLOCKCLIP_NFT.address };
    await NftModule.updateAfterMint(res.data.token.id, payloadUpdate);
    await CoinsModule.fetchUserBalance();
  }

  static async updateAfterMint(id: string, payload: any): Promise<any> {
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

  static async updateShareNft(id: string) {
    return RequestModule.patch(`/api/v1/tokens/${id}/share`);
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

  static async updateToken(payload: NftUpdatePayload | any, checkMetadataChanged: boolean): Promise<Nft> {
     const res = await RequestModule.put(`/api/v1/tokens/tokenID/${payload.tokenID}`, payload);

     if (checkMetadataChanged && res.data) {
       const contractMarket = getContracts().ercs.MARKETPLACE;
      let txReceipt = await contractMarket.send({
        method: 'updateBaseNftURI',
        args: [res.data.tokenURI, payload.tokenID],
      });
    }

    return res.data.token;
  }
}