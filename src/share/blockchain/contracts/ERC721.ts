import ERC721_ABI from '../abis/ERC721.json';
import { Contract } from "./core";
import { ContractConfigs } from "../types";
import { ethers } from 'ethers';

export class ContractERC721 extends Contract {
  constructor(configs: ContractConfigs) {
    super({ ...configs, abi: ERC721_ABI });
  }

  async tokenURI(tokenId: string) {
    return this.call({ method: 'tokenURI', args: [tokenId] })
  }

  async balanceOf(owner: string) {
    return this.call({ method: "balanceOf", args: [owner] })
      .then((res) => +res)
  }

  async ownerOf(tokenId: string) {
    return this.call({ method: 'ownerOf', args: [tokenId] })
      .then((res) => ethers.getAddress(res))
  }

  async transferFrom(params: { from: string, to: string, tokenId: string }) {
    const { from, to, tokenId } = params;
    return this.send({ method: 'safeTransferFrom', args: [from, to, tokenId, ethers.hexlify("")] });
  }

  async isApproved(params: { tokenId: string, operator: string }) {
    const { tokenId, operator } = params;
    const owner = await this.ownerOf(tokenId);
    const isApprovedForAll = await this.call({ method: 'isApprovedForAll', args: [owner, operator] })
    if (isApprovedForAll) return true;

    const addressApproved = await this.call({ method: 'getApproved', args: [tokenId] })
    return ethers.getAddress(addressApproved) === ethers.getAddress(operator);
  }

  async revokeApproval(params: { operator: string }) {
    return this.send({ method: 'setApprovalForAll', args: [params.operator, false] });
  }

  async approve(params: { operator: string, tokenId?: string }) {
    const { tokenId, operator } = params;
    await this._beforeSend();

    if (tokenId) {
      const isApproved = await this.isApproved({ tokenId, operator });
      if (isApproved) return true;
    }

    const isApprovedForAll = await this.call({ method: 'isApprovedForAll', args: [this.wallet!, operator] })
    if (isApprovedForAll) return true;

    return this.send({ method: 'setApprovalForAll', args: [operator, true] });
  }
}