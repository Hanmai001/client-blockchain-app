import { ChainId } from "@/share/blockchain/types";

export type ObjectID = string;

export enum AppEnv {
  PRODUCTION = 'PRODUCTION',
}

export enum AppPayment {
  ETH = '0',
  // USDM = '1',
  // USDT = '2',
  BCT = '3',
}

export interface Query {
  chainID?: ChainId
  offset?: number
  limit?: number,
  sort?: any,
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
}

export interface ListLoadState<T = any, K extends string = string> {
  isFetching?: boolean
  data?: {
    [key in K]: T[];
  } & {
    count?: number;
  };
  error?: Error
  isInitialized?: boolean
}
