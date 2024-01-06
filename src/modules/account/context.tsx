import { FC, PropsWithChildren, createContext, useState } from "react";
import { AccountContext, AccountInformation } from "./types";
import { UserInformation } from "../user/types";
import { useBlockChain } from "@/share/blockchain/context";


const accountContext = createContext<AccountContext>({} as any);

export let getAccount: () => UserInformation | undefined = () => undefined;
export let getWallet: () => string | undefined = () => undefined;

export const AccountProvider: FC<PropsWithChildren> = (props) => {
  const blockchain = useBlockChain();
  const [isInitialized, serIsInitialized] = useState(false);
  const [information, setInformation] = useState<AccountInformation | undefined>(undefined);
  const wallet = information?.wallet;

  getAccount = () => information;
  getWallet = () => wallet;

  const authenticate = async () => {
    try {

    } catch (error) {
      throw error;
    }
  }
}