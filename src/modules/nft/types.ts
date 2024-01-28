import { AppPayment, Query } from "../../../types"

export enum FilterOptions {
  ALL = 'Tất cả',
  PRICE_TO_LOW = 'Giá từ thấp đến cao',
  PRICE_TO_HIGH = "Giá từ cao đến thấp",
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
  tokenUri: string,
  collectionID: string,
  contractAddress: string,
  owner: string,
  chainID: string,
  title: string,
  description: string
  source: string,
  listOfLikedUsers: any[],
  listOfFavoriteUsers: any[],
  totalViews: number,
  totalShare: number,
  acive: boolean,
  disabled: boolean,
  createdAt: Date,
  updatedAt: Date
}

export interface NftPayload {
  creator: string,
  owner: string,
  chainID: string,
  collectionID: string,
  title: string,
  description: string
}

export enum NftStatus {
  ALL = 'Tất cả',
  ISLISTING = 'Đang bán',
  SOLD = 'Đã bán',
  UNLISTING = 'Không bán',
  NEREST_RECIEVE = 'Nhận gần đây',
  OLDEST = 'Cũ nhất',
  NEWEST = 'Mới nhất'
}

export interface NftQuery extends Query {
  collectionID?: string,
  creator?: string,
  owner?: string
}