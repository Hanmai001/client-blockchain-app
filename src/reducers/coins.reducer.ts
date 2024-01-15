import { StoreAction } from "@/redux/store";
import { AppPayment, DataLoadState } from "../../types";


export type CoinBalances = {
  [key in AppPayment]: string
}

const defaultState: DataLoadState<CoinBalances> = {isFetching: true};

export const SET_USER_COIN_BALANCES = 'SET_USER_COIN_BALANCES';

export const coinBalancesReducer = (state = defaultState, action: StoreAction): DataLoadState<CoinBalances> => {
  const { type, data } = action;
  if (type === SET_USER_COIN_BALANCES) return { ...state, data, isFetching: false };
  return state;
}