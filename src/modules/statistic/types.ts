import { AppPayment } from "../../../types"

export enum StatisticType {
  MONTH='MONTH',
  YEAR='YEAR',
  DAY='DAY'
}

export interface Statistic {
  from: string,
  to: string,
  count: number
}

export interface StatisticQuery {
  type: StatisticType,
  from?: string,
  to?: string,
  payment?: AppPayment
}