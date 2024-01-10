import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { DefaultMantineColor, useMantineColorScheme } from '@mantine/core';
import { ChainConfig, Configs, Contracts, ERC20Contracts, ERC721Contracts, GetConfig } from "./type";
import { configs } from "./envs";
import { AppEnv } from "../../../types";
import { ChainId } from "@/share/blockchain/types";
import { useBlockChain } from "@/share/blockchain/context";
import { chains } from "@/share/blockchain/chain";
import { ContractERC721 } from "@/share/blockchain/contracts/ERC721";
import { ContractERC20 } from "@/share/blockchain/contracts/ERC20";

export const PRIMARY_COLOR: DefaultMantineColor = 'dark';
export const PRIMARY_DARK_COLOR: DefaultMantineColor = 'primary';

//Define development environment
export const ENV = `${AppEnv.PRODUCTION}`.toUpperCase() as AppEnv;
export const appConfigs = configs[ENV];
export const getConfig: GetConfig = (key: keyof Configs) => appConfigs[key];
export let getChainId: () => ChainId = () => undefined as any;
export const getChainConfig = (chainId?: ChainId) => {
  const chainConfig = appConfigs.chains[chainId || getChainId()]
  if (!chainConfig) throw Error('Chain is not supported')
  return chainConfig
}

export let getContracts: () => Contracts;

export const ConfigsContext = createContext<any>({} as any);

export const ConfigsProvider: FC<PropsWithChildren> = (props) => {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  const firstChainSupported = Object.keys(appConfigs.chains)[0] as ChainId;
  const blockchain = useBlockChain();
  const defaultStatus: {isReady: boolean, chainId: ChainId} = {isReady: false, chainId: firstChainSupported};
  const [status, setStatus] = useState(defaultStatus);
  const availableChains = chains.filter(v => !appConfigs.chains[v.chainId]);
  const chainConfig = appConfigs.chains[status.chainId] as ChainConfig;

  getChainId = () => status.chainId;

  const handleChangeChain = async (chainId: ChainId) => {
    const isSupportedChain = !!appConfigs.chains[chainId];
    if (!isSupportedChain) return;
    localStorage.setItem('chain_id', chainId);
    setStatus(s => ({...s, chainId: chainId}));
    //Update state of blockchain
    blockchain.connectChain(chainId);
  }

  const contractERC721s = Object.keys(chainConfig.erc721s).reduce((output, key) => {
    output[key] = new ContractERC721({
      address: chainConfig.erc721s[key],
      chainId: status.chainId,
      provider: blockchain.provider,
      name: key,
      wallet: blockchain.wallet,
    })
    return output;
  }, {} as ERC721Contracts<ContractERC721>)

  const contractERC20s = Object.keys(chainConfig.erc20s).reduce((output, key) => {
    output[key] = new ContractERC20({
      address: chainConfig.erc20s[key],
      chainId: status.chainId,
      provider: blockchain.provider,
      name: key,
      wallet: blockchain.wallet,
    })
    return output;
  }, {} as ERC20Contracts<ContractERC20>);

  const contracts: Contracts = {
    isAbleToWrite: !!blockchain.provider && !!blockchain.wallet && blockchain.chainId && blockchain.chainId === status.chainId,
    erc20s: contractERC20s,
    erc721s: contractERC721s,
  }

  getContracts = () => contracts;

  useEffect(() => {
    if (!status.isReady) {
      let status = defaultStatus;
      const browserChainId = localStorage.getItem('chain_id') as ChainId;
      if (browserChainId) {
        const isSupportedChain = !!appConfigs.chains[browserChainId];
        if (isSupportedChain) status.chainId = browserChainId;
      }
      setStatus(s => ({...s, isReady: true}));
    }
  }, [status.isReady]);

  return (
    <ConfigsContext.Provider
      value={{
        ...status,
        ...appConfigs,
        availableChains,
        contracts,
        handleChangeChain,
        colorScheme,
        isDarkMode: colorScheme === 'dark',
        toggleColorScheme
      }}
    >
      {props.children}
    </ConfigsContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigsContext);

// Validate environment
if (!Object.values(AppEnv).includes(ENV)) throw Error('Invalid ENV')