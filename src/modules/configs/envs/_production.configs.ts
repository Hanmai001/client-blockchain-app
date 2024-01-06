import { ChainId } from "@/share/blockchain/types";
import { Configs } from "../type";

export const productionConfigs: Configs = {
  URL_CROSS_STORAGE: 'http://localhost:5500',
  chains: {
    [ChainId.BSC_TESTNET]: {
      erc20s: {
        USDM: '0x85eB2c83f72613B7beCbd8b78f2f89df326744Bf',
        USDT: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
        BCT: ''
      },
      erc721s: {
        VIDEO_NFT: ''
      }
    },
  },
}