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
  tokenId: string,
  _id: string,
  creator: string,
  tokenUri: string,
  collectionId: string,
  contractAddress: string,
  owner: string,
  chainId: string,
  title: string,
  description: string
  source: string,
  totalViews: number,
  totalLikes: number,
  totalShare: number,
  createdAt: number,
  updatedAt: number
}

export interface NftPayload {
  creator: string,
  owner: string,
  collection: {
    chainId: string,
    tokenId: string,
    paymentType: string
  } | null,
  title: string,
  description: string
  sourceFile: File | null
}

export enum NftStatus {
  ALL = 'Tất cả',
  ISLISTING = 'Đang bán',
  SOLD = 'Đã bán',
  UNLISTING = 'Không bán',
  NEREST_RECIEVE = 'Nhận gần đây'
}