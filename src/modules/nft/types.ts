import { ItemMode, Query } from "../../../types"

export enum FilterOptions {
  ALL = 'Tất cả',
  PRICE_TO_LOW = 'Giá từ cao đến thấp',
  PRICE_TO_HIGH = "Giá từ thấp đến cao",
  MOST_VIEWS = 'Xem nhiều nhất',
  MOST_LIKES = 'Được thích nhiều nhất',
  MOST_SHARES = 'Được chia sẻ nhiều nhất',
  NEWEST = 'Mới nhất',
  OLDEST = 'Cũ nhất'
}

export interface Nft {
  tokenID: string,
  id: string,
  creator: string,
  collectionID: string,
  avatar: string,
  mode: ItemMode,
  contractAddress: string,
  owner: string,
  chainID: string,
  title: string,
  description: string
  source: string,
  listOfLikedUsers: any[],
  listOfFavoriteUsers: any[],
  totalViews: number,
  totalShares: number,
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}

export interface NftPayload {
  creator: string,
  owner: string,
  chainID: string,
  mode: ItemMode | number,
  collectionID: string,
  title: string,
  description: string
}

export interface NftUpdatePayload {
  tokenID: string,
  contractAddress: string,
  chainID: string,
  collectionID: string,
  source: string,
  title: string,
  active: boolean,
  description: string
}

export enum NftStatus {
  ALL = 'Tất cả',
  ISLISTING = 'Đang bán',
  SOLD = 'Đã bán',
  // UNLISTING = 'Không bán',
  OLDEST = 'Cũ nhất',
  NEWEST = 'Mới nhất'
}

export interface NftQuery extends Query {
  collectionID?: string,
  creator?: string,
  owner?: string,
  active?: boolean | null
}