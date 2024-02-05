import { Query } from "../../../types"

export enum FriendRequestStatus {
    ISPENDING = 0,
    ISFRIEND = 1,
    CANCELLED = 2
}

export interface FriendRequest {
  id: string,
  chainID: string,
  from: string //wallet user,
  to: string //wallet user,
  status: FriendRequestStatus,
  createdAt: Date,
  updatedAt: Date,
}

export interface FriendPayloadRequest {
  chainID: string,
  from: string //wallet user,
  to: string //wallet user,
  status: FriendRequestStatus,
}

export interface FriendQuery extends Query {
  to?: string,
  status?: FriendRequestStatus
}

