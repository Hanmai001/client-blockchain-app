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
        BCT: '0x462B95042F81866D9EE5ad5124d727f86f697d88',
      },
      erc721s: {
        BLOCKCLIP_NFT: '0xe84dC3C68ad5ea0854816657EE4Ab45401640e7B',
      },
      ercs: {
        MARKETPLACE: '0xD4094A0BBEd108f19C538E90D5b13B8a88a760be'
      }
    },
  },
}