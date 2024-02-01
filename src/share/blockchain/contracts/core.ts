import { BlockchainError, BlockchainErrorCode, Chain, ChainId, ContractCallOptions, ContractConfigs, ContractEstimateGas, ContractSendOptions, Provider, TokenUnit, Transaction } from "../types";
import { Log, TransactionReceipt, ethers } from "ethers";
import { chains } from "../chain";
import { getAvailableWeb3, getEventSignature, parseBlockchainError, parseEvent, randomInt, wait } from "../utils";

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

        return read(...(options.args || args))
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
      ? new ethers.BrowserProvider(this.provider)
      : await getAvailableWeb3(this.chain.chainId).then(r => r.provider);
  }

  async getWalletSelected() {
    if (this.wallet) return this.wallet;
    const provider = await this.getWeb3();
    this.wallet = await provider.listAccounts().then((res) => res[0].address);
    if (!this.wallet) throw new BlockchainError({ 
      code: BlockchainErrorCode.MUST_BE_CONNECT_WALLET
    })
    return this.wallet;
  }

  //update contract's provider, wallet,...
  async _beforeSend(options?: { privateKey?: string }): Promise<any> {
    if (!this.address) throw new BlockchainError({ code: BlockchainErrorCode.CONTRACT_NOT_DEPLOYED_YET });

    const provider = await this.getWeb3();
    // console.log('provider: ', provider)
    if (!this.wallet) this.wallet = await provider.listAccounts().then((res) => res[0].address);

    let wallet = this.wallet;
    if (options && options.privateKey) {
      const account = new ethers.Wallet(options.privateKey);
      wallet = account?.address;
    }

    if (!wallet || (!provider && !options?.privateKey)) throw new BlockchainError({
      code: BlockchainErrorCode.MUST_BE_CONNECT_WALLET,
    });

    const signer = (await provider.getSigner());
    const contract = new ethers.Contract(this.address, this.abi, signer);

    return { provider, wallet, contract, signer }
  }

  async estimateGas(options: ContractSendOptions, ...args: any): Promise<ContractEstimateGas> {
    if (!this.address) throw new BlockchainError({ code: BlockchainErrorCode.CONTRACT_NOT_DEPLOYED_YET });
    const prepare = await this._beforeSend(options);

    const func = prepare.contract[options.method] as any;
    if (typeof func !== 'function') throw new BlockchainError({
      code: BlockchainErrorCode.INVALID_METHOD_PARAMETERS,
      type: "WRITE",
      method: options.method,
      args,
    })

    return new Promise((resolve, reject) => {
      const action = async () => {
        try {
          // let gasPrice = +(await prepare.provider.getFeeData()).gasPrice;

          // console.log("gas price:", gasPrice)


          // let gasLimit = await prepare.contract.mintCollection.estimateGas(
          //   ...(options.args) || args,
          //   { ...options.params });

          // const rateGas = options.rateGas || this.rateGas || 1;
          // gasLimit = gasLimit * rateGas;

          // const rateGasPrice = options.rateGasPrice || this.rateGasPrice || 1;
          // gasPrice = gasPrice * rateGasPrice;

          //console.log("gas limit:", gasLimit)

          const response: ContractEstimateGas = {
            ...prepare,
            //gasPrice: Number(50000000),
            // fee: +ethers.formatEther((Number(gasPrice * gasLimit)).toString()),
            // feeInWei: (Number(gasPrice * gasLimit)).toString(),
            //gasLimit: gasLimit,
            func,
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

  async send(options: ContractSendOptions, ...args: any): Promise<any> {
    const estimateGas = options.estimateGas || await this.estimateGas(options, ...args);
    const { provider, wallet, gasPrice, gasLimit, func } = estimateGas;
    let transactionHash: string;
    let isHasError = false;

    return new Promise(async (resolve, reject) => {

      const handleOnSubmitted = (transactionHashReceived: string) => {
        transactionHash = transactionHashReceived;
        if (options.onSubmitted && !isHasError) {
          options.onSubmitted(transactionHashReceived);
        }
      }

      try {
        const tx = await func(...(options.args || args), {
            from: wallet,
            ...options.params,
            gasPrice: 23000,
            gasLimit: options.method === 'mintNft' ? 350000 : 200000,
        }) 
        const txReceipt = await tx.wait(1);
        handleOnSubmitted(txReceipt.hash);
        //If have the utilization of transaction in the future
        if (this.captureTransaction) this.captureTransaction(txReceipt);
        
        resolve(txReceipt);
      } catch (error) {
        const e = parseBlockchainError({ type: 'WRITE', error, provider, transactionHash, method: options.method, wallet, args });
          isHasError = true;
          reject(e);
      }
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