import { ChainId } from "@/share/blockchain/types";
import { AppPayment } from "../../../types";

export interface Collection {
  tokenId: string,
  _id: string,
  creator: string,
  chainId: ChainId,
  title: string,
  description: string,
  bannerUrl: string,
  totalViews: number,
  averagePrice: number,
  paymentType: AppPayment,
  createdAt: number,
  updatedAt: number
}