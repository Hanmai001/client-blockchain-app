import { ChainId } from "@/share/blockchain/types";
import { Configs } from "../type";

export const productionConfigs: Configs = {
  URL_CROSS_STORAGE: 'http://127.0.0.1:5500/hub.html',
  URL_MAIN_API: 'http://localhost:4000',
  chains: {
    [ChainId.BSC_TESTNET]: {
      erc20s: {
        USDM: '0x85eB2c83f72613B7beCbd8b78f2f89df326744Bf',
        USDT: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
        BCT: '0x9d011151590fb752B5555323D369c393e960eD07',
      },
      erc721s: {
        BLOCKCLIP_NFT: '0x452E9a0e944847DD6b80Fd6003Cf52FeA67BD7D7'
      }
    },
  },
}