import { TransactionReceipt, ethers } from "ethers";
import { BlockchainError, BlockchainErrorCode, ChainId, ContractActionType, SignTypeDataPayload, TokenType, Transaction, TransactionEventParsed } from "./types";
import { chainBscTestnet, chains } from "./chain";
import { Contract } from "./contracts/core";
import web3EthAbi from 'web3-eth-abi';
import ERC721_ABI from './abis/ERC721.json';
import ERC20_ABI from './abis/ERC20.json';

export const addressZero = "0x0000000000000000000000000000000000000000";

export const wait = async (time: number) => new Promise(r => setTimeout(r, time));

export function parseBlockchainError(data: {
  type: ContractActionType,
  error: any,
  method: string,
  transactionHash?: string,
  provider?: ethers.BrowserProvider | ethers.JsonRpcProvider,
  wallet?: string | ethers.JsonRpcSigner,
  args?: string,
  contractName?: string,
  contractAddress?: string,
}) {
  const { error, transactionHash, provider, type, method, wallet, args } = data;
  let code: BlockchainErrorCode = BlockchainErrorCode.UNKNOWN_ERROR;

  if (typeof error === 'object') {
    if (error.code === -32700) code = BlockchainErrorCode.INVALID_JSON_WAS_RECEIVED_BY_THE_SERVER;
    else if (error.code === -32600) code = BlockchainErrorCode.INVALID_PAYLOAD_REQUEST;
    else if (error.code === -32601) code = BlockchainErrorCode.METHOD_DOES_NOT_EXISTED_OR_NOT_AVAILABLE;
    else if (error.code === -32602) code = BlockchainErrorCode.INVALID_METHOD_PARAMETERS;
    else if (error.code === -32603) code = BlockchainErrorCode.INVALID_JSON_RPC_ERROR;
    else if (error.code === -32000) code = BlockchainErrorCode.INVALID_INPUT;
    else if (error.code === -32001) code = BlockchainErrorCode.RESOURCE_NOT_FOUND;
    else if (error.code === -32002) code = BlockchainErrorCode.RESOURCE_UNAVAILABLE;
    else if (error.code === -32003) code = BlockchainErrorCode.TRANSACTION_REJECTED;
    else if (error.code === -32004) code = BlockchainErrorCode.METHOD_NOT_SUPPORTED;
    else if (error.code === -32005) code = BlockchainErrorCode.REQUEST_LIMIT_EXCEEDED;
    else if (error.code === 4001) code = BlockchainErrorCode.USER_REJECTED;
    else if (error.code === 4100) code = BlockchainErrorCode.THE_REQUEST_ACCOUNT_OR_METHOD_HAS_NOT_BEEN_AUTHORIZED;
    else if (error.code === 4200) code = BlockchainErrorCode.THE_REQUEST_METHOD_IS_NOT_SUPPORTED_BY_THIS_ETHEREUM_PROVIDER;
    else if (error.code === 4900) code = BlockchainErrorCode.THE_PROVIDER_IS_DISCONNECTED_FROM_ALL_CHAINS;
    else if (error.code === 4901) code = BlockchainErrorCode.THE_PROVIDER_IS_DISCONNECTED_FROM_THE_SPECIFIED_CHAIN;
    else if (`${error.message}`.indexOf("not mined within 50 blocks") >= 0) code = BlockchainErrorCode.TRANSACTION_TIME_OUT;
    else if (`${error.message}`.indexOf("insufficient funds for gas * price + value") >= 0) code = BlockchainErrorCode.NOT_ENOUGH_BALANCE_FOR_GAS_FEE;
    else if (`${error.message}`.indexOf("Transaction has been reverted by the EVM") >= 0) code = BlockchainErrorCode.TRANSACTION_REVERTED_BY_THE_EVM;
    else if (`${error.message}`.indexOf("Transaction underpriced") >= 0) code = BlockchainErrorCode.TRANSACTION_UNDER_PRICED;
    else if (`${error.message}`.indexOf("nonce too low") >= 0) code = BlockchainErrorCode.NONCE_TOO_LOW;
    else if (
      `${error.message}`.indexOf("trouble connecting to the network") >= 0
      || `${error.message}`.indexOf("timeout") >= 0
      || `${error.message}`.indexOf("CONNECTION ERROR") >= 0
      || `${error.message}`.indexOf("Too Many Requests") >= 0
      || `${error.message}`.indexOf("limit exceeded") >= 0
      || `${error.message}`.indexOf("more requests than are allowed") >= 0
      || `${error.message}`.indexOf("Invalid JSON RPC response") >= 0
    ) {
      code = BlockchainErrorCode.AR_CANNOT_CONNECT_RPC_URL;
    }
  }

  let message = '';
  let transaction: Transaction | undefined = undefined;

  try {
    const errorStr = `${error}`;

    // Parse error from metamask
    const errorStringtify = errorStr.slice(errorStr.indexOf('{'), errorStr.lastIndexOf('}') + 1).trim();
    if (errorStringtify) {
      const errorObj = JSON.parse(errorStringtify);
      if (errorObj.message) message = `${errorObj.message}`.replace("execution reverted:", "").trim();
      if (errorObj.transactionHash) transaction = errorObj;
    } else {
      // Parse string error
      if (errorStr.indexOf("execution reverted:") !== -1) {
        const strCut = 'execution reverted:';
        message = errorStr.slice(errorStr.indexOf(strCut), errorStr.length).replace(strCut, '').trim();
      } else if (errorStr.indexOf("Returned error:") !== -1) {
        const strCut = 'Returned error:';
        message = errorStr.slice(errorStr.indexOf(strCut), errorStr.length).replace(strCut, '').trim();
      } else {
        message = errorStr;
      }
    }
  } catch (parseError) {
    console.error(`Error > parseBlockchainError`, `${error}`, parseError);
  }

  let providerInfo = 'Unknown';

  if (provider) {
    try {
      if (provider instanceof ethers.BrowserProvider) {
        providerInfo = 'Metamask';
      } else if (provider instanceof ethers.JsonRpcProvider) {
        const host = provider._getConnection().url;
        providerInfo = `HttpProvider > ${host}`;
      }
    } catch (error) {
      providerInfo = `Unknown ${JSON.stringify(error)}`;
    }
  }

  return new BlockchainError({
    error,
    code,
    transactionHash,
    transaction,
    provider: providerInfo,
    type,
    method,
    wallet,
    args,
    message,
    contractAddress: data.contractAddress,
    contractName: data.contractName,
  });
}

