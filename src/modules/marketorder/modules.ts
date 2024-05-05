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

    if (payload.event === TransactionEvent.TRANSFER) {
      const contract = TokenModule.getContractERC721(payload.tokenAddress);
      await contract.approve({
        operator: contractMarket.address,
        tokenId: payload.tokenID
      });
    }
    
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

  static async purchaseItem(order: MarketOrder, payload?: {startAt: Date, endAt: Date, price: any}) {
    const balances = await CoinsModule.fetchUserBalance();
    const price = order.event === TransactionEvent.TRANSFER ? order.price : payload?.price;

    if (price > balances[order.paymentType]) throw new Error("Số dư ví không đủ");
    
    const contractMarket = getContracts().ercs.MARKETPLACE;
    let txReceipt;

    //Buy NFT
    // if (order.event === TransactionEvent.TRANSFER) {
    //   //Handle buy bt ETH
    //   if (order.paymentType !== AppPayment.BCT) {
    //     console.log("buy by ETH", order.tokenID)
    //     txReceipt = await contractMarket.send({
    //       method: 'buyNftbyETH',
    //       args: [order.tokenID],
    //       params: {
    //         value: ethers.parseEther(order.price.toString()).toString()
    //       }
    //     });
    //   } else {
    //     //Approve for Operator to use Amount of tokens of user
    //     await getPaymentContract(order.paymentType)?.approve({
    //       operator: contractMarket.address,
    //       amount: order.price
    //     });

    //     txReceipt = await contractMarket.send({
    //       method: 'buyNftbyErc20',
    //       args: [order.tokenID, getContracts().erc20s.BCT.address],
    //       params: {
    //         value: ethers.parseEther(order.price.toString()).toString()
    //       }
    //     });
    //   }

    //   const payloadUpdate = { status: MarketStatus.SOLD, buyer: getWallet() };
    //   await this.update(order!.id, payloadUpdate);
    // } else {
    //   if (order.paymentType !== AppPayment.BCT) {
    //     console.log("Rent by ETH", order.tokenID)
    //     txReceipt = await contractMarket.send({
    //       method: 'rentNftbyETH',
    //       args: [order.tokenID],
    //       params: {
    //         value: ethers.parseEther(order.price.toString()).toString()
    //       }
    //     });
    //   } else {
    //     //Approve for Operator to use Amount of tokens of user
    //     await getPaymentContract(order.paymentType)?.approve({
    //       operator: contractMarket.address,
    //       amount: order.price
    //     });

    //     txReceipt = await contractMarket.send({
    //       method: 'rentNftbyErc20',
    //       args: [order.tokenID, getContracts().erc20s.BCT.address],
    //       params: {
    //         value: ethers.parseEther(order.price.toString()).toString()
    //       }
    //     });
    //   }

    //   //Create a market order for renter
    //   const res = await this.create({
    //     event: TransactionEvent.EXPIRY,
    //     chainID: order.chainID,
    //     tokenID: order.tokenID,
    //     tokenAddress: order.tokenAddress,
    //     paymentType: order.paymentType,
    //     price,
    //     seller: order.seller,
    //     buyer: getWallet()!,
    //     status: MarketStatus.ISRENTING,
    //     startAt: payload?.startAt,
    //     endAt: payload?.endAt,
    //     limitUsers: order.limitUsers,
    //     usageRight: order.usageRight
    //   })
    // } 
     if (order.paymentType !== AppPayment.BCT) {
        console.log("buy by ETH", order.tokenID)
        txReceipt = await contractMarket.send({
          method: 'buyNftbyETH',
          args: [order.tokenID],
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
          args: [order.tokenID, getContracts().erc20s.BCT.address],
          params: {
            value: ethers.parseEther(order.price.toString()).toString()
          }
        });
      }

      const payloadUpdate = { status: MarketStatus.SOLD, buyer: getWallet() };
      await this.update(order!.id, payloadUpdate);

    //force update balances
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
    if (status === TransactionEvent.EXPIRY) return "Thuê";
  }
}