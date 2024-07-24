import { Query } from "../../../types";
import { RequestModule } from "../request/request";
import { CommentPayload } from "./types";

export class CommentModule {
  static async getCommentsOfToken(id: string, query?: Query) {
    return RequestModule.get(`/api/v1/tokens/comments/${id}`, query)
  }

  static async createComment(payload: CommentPayload) {
    return RequestModule.post(`/api/v1/tokens/comments`, payload)
  }
}