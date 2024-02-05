import { ethers } from "ethers";
import { FC, createContext, useContext, useEffect, useState } from "react";
import { chains } from "./chain";
import { ContractERC20 } from "./contracts/ERC20";
import { ContractERC721 } from "./contracts/ERC721";
import { Contract } from "./contracts/core";
import { BlockChainContext, BlockChainProviderProps, BlockchainError, BlockchainErrorCode, BlockchainStatus, ChainId, ConnectChain, ConnectWallet, GetChain, GetContract, GetContractERC20, GetContractERC721, Provider, ProviderType, SwitchChain, Token } from "./types";

export let getWallet: () => string | undefined = () => undefined;
export let getProvider: () => Provider | undefined = () => ({} as any);
export let connectWallet: ConnectWallet;
export let connectChain: ConnectChain;
export let switchChain: SwitchChain;
export let disconnect: () => void;
export let getContract: GetContract;
export let getContractERC20: GetContractERC20;
export let getContractERC721: GetContractERC721;
export let getBlockchainConfig: () => BlockChainProviderProps | undefined = () => undefined;
export let getChain: GetChain;
export let getChainId: () => ChainId | string | undefined;

export const blockChainContext = createContext({} as BlockChainContext);

export const BlockChainProvider: FC<BlockChainProviderProps> = (props) => {
  getBlockchainConfig = () => props;
  //const defaultChain = props.defaultChain || ChainId.BSC_TESTNET;

  const [version, update] = useState(1);
  const forceUpdate = () => update(Date.now());

  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState<BlockchainStatus>({});

  getWallet = () => status.wallet;
  getProvider = () => status.provider;
  getChainId = () => status.chainId;

  const setup = async (provider: ethers.Eip1193Provider, providerType: ProviderType, forceChainId?: ChainId) => {
    const providerUse = new ethers.BrowserProvider(provider);
    let currentChainId = (await providerUse.getNetwork()).chainId.toString() as ChainId;

    const accounts = await provider.request({ method: 'eth_requestAccounts'});
    const wallet = ethers.getAddress(accounts[0].toString());

    //if user want to connect to another chain
    if (forceChainId && forceChainId !== currentChainId) {
      try {
        await connectChain(forceChainId);
      } catch (error) {
        return false;
      }
      currentChainId = (await providerUse.getNetwork()).chainId.toString() as ChainId;
    }

    setStatus(s => ({ ...s, chainId: currentChainId, wallet, provider, providerType }));
    setIsInitialized(true);

    return { chainId: currentChainId, wallet, provider, providerType };
  }

  const initProvider = async (providerType: ProviderType) => {
    const metamask_logout = localStorage.getItem("metamask_logout");

    if ((!providerType || providerType === 'metamask') && !metamask_logout) {
      const { ethereum } = window as any;
      if (ethereum) {
        return setup(ethereum, 'metamask');
      };
    }
  }

  const initialize = async () => {
    try {
      const myWallet = localStorage.getItem('my_wallet')
      const res = await initProvider(myWallet as ProviderType);
      return setIsInitialized(true);
    } catch (error) {
      setIsInitialized(true);
    }
  };

  connectWallet = async (providerType: ProviderType, forceChainId?: ChainId) => {
    try {
      if (providerType === 'metamask') {
        localStorage.setItem("my_wallet", "metamask");
        localStorage.removeItem("metamask_logout");
        const { ethereum } = window as any;
        if (!ethereum) throw Error("Please Install Metamask Extension");
        await ethereum.request({ method: 'eth_requestAccounts' });
        const connectInfo = await setup(ethereum, "metamask", forceChainId);

        return connectInfo;
      }
    } catch (error) {
      if (error instanceof BlockchainError) throw error;
      if (error && typeof error === 'object' && (error as any).code === -32002) {
        throw new BlockchainError({
          message: 'A request has been sent to Metamask, please help me check!',
          code: BlockchainErrorCode.METAMASK_ALREADY_SENT_A_REQUEST
        });
      } else {
        throw new BlockchainError({
          message: 'Something went wrong when connect wallet with Metamask',
          code: BlockchainErrorCode.METAMASK_CANNOT_CONNECTED
        });
      }
    }
  }

  connectChain = async (chainId: any) => {
    const chain = chains.find(v => v.chainId === chainId);
    if (!chain) throw Error("Chain does not supported yet");

    try {
      await status.provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${(+chain.chainId).toString(16)}`,
            chainName: chain.name,
            rpcUrls: [chain.rpcURLs[0]],
            nativeCurrency: {
              name: chain.currency.name,
              symbol: chain.currency.name,
              decimals: chain.currency.decimals,
            },
            blockExplorerUrls: [chain.urlBlockExplorer]
          }
        ]
      })
    } catch (error) {
      throw new BlockchainError({
        code: BlockchainErrorCode.CANNOT_CONNECT_NETWORK,
        message: 'Cannot connect network',
      });
    }

    setStatus(s => ({ ...s, chainId }));
    forceUpdate();
  }

  switchChain = async (chainId: any) => {
    const chain = chains.find(v => v.chainId === chainId);
    if (!chain) throw Error("Chain does not supported yet");

    try {
      await status.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${(+chain.chainId).toString(16)}`,
          }
        ]
      })
    } catch (error) {
      throw new BlockchainError({
        code: BlockchainErrorCode.CANNOT_CONNECT_NETWORK,
        message: 'Cannot connect chain',
      });
    }

    setStatus(s => ({ ...s, chainId }));
    forceUpdate();
  }

  getChain = (chainId: string) => {
    const chain = chains.find(v => v.chainId === chainId);
    if (!chain) throw Error("Chain does not supported yet");

    return chain;
  }

  getContract = (params) => {
    const chainId = params.chainId || status.chainId as ChainId;
    return new Contract({
      ...props,
      wallet: status.wallet,
      provider: status.provider,
      ...params,
      chainId
    })
  }

  getContractERC20 = (params) => {
    const chainId = params.chainId || status.chainId as ChainId;
    return new ContractERC20({
      ...props,
      wallet: status.wallet,
      provider: status.provider,
      ...params,
      chainId,
    });
  }

  getContractERC721 = (params) => {
    const chainId = params.chainId || status.chainId as ChainId;
    return new ContractERC721({
      ...props,
      wallet: status.wallet,
      provider: status.provider,
      ...params,
      chainId,
    });
  }

  const disconnect = () => {
    try {
      localStorage.setItem("metamask_logout", "true");
      localStorage.removeItem("my_wallet");
      setStatus({});
    } catch (error) {
      throw error;
    }
  }

  const addErc20 = async (tokenInfo: Token) => {
    try {
      const options = {
        address: tokenInfo.address,
        symbol: tokenInfo.symbol,
        image: tokenInfo.image,
        decimals: tokenInfo.decimals
      }

      const { ethereum } = window as any;
      if (ethereum) {
        await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options
          }
        })
      }
      else {
        throw Error("Not implement yet");
      }
    } catch (error) {
      if (error instanceof BlockchainError) throw error;
    }
  }

  useEffect(() => {
    const provider = status.provider;
    if (provider) {
      const handleChangeAccount = (accounts: string[]) => {
        const wallet = accounts[0] ? ethers.getAddress(accounts[0]) : undefined;
        console.log("wallet: ", wallet)
        setStatus(s => ({ ...s, wallet }));
        forceUpdate();
      }

      const handleChangeChain = async () => {
        const web3 = new ethers.BrowserProvider(provider);
        const chainId = (await web3.getNetwork()).chainId.toString() as ChainId;
        setStatus(s => ({ ...s, chainId }));
        forceUpdate();
      }

      //add events of metamask for provider
      provider.on("accountsChanged", handleChangeAccount);
      provider.on("chainChanged", handleChangeChain);

      //return when component is unmount
      return () => {
        provider.removeListener("accountsChanged", handleChangeAccount);
        provider.removeListener("chainChanged", handleChangeChain);
      }
    }
  }, [version, isInitialized, status.provider]);

  useEffect(() => {
    //check if user have connected with provider before or connect to default metamask 
    initialize();
    //Add fields for window object
    (window as any).blockchainConfig = props;
    (window as any).blockchainStatus = status;
  }, []);

  const context: BlockChainContext = {
    ...status,
    connectWallet: connectWallet,
    connectChain: connectChain,
    switchChain: switchChain,
    disconnect: disconnect,
    getChain: getChain,
    getContract,
    addErc20: addErc20,
    configs: props,
    isInitialized
  }

  return <blockChainContext.Provider value={context}>
    {props.children}
  </blockChainContext.Provider>
}

export const useBlockChain = () => useContext(blockChainContext);

export const renderLinkContract = (address: string, chainId: string) => {
  const chain = chains.find(v => v.chainId === chainId);
  if (chain) return `${chain.urlBlockExplorer}/address/${address}`;
  return `${address}`;
}

export const renderLinkTransaction = (transactionHash: string, chainId: string) => {
  const chain = chains.find(v => v.chainId === chainId);
  if (chain) return `${chain.urlBlockExplorer}/tx/${transactionHash}`;
  return `${transactionHash}`;
}