import { coinBalancesReducer } from "@/reducers/coins.reducer";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";

//combine many reducers into one reducer
const reducer = combineReducers({
  coinBalances: coinBalancesReducer,
})

export const store = configureStore({reducer, devTools: true})

export type StoreState = ReturnType<typeof reducer>
export const useSelector: TypedUseSelectorHook<StoreState> = useReduxSelector

export type StoreAction = {
  type: string,
  [name: string]: any
}