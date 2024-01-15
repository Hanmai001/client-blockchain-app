import { AppPayment } from "../../../types";

export type CoinsType<T> = {
  [key in AppPayment]: T
}