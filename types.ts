import { ChainId } from "@/share/blockchain/types";

export type ObjectID = string;

export enum AppEnv {
  PRODUCTION = 'PRODUCTION',
}

export enum AppPayment {
  USDM = '0',
  USDT = '1',
  ETH = '3',
  BNB = '4',
  BCT = '5'
}

export interface Query {
  chainId?: ChainId
  offset?: number
  limit?: number
  q?: string
}

export type QuerySort = 1 | -1

export interface ListApiResponse<T> {
  count: number
  data: T[]
}

export enum Locale {
  ENGLISH = 'en_US',
  VIETNAMESE = 'vi_VN',
}

export type Error = { message: string; status: number } | string

export interface DataLoadState<T = any> {
  isFetching?: boolean
  data?: T
  error?: Error
  isInitialized?: boolean
  total?: number
}

export interface ListLoadState<T = any> {
  isFetching?: boolean
  data?: T[]
  error?: Error
  isInitialized?: boolean
  count?: number
}
