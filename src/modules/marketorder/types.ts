import { AppPayment, Query } from "../../../types";

export enum MarketStatus {
    SOLD = 0,
    ISLISTING = 1,
    CANCELLED = 2
}

export enum TransactionEvent {
  TRANSFER = 1
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
  createdAt: Date,
  updatedAt: Date,
}

export interface MarketOrderPayload {
  event: TransactionEvent,
  chainID: string,
  tokenID: string,
  tokenAddress: string,
  paymentType: AppPayment,
  price: number,
  seller: string,
  status: MarketStatus
}

export interface MarketOrderQuery extends Query {
  tokenID?: string,
  status?: MarketStatus,
  event?: TransactionEvent,
  sort?: string,
  active?: boolean | null
}