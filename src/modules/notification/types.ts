import { Query } from "../../../types"

export enum NotificationType {
  BUY_TOKEN = '1',
  SUBSCRIBE_COLLECTION = '2',
  FRIEND_REQUEST = '3',
  OTHER = '4', //LIKE, SHARE, COMMENT, CANCEL/LIST ORDER
  REPORT = '5'
}

export interface NotificationStatus {
  isFetching?: boolean,
  notifications: Notification[],
  count: number
}

export interface NotificationPropsContext extends NotificationStatus {
  pushNotification: PushNotification,
  sendNotification: SendNotification,
  setActivePage: SetActivePage
}

export interface Notification {
  id: string,
  title: string,
  description: string,
  link: string,
  image: string,
  type: NotificationType,
  isRead: boolean,
  receiver: string,
  createdAt: Date,
  updatedAt: Date
}

export interface NotificationPayload {
  title: string,
  description: string,
  link: string,
  receiver: string,
  image: string,
  type: NotificationType,
  isRead: boolean,
}

export interface NotificationQuery extends Query {
  type?: NotificationType
}

export type PushNotification = (newNotification: Notification) => void;
export type SendNotification = (payload: NotificationPayload) => Promise<any>;
export type SetActivePage = () => void;