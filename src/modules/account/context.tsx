import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { AccountContext, AccountInformation, SignIn, SignOut } from "./types";
import { UserInformation, UserSignInPayload, UserSignInResponse } from "../user/types";
import { useBlockChain } from "@/share/blockchain/context";
import { AccountAccessToken } from "./acess-token";
import { UserModule } from "../user/modules";
import { ethers } from "ethers";
import { OnErrorModal, onError } from "@/components/modals/modal-error";
import * as EthereumjsUtil from "ethereumjs-util";
import { CoinsModule } from "../coins/modules";


const accountContext = createContext<AccountContext>({} as any);

export let getAccount: () => UserInformation | undefined = () => undefined;
export let getWallet: () => string | undefined = () => undefined;

export const AccountProvider: FC<PropsWithChildren> = (props) => {
  const blockchain = useBlockChain();
  const [isInitialized, setIsInitialized] = useState(false);
  const [information, setInformation] = useState<AccountInformation | undefined>(undefined);
  // const wallet = information?.wallet;

  getAccount = () => information;
  getWallet = () => information.wallet;

  const authenticate = async () => {
    try {
      setInformation(undefined);
      const accessToken = await AccountAccessToken.get(blockchain.wallet);

      if (accessToken) {
        const res = await UserModule.authenticate();
        setInformation(s => ({ ...s, ...res.data[0]}))
      }
      setIsInitialized(true);
    } catch (error) {
      throw error;
    }
  }

  const signIn: SignIn = async (providerType) => {
    try {
      if (!blockchain.provider) throw onError("Please install Metamask extension");

      let wallet = blockchain.wallet;
      if (!wallet) {
        wallet = (await blockchain.connectWallet(providerType)).wallet;
      }

      const signature = await blockchain.provider.request({
        method: 'personal_sign',
        params: ['Sign in to BlockClip', wallet]
      });

      const payload: UserSignInPayload = {
        wallet,
        signature,
      }

      const response = await UserModule.signInWithMetamask(payload);

      if (response) {
        await AccountAccessToken.save(response.auth_token);
        setInformation(s => ({ ...s, ...response.data }));
      }

      return response.data;
    } catch (error) {
      onError(error);
      throw error;
    }
  }

  const signOut: SignOut = async () => {
    if (blockchain.wallet) {
      //remove from cross-storage
      AccountAccessToken.removeByWallet(blockchain.wallet);
    }
    setInformation(undefined);
  }

  const fetchBalances = async () => {
    try {
      const balances = await Promise.all([
        CoinsModule.fetchUserBalance()
      ]);

      console.log("balances: ", balances);
    } catch (error) {
      console.error(error);
    }
  }

  const isSigned = !!information;
  const isDappConnected = !!blockchain.wallet;
  const isReady = isSigned && isDappConnected;

  useEffect(() => {
    if (blockchain.isInitialized) {
      //check if user have connected before
      if (blockchain.wallet) {
        authenticate();
        fetchBalances();
      }
      else {
        setInformation(undefined)
        setIsInitialized(true)
      }
    }
  }, [blockchain.isInitialized, blockchain.wallet])

  const context: AccountContext = {
    signIn,
    signOut,
    isInitialized,
    information,
    isDappConnected,
    isReady,
    isSigned
  }

  return <accountContext.Provider value={context}>
    {props.children}
  </accountContext.Provider>
}

export const useAccount = () => useContext(accountContext);