import { Query } from "../../../types"


export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export interface UserInformation {
  id: string,
  wallet?: string,
  username?: string,
  avatar?: string,
  cover?: string,
  createdAt: number,
  roles: Roles[]
}

export interface UserSignInResponse {
  message?: string,
  data: UserInformation,
  auth_token: string
}

export interface UserSignInPayload {
  wallet: string,
  signature: string,
}

export interface UserUpdatePayload {
  username?: string,
  avatar?: string,
  cover?: string
}

export interface UserQuery extends Query {
  
}