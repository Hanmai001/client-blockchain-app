import { ChainId } from "@/share/blockchain/types";
import { Configs } from "../type";
import getNextConfig from 'next/config';
const { publicRuntimeConfig } = getNextConfig();

export const productionConfigs: Configs = {
  // URL_CROSS_STORAGE: 'https://hanmai001.github.io/cross-storage/index.html',
  URL_CROSS_STORAGE: publicRuntimeConfig.URL_CROSS_STORAGE || "http://127.0.0.1:5500/index.html",
  URL_MAIN_API: publicRuntimeConfig.URL_MAIN_API || "http://localhost:4000",
  SOCKET_ENDPOINT: publicRuntimeConfig.SOCKET_ENDPOINT || "http://localhost:5000",
  PUBLIC_URL: publicRuntimeConfig.PUBLIC_URL || "http://localhost:3000",
  chains: {
    [ChainId.BSC_TESTNET]: {
      erc20s: {
        // USDM: '0x85eB2c83f72613B7beCbd8b78f2f89df326744Bf',
        // USDT: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
        BCT: '0x470e18822EdfD20770231Cd02b0154bc30e2Eee0',
      },
      erc721s: {
        BLOCKCLIP_NFT: '0xC94D4239B037B842f1Ed92dAC48884eA2Ed06563',
      },
      ercs: {
        MARKETPLACE: '0xE7C8817E4123d67502EE91F39ce90eD107bED235'
      }
    },
  },
}