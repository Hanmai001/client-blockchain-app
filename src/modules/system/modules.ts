import { ethers } from "ethers";
import { getContracts } from "../configs/context";

export class SystemModule {
  static async getInfoSystem() {
    const contractMarket = getContracts().ercs.MARKETPLACE;
    const feeMint = await contractMarket.call({ method: 'getFeeMint' });
    const feeRate = await contractMarket.call({ method: 'getFeeRate' });
    const mintAddress = await contractMarket.call({ method: 'getMintAddress' });
    const receiverAddress = await contractMarket.call({ method: 'getReceiverAddress' });
    return {
      feeMint: ethers.formatEther(feeMint),
      feeRate: feeRate.toString(),
      mintAddress,
      receiverAddress
    }
  }

  static async updateMintAddress(address: string) {
    const contractMarket = getContracts().ercs.MARKETPLACE;
    await contractMarket.send({
      method: 'setMintAddress',
      args: [address],
    });
  }

  static async updateReceiverAddress(address: string) {
    const contractMarket = getContracts().ercs.MARKETPLACE;
    await contractMarket.send({
      method: 'setReceiver',
      args: [address],
    });
  }

  static async updateFeeMint(feeMint: string) {
    const contractMarket = getContracts().ercs.MARKETPLACE;
    await contractMarket.send({
      method: 'updateFeeMint',
      args: [ethers.parseEther(feeMint).toString()],
    });
  }

  static async updateFeeRate(feeRate: string) {
    const contractMarket = getContracts().ercs.MARKETPLACE;
    await contractMarket.send({
      method: 'updateFeeRate',
      args: [feeRate],
    });
  }
}