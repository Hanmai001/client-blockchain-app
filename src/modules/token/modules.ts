import { ContractERC721 } from "@/share/blockchain/contracts/ERC721";
import { getChainId } from "../configs/context";
import { getProvider, getWallet } from "@/share/blockchain/context";

export class TokenModule {
  static getContractERC721(address: string) {
    return new ContractERC721({
      address,
      chainId: getChainId(),
      provider: getProvider(),
      wallet: getWallet(),
    })
  }
}