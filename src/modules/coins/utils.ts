import { chains } from "@/share/blockchain/chain"
import { AppPayment } from "../../../types"
import { getChainId } from "../configs/context"
import { ChainId } from "@/share/blockchain/types"

export const renderPayment = (payment: AppPayment, specificChainId?: ChainId) => {
  const chainId = specificChainId || getChainId();
  let symbol: string = payment

  if (payment === AppPayment.ETH) {
    const chain = chains.find((v) => v.chainId === chainId)
    if (chain) symbol = chain.currency.name
  }

  if (payment === AppPayment.USDM) symbol = 'USDM'
  if (payment === AppPayment.USDT) symbol = 'USDT'
  if (payment === AppPayment.BCT) symbol = 'BCT'

  return {
    image: `/images/coins/${symbol.toLowerCase()}.png`,
    symbol,
  }
}