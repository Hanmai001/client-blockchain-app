import { ChainId } from "@/share/blockchain/types";
import { Configs } from "../type";
import getNextConfig from 'next/config';
const { publicRuntimeConfig } = getNextConfig();

export const productionConfigs: Configs = {
  URL_CROSS_STORAGE: 'https://hanmai001.github.io/cross-storage/index.html',
  // URL_CROSS_STORAGE: publicRuntimeConfig.URL_CROSS_STORAGE || "http://127.0.0.1:5500/index.html",
  URL_MAIN_API: publicRuntimeConfig.URL_MAIN_API || "http://blockclip.pro.vn:4000/",
  SOCKET_ENDPOINT: publicRuntimeConfig.SOCKET_ENDPOINT || "http://blockclip.pro.vn:5000/",
  PUBLIC_URL: publicRuntimeConfig.PUBLIC_URL || "https://blockclip.pro.vn/",
  chains: {
    [ChainId.BSC_TESTNET]: {
      erc20s: {
        // USDM: '0x85eB2c83f72613B7beCbd8b78f2f89df326744Bf',
        // USDT: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
        BCT: '0x4097D3f61a51748dBB59e37BF8FfC40B804EAB5e',
      },
      erc721s: {
        BLOCKCLIP_NFT: '0xc7094bE2C8Fa42f032ae21e8d9bBDc55A29440D0',
      },
      ercs: {
        MARKETPLACE: '0x2E2d586B415b29ADc198dA23e11CE57c21394576'
      }
    },
  },
}