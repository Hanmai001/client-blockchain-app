import { chains } from "@/share/blockchain/chain"
import { AppPayment } from "../../../types"
import { getChainConfig, getChainId } from "../configs/context"
import { ChainId } from "@/share/blockchain/types"
import { ContractERC20 } from "@/share/blockchain/contracts/ERC20"
import { getProvider } from "@/share/blockchain/context"

export const renderPayment = (payment: AppPayment, specificChainId?: ChainId) => {
  const chainId = specificChainId || getChainId();
  let symbol: string = payment

  if (payment === AppPayment.ETH) {
    const chain = chains.find((v) => v.chainId === chainId)
    if (chain) symbol = chain.currency.name
  }

  // if (payment === AppPayment.USDM) symbol = 'USDM'
  // if (payment === AppPayment.USDT) symbol = 'USDT'
  if (payment === AppPayment.BCT) symbol = 'BCT'

  return {
    image: `/images/coins/${symbol.toLowerCase()}.png`,
    symbol,
  }
}

export const getPaymentContract = (payment: AppPayment, specificChainId?: ChainId): ContractERC20 | undefined => {
  const chainId = specificChainId || getChainId()
  if (!chainId) return undefined
  //Already defined
  if (payment === AppPayment.ETH) return;

  let address = '';

  const chainConfig = getChainConfig(chainId);

  if (payment === AppPayment.BCT) address = chainConfig.erc20s.BCT;

  if (!address) return;

  return new ContractERC20({
    address,
    name: payment,
    chainId: chainId,
    provider: getProvider(),
  })
}