import { ChainId } from "@/share/blockchain/types";
import { AppPayment } from "../../../types";

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
  collectionId: string,
  _id: string,
  creator: string,
  chainId: ChainId,
  title: string,
  description: string,
  bannerUrl: string,
  averagePrice: number,
  category: CollectionType,
  paymentType: AppPayment,
  contractAddress: string,
  active: boolean,
  disabled: boolean,
  totalViews: number,
  createdAt: number,
  updatedAt: number
}

export interface CollectionPayload {
  collectionId: string,
  creator: string,
  chainId: ChainId,
  title: string,
  description: string,
  contractAddress: string,
  category: CollectionType,
  paymentType: AppPayment,
} 