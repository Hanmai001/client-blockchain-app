import { ChainId } from "@/share/blockchain/types";
import { Configs } from "../type";

export const productionConfigs: Configs = {
  URL_CROSS_STORAGE: 'http://127.0.0.1:5500/hub.html',
  URL_MAIN_API: 'http://localhost:4000',
  chains: {
    [ChainId.BSC_TESTNET]: {
      erc20s: {
        // USDM: '0x85eB2c83f72613B7beCbd8b78f2f89df326744Bf',
        // USDT: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
        BCT: '0xd0eB9bAD76Eb3386805558e284481F978B5e03A0',
      },
      erc721s: {
        BLOCKCLIP_NFT: '0xA9b666d1D6b86cBa297C21dB46E7056351970b70',
      },
      ercs: {
        MARKETPLACE: '0x13D56Dc4C405869769F3A8121a5cca23291b7bE3'
      }
    },
  },
}