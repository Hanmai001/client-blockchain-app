import { getWallet } from "@/share/blockchain/context";
import { ethers } from "ethers";
import { AppPayment, ListLoadState } from "../../../types";
import { CoinsModule } from "../coins/modules";
import { getPaymentContract } from "../coins/utils";
import { getContracts } from "../configs/context";
import { Nft } from "../nft/types";
import { RequestModule } from "../request/request";
import { TokenModule } from "../token/modules";
import { MarketOrder, MarketOrderPayload, MarketOrderQuery, MarketStatus, TransactionEvent } from "./types";

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

  static async getNearToExpireOrder(orderId: string) {
    return RequestModule.get(`/api/v1/orders/near-to-expire/${orderId}`)
  }

  //Update: check coi seller có đúng là owner của tokenID không?
  static async checkTokenIsListed(id: string, query: MarketOrderQuery): Promise<any> {
    const checkListed = (await RequestModule.get(`/api/v1/orders/${id}/isListed`, query)).data.isListed;
    return checkListed;
  }
 
  static async update(id: string, payload: any) {
    return RequestModule.put(`/api/v1/orders/${id}`, payload);
  }

  static async purchaseItem(order: MarketOrder, payload: {event: TransactionEvent | string, price: any, collectionID: string}) {
    const balances = await CoinsModule.fetchUserBalance();
    const price = payload.event === TransactionEvent.WITHOUT_BENEFITS ? order.price : payload?.price;

    if (price > balances[order.paymentType]) throw new Error("Số dư ví không đủ");
    
    const contractMarket = getContracts().ercs.MARKETPLACE;
    let txReceipt;

    if (order.paymentType !== AppPayment.BCT) {
      console.log("buy by ETH", order.tokenID)
      txReceipt = await contractMarket.send({
        method: 'buyNftByETH',
        args: [order.tokenID, payload.collectionID],
        params: {
          value: ethers.parseEther(order.price.toString()).toString()
        }
      });
    } else {
      //Approve for Operator to use Amount of tokens of user
      await getPaymentContract(order.paymentType)?.approve({
        operator: contractMarket.address,
        amount: order.price
      });

      txReceipt = await contractMarket.send({
        method: 'buyNftbyErc20',
        args: [order.tokenID, getContracts().erc20s.BCT.address, payload.collectionID],
        params: {
          value: ethers.parseEther(order.price.toString()).toString()
        }
      });
    }

    const payloadUpdate = { 
      event: payload.event, 
      price, status: MarketStatus.SOLD, 
      buyer: getWallet(), 
      collectionID: payload.collectionID 
    };
    const res = await this.update(order!.id, payloadUpdate);
    // console.log("res upadte: ", res)
    if (res) {
      txReceipt = await contractMarket.send({
        method: 'updateBaseNftURI',
        args: [res.data.tokenURI, order.tokenID],
      });
    }

    //force update balances
    await CoinsModule.fetchUserBalance();
  }

  static async getTokensStatus(query: MarketOrderQuery): Promise<ListLoadState<Nft, 'tokens'>> {
    return RequestModule.get(`/api/v1/orders/tokens`, query);
  }

  static async getListOrdersOfUser(wallet: string): Promise<ListLoadState<MarketOrder, 'orders'>> {
    return RequestModule.get(`/api/v1/orders/${wallet}`);
  }

  static getMarketStatus(status: MarketStatus) {
    if (status === MarketStatus.SOLD) return "Đã bán";
    if (status === MarketStatus.ISLISTING) return "Đang bán";
    if (status === MarketStatus.CANCELLED) return "Đã hủy";
  }

  static getMarketEvent(status: TransactionEvent | string) {
    if (status === TransactionEvent.WITHOUT_BENEFITS.toString()) return "Mua (Không bao gồm lượt View, Like, Share)";
    if (status === TransactionEvent.FULL_BENEFITS.toString()) return "Mua cùng lượt View, Like, Share";
    return ""
  }

  static getPercentageListToken(views: number): number {
    let percentage = (views / 1000) * 0.1;
    if (percentage > 20) {
        percentage = 20;
    }
    
    return percentage;
  }
}