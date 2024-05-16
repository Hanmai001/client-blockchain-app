import { AppPayment, ItemMode, Query } from "../../../types";

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

export enum PackageType {
  DAYS_30 = 1,
  DAYS_90 = 2,
  A_YEAR = 3
}

export interface Collection {
  collectionID: string,
  contractAddress: string,
  totalSubscribers: number,
  id: string,
  creatorCollection: string,
  chainID: string,
  title: string,
  description: string,
  bannerURL: string,
  averagePrice: number,
  category: CollectionType,
  paymentType: AppPayment,
  active: boolean,
  disabled: boolean,
  totalViews: number,
  package: [
    {
      type:  PackageType,
      price: number
    },
     {
      type:  PackageType,
      price: number
    },
     {
      type:  PackageType,
      price: number
    }
  ],
  createdAt: any,
  updatedAt: any
}

export interface CollectionPayload {
  creatorCollection: string,
  chainID: string,
  title: string,
  bannerURL: string | '',
  description: string,
  category: CollectionType,
  paymentType: AppPayment,
  package?: [
    {
      type:  PackageType,
      price: number,
    },
      {
      type:  PackageType,
      price: number
    },
      {
      type:  PackageType,
      price: number
    }
  ],
} 

export interface CollectionUpdatePackagePayload {
  package?: [
    {
      type:  PackageType,
      price: number
    },
     {
      type:  PackageType,
      price: number
    },
     {
      type:  PackageType,
      price: number
    }
  ],
}

export interface CollectionUpdatePayload {
  collectionID: string,
  chainID: string,
  title?: string,
  bannerURL?: string,
  description?: string,
  category?: CollectionType,
  active?: boolean,
  package?: [
    {
      type:  PackageType,
      price: number
    },
     {
      type:  PackageType,
      price: number
    },
     {
      type:  PackageType,
      price: number
    }
  ],
} 

export interface CollectionQuery extends Query {
  category?: string,
  creator?: string,
  active?: boolean | null
}