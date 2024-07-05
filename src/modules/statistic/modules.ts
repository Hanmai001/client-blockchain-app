import { ListLoadState } from "../../../types";
import { RequestModule } from "../request/request";
import { Statistic, StatisticQuery } from "./types";

export class StatisticModule {
  static async getUserStatistic(query: StatisticQuery): Promise<ListLoadState<Statistic, 'results'>> {
    return RequestModule.get(`/api/v1/statistics/user`, query)
  }
  static async getTokenStatistic(query: StatisticQuery): Promise<ListLoadState<Statistic, 'results'>> {
    return RequestModule.get(`/api/v1/statistics/token`, query)
  }
  static async getOrderRevenueStatistic(query: StatisticQuery): Promise<any> {
    const res = await RequestModule.get(`/api/v1/statistics/revenue`, query);
    return res.data.orderRevenue;
  }
  static async getPackageRevenueStatistic(query: StatisticQuery): Promise<any> {
    const res = await RequestModule.get(`/api/v1/statistics/revenue`, query);
    return res.data.packageRevenue;
  }
  static async getNewSubscriberStatistic(query: StatisticQuery): Promise<ListLoadState<Statistic, 'results'>> {
    return RequestModule.get(`/api/v1/statistics/newSubscriber`, query)
  }
}