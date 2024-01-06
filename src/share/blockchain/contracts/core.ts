import { BlockchainError, BlockchainErrorCode, Chain, ChainId, ContractCallOptions, ContractConfigs, ContractEstimateGas, ContractSendOptions, Provider, TokenUnit, Transaction } from "../types";
import { TransactionReceipt, ethers } from "ethers";
import { chains } from "../chain";
import { getAvailableWeb3, parseBlockchainError, parseEvent, randomInt, wait } from "../utils";

export class Contract {
  name: string;
  address: string;
  chain: Chain;
  abi: any[];
  provider?: Provider;
  wallet?: string | ethers.JsonRpcSigner;
  rpcUrlUsed: string;
  rateGas?: number;
  rateGasPrice?: number;
  tokenUnit?: TokenUnit;
  captureTransaction?: (transaction: Transaction) => any;

  constructor(configs: ContractConfigs) {
    this.name = configs.name || 'Contract';
    this.address = configs.address ? ethers.getAddress(configs.address) : '';
    this.provider = configs.provider;
    this.abi = configs.abi!;
    this.rpcUrlUsed = '';
    this.chain = chains.find(v => v.chainId === configs.chainId)!;

    const defaultConfig = typeof window !== 'undefined' ? (window as any).blockchainConfig : undefined;

    this.rateGas = configs.rateGas || defaultConfig?.rateGas;
    this.rateGasPrice = configs.rateGasPrice || defaultConfig?.rateGasPrice;
    this.captureTransaction = configs.captureTransaction || defaultConfig?.captureTransaction;

    if (!this.chain) throw Error(`Chain with id ${configs.chainId} is not supported!`);
    if (configs.wallet) this.wallet = ethers.getAddress(configs.wallet);
  }

  async call(options: ContractCallOptions, ...args: any): Promise<any> {
    if (!this.address) throw new BlockchainError({code: BlockchainErrorCode.CONTRACT_NOT_DEPLOYED_YET});

    const retryTime = typeof options.retryTime === 'number' ? options.retryTime : 10;
    let retriedTime = 0;

    return new Promise(async (resolve, reject) => {
      try {
        const action = () => {
          let rpcURLs = this.chain.rpcURLs.filter(v => v !== this.rpcUrlUsed);
        this.rpcUrlUsed = rpcURLs[randomInt(0, rpcURLs.length - 1)];

        const provider = new ethers.JsonRpcProvider(this.rpcUrlUsed);
        const contract = new ethers.Contract(this.address, this.abi, provider);

        const read = contract[options.method] as any;
        if (typeof read !== 'function') return reject(new BlockchainError({
            code: BlockchainErrorCode.INVALID_METHOD_PARAMETERS,
            type: "READ",
            method: options.method,
            args,
          }))

        return read(...(options.args || args)).call()
            .then((res: any) => resolve(res))
            .catch((error: any) => {
              const e = parseBlockchainError({
                type: 'READ', 
                error,
                provider,
                method: options.method,
                wallet: this.wallet,
                args,
                contractName: this.name,
                contractAddress: this.address,
              });

              if (e.code === BlockchainErrorCode.AR_CANNOT_CONNECT_RPC_URL) {
                action();
              } else if (retryTime > 0 && retriedTime < retryTime) {
                retriedTime += 1;
                setTimeout(action, 2000);
              } else {
                reject(e);
              }
            })
        }
        action();
      } catch (error) {
        throw error;
      }
    })
  }

  async getWeb3() {
    return this.provider
      ? new ethers.JsonRpcProvider(this.provider)
      : await getAvailableWeb3(this.chain.chainId).then(r => r.provider);
  }

  async getWalletSelected() {
    if (this.wallet) return this.wallet;
    const provider = await this.getWeb3();
    this.wallet = await provider.listAccounts().then((res) => res[0]);
    if (!this.wallet) throw new BlockchainError({ 
      code: BlockchainErrorCode.MUST_BE_CONNECT_WALLET
    })
    return this.wallet;
  }

  async _beforeSend(options?: { privateKey?: string }): Promise<any> {
    if (!this.address) throw new BlockchainError({ code: BlockchainErrorCode.CONTRACT_NOT_DEPLOYED_YET });

    const provider = await this.getWeb3();
    if (!this.wallet) this.wallet = await provider.listAccounts().then((res) => res[0]);

    let wallet = this.wallet;
    if (options && options.privateKey) {
      const account = new ethers.Wallet(options.privateKey);
      wallet = account?.address;
    }

    if (!wallet || (!this.provider && !options?.privateKey)) throw new BlockchainError({
      code: BlockchainErrorCode.MUST_BE_CONNECT_WALLET,
    });

    const contract = new ethers.Contract(this.address, this.abi);

    return { provider, wallet, contract }
  }

