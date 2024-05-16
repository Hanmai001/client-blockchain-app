import { JsonRpcSigner } from "ethers";
import { ContractERC20 } from "./contracts/ERC20";
import { ContractERC721 } from "./contracts/ERC721";
import { Contract } from "./contracts/core";

export enum ChainId {
  BSC_TESTNET = '97',
}

export enum TokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
}

export interface BlockChainProviderProps {
  defaultChain?: ChainId,
  children?: any,
  rateGas?: number,
  rateGasPrice?: number,
  captureTransaction?: (transaction: Transaction) => any,
}

export interface BlockChainContext extends BlockchainStatus {
  isInitialized: boolean;
  connectWallet: ConnectWallet,
  connectChain: ConnectChain,
  switchChain: SwitchChain,
  addErc20: AddToken,
  disconnect: () => void,
  configs: BlockChainProviderProps,
  providerType?: ProviderType,
  getChain: GetChain,
  getContract: GetContract,
}

export enum BlockchainErrorCode {
  UNKNOWN_ERROR = 'Unknown error',
  USER_REJECTED = 'You declined the transaction',
  INVALID_JSON_WAS_RECEIVED_BY_THE_SERVER = 'Invalid json was received by the server',
  INVALID_PAYLOAD_REQUEST = 'Invalid payload request',
  REQUEST_LIMIT_EXCEEDED = 'Request limit exceeded',
  METHOD_DOES_NOT_EXISTED_OR_NOT_AVAILABLE = 'Method does not existed or not available',
  METHOD_NOT_SUPPORTED = 'Method not supported',
  INVALID_JSON_RPC_ERROR = 'Invalid json RPC error',
  INVALID_METHOD_PARAMETERS = 'Invalid method parameters',
  INVALID_INPUT = 'Invalid input',
  RESOURCE_NOT_FOUND = 'Resource not found',
  RESOURCE_UNAVAILABLE = 'Resource unavailable',
  TRANSACTION_REJECTED = 'Transaction was rejected',
  THE_REQUEST_ACCOUNT_OR_METHOD_HAS_NOT_BEEN_AUTHORIZED = 'The request account or method has not been authorized',
  THE_REQUEST_METHOD_IS_NOT_SUPPORTED_BY_THIS_ETHEREUM_PROVIDER = 'The request method is not supported by this ethereum provider',
  THE_PROVIDER_IS_DISCONNECTED_FROM_ALL_CHAINS = 'The provider is disconnected from all chains',
  THE_PROVIDER_IS_DISCONNECTED_FROM_THE_SPECIFIED_CHAIN = 'The provider is disconnected from the specified chain',

  METAMASK_ALREADY_SENT_A_REQUEST = 'Metamask already sent a request',
  WALLET_CONNECT_ALREADY_SENT_A_REQUEST = 'WalletConnect already sent a request',
  METAMASK_CANNOT_CONNECTED = 'Metamask cannot connected',
  CANNOT_CONNECT_NETWORK = 'Connect network failed',
  CANNOT_ADD_ASSET = 'Cannot add asset',
  MUST_BE_CONNECT_WALLET = 'Must be connect wallet before',
  CANNOT_FIND_METHOD = 'Cannot find method',
  CHAIN_NOT_SUPPORTED = 'This chain not supported yet',
  AR_CANNOT_CONNECT_RPC_URL = 'Cannot connect RPC URL (Auto Retry)',
  CANNOT_CONNECT_RPC_URL = 'Cannot connect RPC URL',
  TRANSACTION_TIME_OUT = 'Transaction timeout',
  CONTRACT_NOT_DEPLOYED_YET = 'Contract not deployed yet',
  APPROVAL_FAILED = 'Approval failed',
  NOT_ENOUGH_BALANCE_FOR_GAS_FEE = 'Not enough balance for gas fee',
  TRANSACTION_REVERTED_BY_THE_EVM = 'Transaction has been reverted by the EVM',
  TRANSACTION_UNDER_PRICED = 'Transaction underpriced',
  NONCE_TOO_LOW = 'Nonce too low',
  CANNOT_TRANSFER_TO_YOUR_SELF = 'Cannot transfer to your self',
  CANNOT_FIND_RECEIPT = 'Cannot find receipt',
}

export type Provider = any;

export type ProviderType = 'metamask' | 'walletconnect';

export type TokenUriType = 'unknown' | 'base64' | 'ipfs' | 'uri' | 'empty';

export interface Token {
  address: string,
  symbol: string,
  image: string,
  decimals?: number
}

export interface BlockchainStatus {
  wallet?: string;
  chainId?: ChainId;
  provider?: any;
  providerType?: ProviderType,
}

