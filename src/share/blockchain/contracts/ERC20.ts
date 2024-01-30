import { ethers } from 'ethers';
import ERC20_ABI from '../abis/ERC20.json';
import { ContractConfigs, TokenUnit } from '../types';
import { Contract } from "./core";

export let tokenUnits: { [ref: string]: TokenUnit } = {};

export class ContractERC20 extends Contract {
  constructor(configs: ContractConfigs) {
    super({ ...configs, abi: ERC20_ABI });
  }

  async symbol() {
    return this.call({ method: "symbol" })
  }

  async balanceOf(address: string) {
    return this.call({ method: "balanceOf", args: [address] })
      .then((res) => this.fromWei(res))
  }

  async allowance(params: { owner: string, operator: string }) {
    console.log(params);
    return this.call({ method: "allowance", args: [params.owner, params.operator] })
      .then((res) => this.fromWei(res))
  }

  async approve(params: { operator: string, amount: number }) {
    await this._beforeSend();
    
    //Check allowance[owner][operator]
    const allowance = await this.allowance({ owner: this.wallet!.toString(), operator: params.operator });
    console.log("allowance: ", allowance)
    if (params.amount <= allowance) return true;

    const amountInWei = await this.toWei(params.amount);
    //Approve for operator to transfer token-erc20
    return this.send({ method: 'approve', args: [params.operator, amountInWei] })
  }

  async transfer(params: { to: string, amount: number }) {
    const amountInWei = await this.toWei(params.amount);
    await this._beforeSend();
    return this.send({ method: 'transfer', args: [params.to, amountInWei] })
  }

  async fromWei(amount: string) {
    const tokenUnit = await this.getTokenUnit();
    return +ethers.formatUnits(amount, tokenUnit);
  }

  async toWei(amount: any) {
    const tokenUnit = await this.getTokenUnit();
    return ethers.parseUnits(amount.toString(), tokenUnit)
  }

  async decimals() {
    return this.call({ method: 'decimals' })
      .then((v) => +v)
  }

  async getTokenUnit() {
    if (this.tokenUnit) return this.tokenUnit;
    await this.decimals()
      .then((decimals) => {
        if (decimals === 18) this.tokenUnit = TokenUnit.ether;
        else if (decimals === 31) this.tokenUnit = TokenUnit.tether;
        else if (decimals === 25) this.tokenUnit = TokenUnit.mether;
        else if (decimals === 21) this.tokenUnit = TokenUnit.kether;
        else if (decimals === 15) this.tokenUnit = TokenUnit.finney;
        else if (decimals === 12) this.tokenUnit = TokenUnit.szabo;
        else if (decimals === 9) this.tokenUnit = TokenUnit.gwei;
        else if (decimals === 6) this.tokenUnit = TokenUnit.mwei;
        else if (decimals === 3) this.tokenUnit = TokenUnit.kwei;
        else this.tokenUnit = TokenUnit.ether;
      })
      .catch(() => {
        this.tokenUnit = TokenUnit.ether;
      })

    const ref = `${this.chain.chainId}-${this.address}`;
    tokenUnits[ref] = this.tokenUnit!;
    return this.tokenUnit!;
  }
}