export const onBlockChainError = (e: any) => {
  throw parseBlockchainError(e);
}

export function randomInt(min: number, max: number) {
  if (min === max) return min;
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getBalanceOfEth = (chainId: ChainId, wallet: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const chain = chains.find(v => v.chainId === chainId);
    if (!chain || !wallet || !ethers.getAddress(wallet)) return resolve(0);
    let rpcURL = '';

    const action = async () => {
      if (!rpcURL) rpcURL = chain.rpcURLs[0];
      else rpcURL = chain.rpcURLs.filter(v => v !== rpcURL)[randomInt(0, chain.rpcURLs.length - 2)];
      const provider = new ethers.JsonRpcProvider(rpcURL);

      await provider.getBalance(wallet)
        .then((balance) => {
          resolve(+ethers.formatEther(balance));
        })
        .catch((error) => {
          const e = parseBlockchainError({ error, method: `provider.getBalance(${wallet})`, type: 'READ', provider });
          if (e.code === BlockchainErrorCode.AR_CANNOT_CONNECT_RPC_URL) {
            action();
          } else {
            reject(e);
          }
        })
    }

    action();
  })
}

export function getAvailableWeb3(chainId: ChainId, ignoreRpcUrl?: string): Promise<{provider: ethers.BrowserProvider | ethers.JsonRpcProvider, rpc: string}> {
  const maxLoop = 30;
  let currentLoop = 0;

  let rpcUrlUsed = ignoreRpcUrl || '';
  const rpcURLs = (chains.find(v => v.chainId === chainId)?.rpcURLs || []);
  if (!rpcURLs.length) throw new BlockchainError({ code: BlockchainErrorCode.CHAIN_NOT_SUPPORTED });

  return new Promise((resolve, reject) => {
    const action =async () => {
      let availableRpcUrls = rpcURLs.filter(v => v !== rpcUrlUsed);
      rpcUrlUsed = availableRpcUrls[randomInt(0, availableRpcUrls.length - 1)];

      const provider = new ethers.JsonRpcProvider(rpcUrlUsed);
      await provider.getBlockNumber()
        .then(() => resolve({provider, rpc: rpcUrlUsed}))
        .catch(() => {
            if (currentLoop >= maxLoop) reject(new BlockchainError({ code: BlockchainErrorCode.CANNOT_CONNECT_RPC_URL }))

            currentLoop += 1;
            action();
          })
    }
    action();
  })
}

