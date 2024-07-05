import { RequestModule } from "../request/request";
import { ReportEntityPayload, ReportQuery, ReportStatus, ReportUpdatePayload } from "./types";

export class ReportModule {
  static async getListReports(query: ReportQuery) {
    return RequestModule.get(`/api/v1/reports`, query);
  }

  static async create(payload: ReportEntityPayload) {
    return RequestModule.post(`/api/v1/reports`, payload);
  }

  static async update(id: string, payload: ReportUpdatePayload) {
    return RequestModule.patch(`/api/v1/reports/${id}`, payload);
  }

  static getNameOfStatus(status: ReportStatus | string): string {
    if (status === ReportStatus.ISPENDING) return "Đang chờ";
    if (status === ReportStatus.NORMAL) return "Không vi phạm";
    if (status === ReportStatus.VIOLATED) return "Vi phạm";

    return "";
  }
}