import { ethers } from "ethers";
import { AppPayment } from "../../../types";
import { CoinsModule } from "../coins/modules";
import { getPaymentContract } from "../coins/utils";
import { getContracts } from "../configs/context";
import { RequestModule } from "../request/request";
import { MarketPackage, MarketPackagePayload, MarketPackageQuery } from "./types";

export class MarketPackageModule {
  static async getListOfUser(query?: MarketPackageQuery): Promise<any> {
    return RequestModule.get(`/api/v1/packages`, query);
  }

  static async create(payload: MarketPackagePayload): Promise<MarketPackage> {
    return RequestModule.post(`/api/v1/packages`, payload);
  }

  static async subscribe(payload: MarketPackagePayload): Promise<any> {
    const balances = await CoinsModule.fetchUserBalance();
    if (payload.price > balances[payload.paymentType]) throw new Error("Số dư ví không đủ");
    let txReceipt;
    const contractMarket = getContracts().ercs.MARKETPLACE;
    
    if (payload.paymentType === AppPayment.ETH) {
        txReceipt = await contractMarket.send({
          method: 'subscribeByEth',
          args: [payload.collectionID, payload.seller],
          params: {
            value: ethers.parseEther(payload.price.toString()).toString()
          }
        });
    } else {
        //Approve for Operator to use Amount of tokens of user
        await getPaymentContract(payload.paymentType)?.approve({
          operator: contractMarket.address,
          amount: payload.price
        });

        txReceipt = await contractMarket.send({
          method: 'subscribeByErc20',
          args: [payload.collectionID, getContracts().erc20s.BCT.address, payload.seller],
          params: {
            value: ethers.parseEther(payload.price.toString()).toString()
          }
        });
    }
    await this.create(payload);
    await CoinsModule.fetchUserBalance();
  }
}