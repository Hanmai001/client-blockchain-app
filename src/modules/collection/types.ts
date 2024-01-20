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
  tokenId: string,
  _id: string,
  creator: string,
  chainId: ChainId,
  title: string,
  description: string,
  bannerUrl: string,
  totalViews: number,
  averagePrice: number,
  type: CollectionType,
  paymentType: AppPayment,
  contractAddress: string,
  active: boolean,
  disabled: boolean,
  createdAt: number,
  updatedAt: number
}

export interface CollectionPayload {
  creator: string,
  chainId: ChainId,
  title: string,
  description: string,
  bannerFile: File | null,
  contractAddress: string,
  type: CollectionType,
  paymentType: AppPayment | '',
}