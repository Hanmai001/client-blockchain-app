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

  static async authenticate(): Promise<{message?: string, data: UserInformation[]}> {
    return RequestModule.get(`/api/v1/users/details`);
  }

  static async signInWithMetamask(payload: UserSignInPayload): Promise<UserSignInResponse> {
    return RequestModule.post(`/api/v1/users/login`, payload)
  }
}