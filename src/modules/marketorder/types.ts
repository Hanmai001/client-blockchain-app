export enum MarketStatus {
    SOLD = 'Đã bán',
    ISLISTING = 'Đang bán',
    CANCELLED = 'Đã hủy'
}

export enum TransactionEvent {
  TRANSFER = 'Mua bán'
}

export interface MarketOrder {
  id: string,
  event: TransactionEvent,
  chainId: string,
  tokenId: string,
  paymentAddress: string,
  price: string,
  seller: string,
  buyer: string,
  status: MarketStatus,
  createdAt: Date,
  updatedAt: Date,
}

export interface MarketOrderPayload {
  event: TransactionEvent,
  chainId: string,
  tokenId: string,
  paymentAddress: string,
  price: string,
  seller: string,
  buyer: string,
  status: string
}
