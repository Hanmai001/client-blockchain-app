import { AppPayment } from "../../../types"

export enum FilterOptions {
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
  _id: string,
  creator: string,
  tokenUri: string,
  collectionID: string,
  contractAddress: string,
  owner: string,
  chainID: string,
  title: string,
  description: string
  source: string,
  totalViews: number,
  totalLikes: number,
  totalShare: number,
  acive: boolean,
  disabled: boolean,
  createdAt: number,
  updatedAt: number
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
  NEREST_RECIEVE = 'Nhận gần đây'
}