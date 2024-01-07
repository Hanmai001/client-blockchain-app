import { RequestModule } from "../request/request";
import { UserInformation, UserSignInPayload, UserSignInResponse } from "./types";


export class UserModule {
  static availableUsers: { [wallet: string]: UserInformation } = {};

  static async getByWallet(wallet: string, isAvailable = false): Promise<UserInformation> {
    if (!wallet) throw Error("Wallet must be provided");
    if (isAvailable && this.availableUsers[wallet]) return this.availableUsers[wallet];
    const user = await RequestModule.get(``);
    this.availableUsers[wallet] = user;

    return user;
  }

  static async authenticate(): Promise<UserInformation> {
    return RequestModule.get(``);
  }

  static async signInWithMetamask(payload: UserSignInPayload): Promise<UserSignInResponse> {
    return RequestModule.post(``, payload)
  }
}