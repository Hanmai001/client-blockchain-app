export interface Comment {
  id: string;
  content: string;
  owner: any;
  tokenID: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentPayload {
  content: string;
  ownerWallet: string; //or wallet
  tokenID: string;
}