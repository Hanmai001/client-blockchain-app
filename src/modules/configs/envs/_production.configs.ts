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
        BCT: '0x470e18822EdfD20770231Cd02b0154bc30e2Eee0',
      },
      erc721s: {
        BLOCKCLIP_NFT: '0x455EbFdEb9B251D8a3ff8391C340228B40E933e2',
      },
      ercs: {
        MARKETPLACE: '0x98539031cE73f5eF94057836C3836c3a4b9803C8'
      }
    },
  },
}