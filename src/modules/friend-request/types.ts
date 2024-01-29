export enum FriendRequestStatus {
    ISPENDING = 'Đang chờ',
    ISFRIEND = 'Bạn bè',
    CANCELLED = 'Đã hủy kết bạn'
}

export interface FriendRequest {
  id: string,
  chainId: string,
  from: string //wallet user,
  to: string //wallet user,
  status: FriendRequest,
  createdAt: Date,
  updatedAt: Date,
}