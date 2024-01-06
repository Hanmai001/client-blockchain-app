import { Chain, ChainId } from "./types";

export const chainBscTestnet: Chain = {
  chainId: ChainId.BSC_TESTNET,
  name: 'BSC Testnet',
  rpcURLs: [
    'https://bsc-testnet.publicnode.com',
    'https://endpoints.omniatech.io/v1/bsc/testnet/public',
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    'https://data-seed-prebsc-1-s2.binance.org:8545',
    'https://data-seed-prebsc-1-s3.binance.org:8545',
  ],
  currency: {
    name: 'tBNB',
    decimals: 18
  },
  urlBlockExplorer: 'https://testnet.bscscan.com',
}

export const chains: Chain[] = [
  chainBscTestnet
]