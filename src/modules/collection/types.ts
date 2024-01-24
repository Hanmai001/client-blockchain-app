import { ChainId } from "@/share/blockchain/types";
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

export interface Collection {
  collectionID: string,
  _id: string,
  creator: string,
  chainID: ChainId,
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
  creator: string,
  chainID: ChainId,
  title: string,
  bannerURL: string | '',
  description: string,
  contractAddress: string,
  category: CollectionType,
  paymentType: AppPayment,
} 

export interface CollectionQuery extends Query {
  category?: string
}