export class BlockchainError {
  error?: any;
  code: BlockchainErrorCode;
  message?: string;
  transactionHash?: string;
  transaction?: Transaction;
  type?: ContractActionType;
  provider: string;
  method?: string;
  wallet?: string | JsonRpcSigner;
  args?: string;
  contractName?: string;
  contractAddress?: string;

  constructor(params: {
    error?: any,
    code?: BlockchainErrorCode,
    message?: string
    transactionHash?: string,
    transaction?: Transaction,
    type?: ContractActionType,
    provider?: string,
    method?: string,
    wallet?: string | JsonRpcSigner,
    args?: string,
    contractName?: string,
    contractAddress?: string,
  }) {
    this.code = params.code || BlockchainErrorCode.UNKNOWN_ERROR;
    this.message = params.message || params.code || 'An error has occurred.';
    this.transactionHash = params.transactionHash || '';
    this.type = params.type;
    this.provider = params.provider || 'Unknown';
    this.method = params.method;
    this.error = params.error;
    this.wallet = params.wallet;
    this.args = params.args;
    this.contractName = params.contractName;
    this.contractAddress = params.contractAddress;
  }
}

export type ConnectWallet = (providerType: ProviderType, chainId?: ChainId) => Promise<any>;
export type ConnectChain = (chainId: ChainId) => Promise<any>;
export type SwitchChain = (chainId: ChainId) => Promise<any>;
export type AddToken = (information: Token) => Promise<void>;
export type GetContract = (params: { address: string, abi: any[], name?: string, chainId?: ChainId}) => Contract;
export type GetContractERC721 = (params: { address: string, name?: string, chainId?: ChainId }) => ContractERC721;
export type GetContractERC20 = (params: { address: string, name?: string, chainId?: ChainId }) => ContractERC20;
export type GetChain = (chainId: string) => Chain;

export enum TokenUnit {
  /**
   * Decimal 31
   */
  tether = 'tether',
  /**
   * Decimal 25
   */
  mether = 'mether',
  /**
   * Decimal 21
   */
  kether = 'kether',
  /**
   * Decimal 18
   */
  ether = 'ether',
  /**
   * Decimal 15
   */
  finney = 'finney',
  /**
   * Decimal 12
   */
  szabo = 'szabo',
  /**
   * Decimal 9
   */
  gwei = 'gwei',
  /**
   * Decimal 6
   */
  mwei = 'mwei',
  /**
   * Decimal 3
   */
  kwei = 'kwei',
}

export interface Chain {
  chainId: ChainId,
  name: string,
  rpcURLs: string[],
  currency: {
    name: string,
    decimals: number,
  },
  urlBlockExplorer: string,
}

export interface ContractConfigs {
  chainId: ChainId,
  address: string,
  name?: string,
  provider?: Provider,
  wallet?: string,
  rateGas?: number,
  rateGasPrice?: number,
  captureTransaction?: (transaction: Transaction) => any,
  abi?: any[],
}

export type ContractActionType = 'READ' | 'WRITE';

export interface ContractSendOptions {
  method: string,
  onSubmitted?: (transactionHash: string) => void,
  params?: any,
  rateGas?: number,
  rateGasPrice?: number,
  privateKey?: string,
  args?: any[],
  estimateGas?: ContractEstimateGas,
  delayInSeconds?: number,
}

export interface ContractEstimateGas {
  fee: number,
  feeInWei: string,
  gasLimit: number,
  gasPrice: number,
  func: any,
  provider: any,
  wallet: string,
  contract: any,
}

//READ
export interface ContractCallOptions {
  method: string,
  args?: any[],
  retryTime?: number,
}

//WRITE
export interface ContractSendOptions {
  method: string,
  onSubmitted?: (transactionHash: string) => void,
  params?: any,
  rateGas?: number,
  rateGasPrice?: number,
  privateKey?: string,
  args?: any[],
  estimateGas?: ContractEstimateGas,
  delayInSeconds?: number,
}

export interface Transaction {
  blockHash: string,
  blockNumber: number,
  contractAddress: null | string,
  events: any,
  from: string,
  gasUsed: number,
  cumulativeGasUsed: number,
  logsBloom: string,
  status: boolean,
  to: string,
  value: string,
  tractionHash: string,
  transactionIndex: number,
  [property: string]: any
}

export interface SignTypeDataPayload {
  domain: {
    name: string,
    version: string
  },
  privateKey: string,
  data: {type: string, value: any}[]
}

export interface TransactionEventParsed {
  logIndex: number,
  event: string,
  returnValues: any,
  address: string,
  interface?: "ERC721" | "ERC20"
}

