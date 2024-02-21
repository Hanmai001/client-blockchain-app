import { AppPayment, Query } from "../../../types";

export enum MarketStatus {
  SOLD = 0,
  ISLISTING = 1,
  CANCELLED = 2,
  ISRENTING = 3
}

export enum TransactionEvent {
  TRANSFER = 1,
  EXPIRY = 2
}

export enum UsageRight {
  WATCH = 1,
  DOWNLOAD = 2
}

export interface MarketOrder {
  id: string,
  event: TransactionEvent,
  chainID: string,
  tokenID: string,
  tokenAddress: string,
  paymentType: AppPayment,
  price: number,
  seller: string,
  buyer: string,
  status: MarketStatus,
  startAt?: Date,
  endAt?: Date, 
  limitUsers?: number,
  usageRight?: UsageRight,
  createdAt: Date,
  updatedAt: Date,
}

export interface MarketOrderPayload {
  event: TransactionEvent,
  chainID: string,
  tokenID: string,
  tokenAddress: string,
  paymentType: AppPayment,
  price: number | string,
  seller: string,
  status: MarketStatus,
  buyer?: string, //For Expiry
  startAt?: Date, //For Expiry
  endAt?: Date, //For Expiry
  limitUsers?: number | string, //For Expiry,
  usageRight?: UsageRight, //For Expiry,
}

export interface MarketOrderQuery extends Query {
  tokenID?: string,
  status?: MarketStatus,
  event?: TransactionEvent,
  sort?: string,
  active?: boolean | null
}