//Transform logs into events
export function parseEvent(abi: any[], address: string, receipt: TransactionReceipt | any) {
  try {
    console.log("abi: ", abi)
    let events: any[] = []

    if (receipt.logs) {
      // debug('Parsing logs into events')

      receipt.events = {}

      receipt.logs.forEach(function (log: any) {
        log.returnValues = {}
        log.signature = null
        log.raw = {
          data: log.data,
          topics: log.topics
        }
        delete log.data
        delete log.topics

        const eventNumber = log.index
        receipt.events[eventNumber] = log
      })

      delete receipt.logs
    }

    // debug('Parsing contract events')
    Object.keys(receipt.events).forEach(function (n) {
      const event = receipt.events[n]

      //Check if event is of smart contract
      if (ethers.getAddress(event.address)
        !== ethers.getAddress(address) || event.signature) {
        return
      }

      console.log("evnt: ", event)
      const descriptor = abi
        .filter(desc => desc.type === 'event')
        .map(desc => ({
          ...desc,
          signature: ethers.id(getEventSignature(desc.name, abi))
        }))
        .find(desc => {
          return desc.signature === event.raw.topics[0];
        })
      
        // console.log("description: ", descriptor)
      if (descriptor) {
        event.event = descriptor.name
        event.signature = descriptor.signature
        event.returnValues = web3EthAbi.decodeLog(
          descriptor.inputs,
          event.raw.data,
          event.raw.topics.slice(1)
        )

        // delete event.returnValues.__length__
        events.push(event)
      }

      delete receipt.events[n]
    })

    let count = 0
    events.forEach(function (ev) {
      if (ev.event) {
        if (receipt.events[ev.event]) {
          if (Array.isArray(receipt.events[ev.event])) {
            receipt.events[ev.event].push(ev)
          } else {
            receipt.events[ev.event] = [receipt.events[ev.event], ev]
          }
        } else {
          receipt.events[ev.event] = ev
        }
      } else {
        receipt.events[count] = ev
        count++
      }
    })

    return receipt as Transaction
  } catch (error) {
    // ======================= Start log =======================
    console.warn("======================= Parse receipt error =======================");
    console.warn("Address: ", address);
    console.warn("ABI: ", JSON.stringify(abi));
    console.warn("Receipt: ", JSON.stringify(receipt));
    console.warn("Error: ", error);
    console.warn("======================= End Parse receipt error =======================\n");
    throw Error(`Parse receipt error`);
  }
}

export function isURL(str: string) {
  var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
}

export async function getNameOfContract(chainId: ChainId, address: string) {
  const contract = new Contract({ chainId, address, abi: ERC721_ABI, name: 'GET_NAME' })
  return contract.call({ method: 'name' })
    .catch(() => '');
}

export function getAccount(privateKey: string): ethers.Wallet {
  const provider = new ethers.JsonRpcProvider(chainBscTestnet.rpcURLs[0]);
  return new ethers.Wallet(privateKey, provider);
}

export const getEvents = async (params: { chainId: ChainId, transactionHash: string, abi?: any[] }) => {
  const events: TransactionEventParsed[] = [];
  const { provider } = await getAvailableWeb3(params.chainId);
  
  const receipt = await provider.getTransactionReceipt(params.transactionHash);
  if (!receipt) throw new BlockchainError({ code: BlockchainErrorCode.CANNOT_FIND_RECEIPT });

  // Specific ABI
  receipt.logs.map((log) => {
    if (params.abi) {
      const [descriptor] = params.abi
        .filter(v => {
          if (v.type !== 'event') return false;
          const sign = ethers.id(v.name + '(' + v.inputs.map((input: any) => input.type).join(',') + ')');
          return log.topics[0] === sign;
        })

      if (descriptor) {
        try {
          events.push({
            address: log.address,
            logIndex: log.index,
            event: descriptor.name!,
            returnValues: ethers.AbiCoder.defaultAbiCoder().decode(descriptor.inputs || [], log.data)
          });
        } catch (error) {
          console.error('error', error);
        }
      }
    }
  })

  // ERC-20
  receipt.logs
    .filter(v => !events.find(k => k.logIndex === v.index))
    .map((log) => {
      const [descriptor] = ERC20_ABI
        .filter(v => {
          if (v.type !== 'event') return false;
          const sign = ethers.id(v.name + '(' + v.inputs.map(input => input.type).join(',') + ')');
          return log.topics[0] === sign;
        })

      if (descriptor && descriptor.inputs) {
        const formattedInputs = descriptor.inputs.map(param => param.type);

        try {
          events.push({
            address: log.address,
            interface: "ERC20",
            logIndex: log.index,
            event: descriptor.name!,
            returnValues: ethers.AbiCoder.defaultAbiCoder().decode(formattedInputs || [], log.data)
          });
        } catch (error) {
          console.error('error', error);
        }
      }
    })

  // ERC-721
  receipt.logs
    .filter(v => !events.find(k => k.logIndex === v.index))
    .map((log) => {
      const [descriptor] = ERC721_ABI
        .filter(v => {
          if (v.type !== 'event') return false;
          const sign = ethers.id(v.name + '(' + v.inputs.map(input => input.type).join(',') + ')');
          return log.topics[0] === sign;
        })

      if (descriptor && descriptor.inputs) {
        const formattedInputs = descriptor.inputs.map(param => param.type);

        try {
          events.push({
            address: log.address,
            interface: 'ERC721',
            logIndex: log.index,
            event: descriptor.name!,
            returnValues: ethers.AbiCoder.defaultAbiCoder().decode(formattedInputs || [], log.data)
          });
        } catch (error) {
          console.error('error', error);
        }
      }
    })

  return events.sort((a, b) => a.logIndex - b.logIndex);
}

export const getEventSignature = (eventName: string, abi: any) => {
  const eventAbi = abi.find((entry: any) => entry.name === eventName);
  const types = eventAbi.inputs.map((input: any) => input.type);
  return `${eventName}(${types.join(',')})`;
}