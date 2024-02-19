import { getWallet } from "@/share/blockchain/context";
import { ethers } from "ethers";
import { AppPayment, ListLoadState } from "../../../types";
import { CoinsModule } from "../coins/modules";
import { getPaymentContract } from "../coins/utils";
import { getContracts } from "../configs/context";
import { RequestModule } from "../request/request";
import { TokenModule } from "../token/modules";
import { MarketOrder, MarketOrderPayload, MarketOrderQuery, MarketStatus, TransactionEvent } from "./types";
import { Nft } from "../nft/types";

export class MarketOrderModule {
  static async create(payload: MarketOrderPayload) {
    const contractMarket = getContracts().ercs.MARKETPLACE;

    const contract = TokenModule.getContractERC721(payload.tokenAddress);
    await contract.approve({
      operator: contractMarket.address,
      tokenId: payload.tokenID
    });
    return RequestModule.post(`/api/v1/orders`, payload);
  }

  static async getListOrders(query?: MarketOrderQuery) {
    return RequestModule.get(`/api/v1/orders`, query);
  }

  static async checkTokenIsListed(id: string, query: MarketOrderQuery): Promise<ListLoadState<MarketOrder, 'order'>> {
    const checkListed = (await RequestModule.get(`/api/v1/orders/${id}/isListed`, query)).data.isListed;
    return checkListed;
  }
 
  static async update(id: string, payload: any) {
    return RequestModule.put(`/api/v1/orders/${id}`, payload);
  }

  static async purchaseItem(order: MarketOrder) {
    const balances = await CoinsModule.fetchUserBalance();

    if (order.price > balances[order.paymentType]) throw new Error("Số dư ví không đủ");
    
    const contractMarket = getContracts().ercs.MARKETPLACE;
    let txReceipt;
    
    if (order.paymentType !== AppPayment.BCT) {
      console.log("buy by ETH")
      txReceipt = await contractMarket.send({
        method: 'buyNftbyETH',
        args: [order.tokenID],
        params: {
          value: ethers.parseEther(order.price.toString()).toString()
        }
      });
    } else {
      console.log("buy by erc20 token")
      await getPaymentContract(order.paymentType)?.approve({
        operator: contractMarket.address,
        amount: order.price
      });

      txReceipt = await contractMarket.send({
        method: 'buyNftbyErc20',
        args: [order.tokenID, getContracts().erc20s.BCT.address],
        params: {
          value: ethers.parseEther(order.price.toString()).toString()
        }
      });
    }

    const payloadUpdate = { status: MarketStatus.SOLD, buyer: getWallet() };
    await this.update(order!.id, payloadUpdate);

    //force update
    await CoinsModule.fetchUserBalance();
  }

  static async getTokensStatus(query: MarketOrderQuery): Promise<ListLoadState<Nft, 'tokens'>> {
    return RequestModule.get(`/api/v1/orders/tokens`, query);
  }

  static getMarketStatus(status: MarketStatus) {
    if (status === MarketStatus.SOLD) return "Đã bán";
    if (status === MarketStatus.ISLISTING) return "Đang bán";
    if (status === MarketStatus.CANCELLED) return "Đã hủy";
  }

  static getMarketEvent(status: TransactionEvent) {
    if (status === TransactionEvent.TRANSFER) return "Mua bán";
  }
}