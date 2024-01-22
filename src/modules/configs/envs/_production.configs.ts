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
        BLOCKCLIP_NFT: '0xa606a0f3EcaCbDD3ef31F5241Dc3D7a80ecBa1bA',
      },
      ercs: {
        MARKETPLACE: '0xDa766be8107C60c9353C64D5b21C95a229738919'
      }
    },
  },
}