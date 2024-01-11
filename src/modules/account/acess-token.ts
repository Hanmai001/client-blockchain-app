import { getWallet } from "@/share/blockchain/context";
import { CrossStorageModule } from "../cross-storage/modules";
import { CrossStorageKey } from "../cross-storage/types";
import { decodeJwt } from 'jose';

export class AccountAccessToken {
  static async getList() {
    const str = await CrossStorageModule.get(CrossStorageKey.USER_ACCESS_TOKENS);
    const listTokens = (str || '').split(',').filter(v => !!v);
    return listTokens;
  }

  static async save(accessToken: string) {
    let listTokens = await this.getList();
    listTokens = [accessToken, ...listTokens];
    const maxLength = 10;
    if (listTokens.length > maxLength) listTokens = listTokens.slice(0, maxLength);
    await CrossStorageModule.set(CrossStorageKey.USER_ACCESS_TOKENS, listTokens.toString());
  }

  static async remove(accessToken: string) {
    const temp = await this.getList();
    let listTokens = [accessToken, ...temp]
    listTokens = listTokens.filter((v) => v.toLowerCase() !== accessToken.toLowerCase())
    await CrossStorageModule.set(CrossStorageKey.USER_ACCESS_TOKENS, listTokens.toString())
  }

  static async removeByWallet(wallet: string) {
    const token = await this.get(wallet)
    if (token) this.remove(token)
  }

  static async removeAll() {
    await CrossStorageModule.del(CrossStorageKey.USER_ACCESS_TOKENS)
  }

  static async get(wallet?: string) {
    try {
      const walletAddress = wallet || getWallet();
      if (!walletAddress) return;
      const listTokens = await this.getList();
      console.log("listTokens: ", listTokens);
      
      //Find accessToken in list tokens from Cross-storage
      const token = listTokens.find((token) => {
        try {
          const tokenPayload = decodeJwt(token) as any;
          console.log("Token decoded: ", tokenPayload)
          return tokenPayload.userWallet.toLowerCase() === walletAddress.toLowerCase()
        } catch (error) {
          return false
        }
      })
      return token
    } catch (error) {
      console.error(error)
      return undefined
    }
  }
}