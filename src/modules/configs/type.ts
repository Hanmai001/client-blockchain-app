import { Chain, ChainId } from "@/share/blockchain/types"
import { AppEnv } from "../../../types"
import { Contract } from "@/share/blockchain/contracts/core"
import { ContractERC20 } from "@/share/blockchain/contracts/ERC20"
import { ContractERC721 } from "@/share/blockchain/contracts/ERC721"
import { MantineColorScheme } from '@mantine/core'

//CONFIGS
export type EnvConfigs = {
  [key in AppEnv]: Configs
}
export type Configs = {
  URL_CROSS_STORAGE: string,
  URL_MAIN_API: string,
  chains: {
    [key in ChainId]?: ChainConfig
  }
}
export type GetConfig = (key: keyof Configs) => any;

export interface ChainConfig {
  erc20s: ERC20Contracts<string>,
  erc721s: ERC721Contracts<string>,
}

export interface ConfigsContext extends Configs {
  isReady: boolean
  chainId: ChainId
  chain: Chain
  colorScheme: MantineColorScheme
  isDarkMode: boolean
  chainSupporteds: Chain[]
  changeChain: (chainId: ChainId) => void
  toggleColorScheme: () => void
  contracts: Contracts
}

export interface ERC20Contracts<T> {
  USDM: T
  USDT: T
  BCT: T
}

export interface ERC721Contracts<T> {
  BLOCKCLIP_NFT: T
}

export interface Contracts {
  isAbleToWrite: boolean,
  erc20s: ERC20Contracts<ContractERC20>,
  erc721s: ERC721Contracts<ContractERC721>,
}

export enum CollectionTyle {
  ALL = 'Tất cả',
  TOURISM = 'Du lịch',
  GAME = 'Trò chơi',
  LIFE = 'Đời sống',
  EDUCATION = 'Giáo dục',
  FAMILY = 'Gia đình',
  FILM = 'Phim ảnh',
  COOK = 'Nấu ăn'
}