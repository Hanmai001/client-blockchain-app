import { AppPayment, Query } from "../../../types";

export enum CollectionType {
  ALL = 'Tất cả',
  TOURISM = 'Du lịch',
  GAME = 'Trò chơi',
  LIFE = 'Đời sống',
  EDUCATION = 'Giáo dục',
  FAMILY = 'Gia đình',
  FILM = 'Phim ảnh',
  COOK = 'Nấu ăn'
}

export enum CollectionStatus {
  ALL = 'Tất cả',
  OLDEST = 'Cũ nhất',
  NEWEST = 'Mới nhất',
  MOST_AVGPRICE = 'Tỷ lệ giá trung bình cao nhất',
  MOST_VIEWS = 'Được xem nhiều nhất'
}

export interface Collection {
  collectionID: string,
  id: string,
  creatorCollection: string,
  chainID: string,
  title: string,
  description: string,
  bannerURL: string,
  averagePrice: number,
  category: CollectionType,
  paymentType: AppPayment,
  contractAddress: string,
  active: boolean,
  disabled: boolean,
  totalViews: number,
  createdAt: any,
  updatedAt: any
}

export interface CollectionPayload {
  creatorCollection: string,
  chainID: string,
  title: string,
  bannerURL: string | '',
  description: string,
  contractAddress: string,
  category: CollectionType,
  paymentType: AppPayment,
} 

export interface CollectionUpdatePayload {
  collectionID: string,
  chainID: string,
  title: string,
  bannerURL: string,
  description: string,
  contractAddress: string,
  category: CollectionType,
  active: boolean,
} 

export interface CollectionQuery extends Query {
  category?: string,
  creator?: string,
  active?: boolean | null
}