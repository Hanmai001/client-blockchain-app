import { Query } from "../../../types"

export enum ReportStatus {
    ISPENDING = 0,
    VIOLATED = 1,
    NORMAL = 2
}

export interface ReportEntity {
  id: string,
  from: string, //wallet user,
  tokenId: string,
  owner: string,
  description: string,
  status: ReportStatus,
  createdAt: Date,
  updatedAt: Date,
}

export interface ReportEntityPayload {
  from: string, //wallet user,
  tokenId: string,
  owner: string,
  description: string,
  status: ReportStatus,
}

export interface ReportQuery extends Query {
}