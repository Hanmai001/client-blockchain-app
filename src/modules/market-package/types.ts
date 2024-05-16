import { AppPayment, Query } from "../../../types";

export enum PackageType {
  DAYS_30 = 1,
  DAYS_90 = 2,
  A_YEAR = 3
}

export enum MarketPackageStatus {
  SUBSCRIBED = 1,
  EXPIRED = 2
}

export interface MarketPackage {
  id: string,
  chainID: string,
  collectionID?: string,
  paymentType: AppPayment,
  packageType: PackageType,
  status: MarketPackageStatus,
  price: number,
  seller: string,
  subscriber: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface MarketPackagePayload {
  chainID: string,
  collectionID?: string,
  paymentType: AppPayment,
  packageType: PackageType,
  status: MarketPackageStatus,
  price: number,
  seller: string,
  subscriber: string
}

export interface MarketPackageQuery extends Query {
  id?: string,
  collectionID?: string
}