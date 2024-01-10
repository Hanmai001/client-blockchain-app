

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export interface UserInformation {
  _id: string,
  wallet?: string,
  username?: string,
  avatar?: string,
  cover?: string,
  createdAt: number,
  roles: Roles[]
}

export interface UserSignInResponse {
  user: UserInformation,
  accessToken: string
}

export interface UserSignInPayload {
  address: string,
  signature: string,
}

export interface UserUpdatePayload {
  username?: string,
  avatar?: string,
  cover?: string
}