  async estimateGas(options: ContractSendOptions, ...args: any): Promise<ContractEstimateGas> {
    if (!this.address) throw new BlockchainError({ code: BlockchainErrorCode.CONTRACT_NOT_DEPLOYED_YET });

    const prepare = await this._beforeSend(options);
    const send = prepare.contract[options.method] as any;
    if (typeof send !== 'function') throw new BlockchainError({
      code: BlockchainErrorCode.INVALID_METHOD_PARAMETERS,
      type: "WRITE",
      method: options.method,
      args,
    })

    return new Promise((resolve, reject) => {
      const action = async () => {
        try {
          let gasPrice = +(await prepare.provider.getFeeData()).gasPrice;
          let gasLimit = await send(...(options.args || args))
            .estimateGas({ from: prepare.wallet, ...options.params })
            .then((res: any) => +res)

          const rateGas = options.rateGas || this.rateGas || 1;
          gasLimit = gasLimit * rateGas;

          const rateGasPrice = options.rateGasPrice || this.rateGasPrice || 1;
          gasPrice = gasPrice * rateGasPrice;

          const response: ContractEstimateGas = {
            ...prepare,
            gasPrice: Number(gasPrice),
            fee: +ethers.formatEther((Number(gasPrice * gasLimit)).toString()),
            feeInWei: (Number(gasPrice * gasLimit)).toString(),
            gasLimit: Number(gasLimit),
            send,
          }

          resolve(response);
        } catch (error) {
          const e = parseBlockchainError({
            type: 'READ', method: 'estimateGas', error,
            provider: prepare.provider,
            contractName: this.name,
            contractAddress: this.address,
            wallet: this.wallet
          });
          if (e.code === BlockchainErrorCode.AR_CANNOT_CONNECT_RPC_URL) 
            action();
          else 
            reject(e);
        }
      }

      action();
    })
  }

  async send(options: ContractSendOptions, ...args: any): Promise<Transaction> {
    const estimateGas = options.estimateGas || await this.estimateGas(options, ...args);
    const { provider, wallet, gasPrice, gasLimit, func } = estimateGas;

    let isHasError = false;

    return new Promise(async (resolve, reject) => {
      let transactionHash: string;

      const handleOnSubmitted = (transactionHashReceived: string) => {
        transactionHash = transactionHashReceived;
        if (options.onSubmitted && !isHasError) {
          options.onSubmitted(transactionHashReceived);
        }
      }

      func(...(options.args || args))
        .send({
          from: wallet,
          gas: gasLimit.toString(),
          gasPrice: gasPrice,
          ...options.params,
        })
        .on('transactionHash', function (transactionHashReceived: any) {
          handleOnSubmitted(transactionHashReceived);
        })
        .then(async (res: any) => {
          if (options.delayInSeconds) await wait(options.delayInSeconds * 1000);
          else await wait(1000);
          if (this.captureTransaction) this.captureTransaction(res);
          resolve(res);
        })
        .catch((error: any) => {
          const e = parseBlockchainError({ type: 'WRITE', error, provider, transactionHash, method: options.method, wallet, args });
          isHasError = true;
          reject(e);
        })
    })
  }

  async getName() {
    return this.call({ method: 'name' }).catch(() => '');
  }

  async parseTransaction(transactionData: string | any, receiptData?: TransactionReceipt): Promise<Transaction> {
    const provider = await this.getWeb3();
    const transactionHash = typeof transactionData === 'string' ? transactionData : transactionData.hash;
    const [transaction, receipt] = await Promise.all([
      (async () => {
        if (typeof transactionData === 'string') return provider.getTransaction(transactionHash);
        return transactionData;
      })(),
      (async () => {
        if (receiptData) return receiptData;
        return provider.getTransactionReceipt(transactionHash);
      })(),
    ]);

    const data = parseEvent(this.abi, this.address, receipt);

    return {
      ...transaction,
      ...receipt,
      ...data,
      from: ethers.getAddress(transaction.from),
      to: transaction.to ? ethers.getAddress(transaction.to) || '' : '',
    } as any
  }
}