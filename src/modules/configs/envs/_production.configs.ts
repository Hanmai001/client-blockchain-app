import { ChainId } from "@/share/blockchain/types";
import { Configs } from "../type";

export const productionConfigs: Configs = {
  URL_CROSS_STORAGE: process.env.NEXT_PUBLIC_URL_CROSS_STORAGE || '',
  URL_MAIN_API: process.env.NEXT_PUBLIC_URL_API_MAIN || '',
  SOCKET_ENDPOINT: process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || '',
  PUBLIC_URL: process.env.NEXT_PUBLIC_PUBLIC_URL || '',
  chains: {
    [ChainId.BSC_TESTNET]: {
      erc20s: {
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