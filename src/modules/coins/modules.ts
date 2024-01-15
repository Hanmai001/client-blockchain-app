import { getBalanceOfEth } from "@/share/blockchain/utils"
import { AppPayment } from "../../../types"
import { getChainId } from "../configs/context"
import { CoinsType } from "./types"
import { getPaymentContract } from "./utils"
import { store } from "@/redux/store"
import { SET_USER_COIN_BALANCES } from "@/reducers/coins.reducer"
import { getWallet } from "@/share/blockchain/context";


export class CoinsModule {
  static async fetchUserBalance(specialWallet?: string): Promise<CoinsType<number>> {
    const data = await Promise.all([
      getPaymentContract(AppPayment.BCT)!.balanceOf(specialWallet || getWallet()!),
      getBalanceOfEth(getChainId(), specialWallet || getWallet()!),
      getPaymentContract(AppPayment.USDT)!.balanceOf(specialWallet || getWallet()!),
      getPaymentContract(AppPayment.USDM)!.balanceOf(specialWallet || getWallet()!),
      // missing usdm
    ])

    const balances: CoinsType<number> = {
      [AppPayment.BCT]: data[0],
      [AppPayment.ETH]: data[1],
      [AppPayment.USDT]: data[2],
      [AppPayment.USDM]: data[3],
    }

    store.dispatch({ type: SET_USER_COIN_BALANCES, data: balances })

    return balances;
  }
}