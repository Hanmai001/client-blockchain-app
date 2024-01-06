import { ProviderType } from "@/share/blockchain/types";
import { UserInformation } from "../user/types";

export interface AccountInformation extends UserInformation {
  isBlocked?: boolean
}

export interface AccountContext {
  isInitialized?: boolean,
  information?: AccountInformation,
  wallet?: string,
  signIn: SignIn,
  signOut: SignOut,
  isSigned: boolean,
  isDappConnected: boolean,
  isReady: boolean
}

export type SignIn = (type: ProviderType) => Promise<UserInformation>;
export type SignOut = () => void;