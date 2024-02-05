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
        BCT: '0xfEbD70Cc6EbEedb5fA9FabFE88031F9c9911FE4a',
      },
      erc721s: {
        BLOCKCLIP_NFT: '0x5089fbbA3a13103bf0683ebC7b11887Cf39810E3',
      },
      ercs: {
        MARKETPLACE: '0x689e86CAA4A62825570994cA8F4632177Ab14828'
      }
    },
  },
}