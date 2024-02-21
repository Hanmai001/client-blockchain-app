import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { NotificationPropsContext, NotificationStatus, NotificationType, Notification } from "./types";
import { useBlockChain } from "@/share/blockchain/context";

export const NotificationContext = createContext<any>({} as any);

const notificationsTest: Notification[] = [
  {
    id: "1",
    title: "Thông báo 1",
    description: "Nội dung thông báo 1",
    image: "url/to/image1.jpg",
    type: NotificationType.FRIEND_REQUEST,
    isRead: false,
    link: 'd',
    createdAt: new Date("2024-01-15T08:00:00Z"),
    updatedAt: new Date("2024-01-15T08:00:00Z")
  },
  {
    id: "2",
    title: "Thông báo 2",
    description: "Nội dung thông báo 2",
    image: "url/to/image2.jpg",
    link: 'd',
    type: NotificationType.BUY_TOKEN,
    isRead: true,
    createdAt: new Date("2024-01-14T10:30:00Z"),
    updatedAt: new Date("2024-01-14T10:30:00Z")
  },
  {
    id: "3",
    title: "Thông báo 3",
    description: "Nội dung thông báo 3",
    image: "url/to/image3.jpg",
    link: 'd',
    type: NotificationType.OTHER,
    isRead: false,
    createdAt: new Date("2024-01-13T15:45:00Z"),
    updatedAt: new Date("2024-01-13T15:45:00Z")
  },
  {
    id: "4",
    title: "Thông báo 4",
    description: "Nội dung thông báo 4",
    image: "url/to/image4.jpg",
    type: NotificationType.BUY_TOKEN,
    isRead: true,
    link: 'd',
    createdAt: new Date("2024-01-12T11:20:00Z"),
    updatedAt: new Date("2024-01-12T11:20:00Z")
  },
  {
    id: "5",
    title: "Thông báo 5",
    description: "Nội dung thông báo 5",
    image: "url/to/image5.jpg",
    type: NotificationType.OTHER,
    isRead: false,
    link: 'd',
    createdAt: new Date("2024-01-11T13:00:00Z"),
    updatedAt: new Date("2024-01-11T13:00:00Z")
  },
  {
    id: "6",
    title: "Thông báo 6",
    description: "Nội dung thông báo 6",
    image: "url/to/image6.jpg",
    type: NotificationType.FRIEND_REQUEST,
    isRead: true,
    link: 'd',
    createdAt: new Date("2024-01-10T09:10:00Z"),
    updatedAt: new Date("2024-01-10T09:10:00Z")
  },
  {
    id: "7",
    title: "Thông báo 7",
    description: "Nội dung thông báo 7",
    image: "url/to/image7.jpg",
    type: NotificationType.BUY_TOKEN,
    isRead: false,
    link: 'd',
    createdAt: new Date("2024-01-09T16:30:00Z"),
    updatedAt: new Date("2024-01-09T16:30:00Z")
  },
  {
    id: "8",
    title: "Thông báo 8",
    description: "Nội dung thông báo 8",
    image: "url/to/image8.jpg",
    type: NotificationType.OTHER,
    isRead: true,
    link: 'd',
    createdAt: new Date("2024-01-08T14:15:00Z"),
    updatedAt: new Date("2024-01-08T14:15:00Z")
  },
  {
    id: "9",
    title: "Thông báo 9",
    description: "Nội dung thông báo 9",
    image: "url/to/image9.jpg",
    type: NotificationType.BUY_TOKEN,
    isRead: false,
    link: 'd',
    createdAt: new Date("2024-01-07T12:40:00Z"),
    updatedAt: new Date("2024-01-07T12:40:00Z")
  },
  {
    id: "10",
    title: "Thông báo 10",
    description: "Nội dung thông báo 10",
    image: "url/to/image10.jpg",
    type: NotificationType.OTHER,
    isRead: true,
    link: 'd',
    createdAt: new Date("2024-01-06T17:50:00Z"),
    updatedAt: new Date("2024-01-06T17:50:00Z")
  }
];

export const NotificationProvider: FC<PropsWithChildren> = (props) => {
  const [status, setStatus] = useState<NotificationStatus>({ isFetching: true, notifications: notificationsTest, count: notificationsTest.length });
  const blockchain = useBlockChain();
  const [activePage, setPage] = useState(1);
  const limit = 10;

  const fetchNotifications = async () => {
    try {

    } catch (error) {

    }
  }

  const pushNotification = async () => {
    try {
      const newItems = status.notifications.concat([{
        id: "10",
        title: "Thông báo 10",
        description: "Nội dung thông báo 10",
        image: "url/to/image10.jpg",
        type: NotificationType.OTHER,
        isRead: true,
        link: 'd',
        createdAt: new Date("2024-01-06T17:50:00Z"),
        updatedAt: new Date("2024-01-06T17:50:00Z")
      }]);

      setStatus(s => ({ ...s, notifications: newItems, count: newItems.length }));
    } catch (error) {
      setStatus(s => ({ ...s }));
    }
  }

  const setActivePage = () => {
    setPage(s => s + 1);
  }

  useEffect(() => {
    fetchNotifications();
  }, [blockchain.wallet, activePage]);

  const context: NotificationPropsContext = {
    ...status,
    pushNotification,
    setActivePage
  }

  return <NotificationContext.Provider
    value={context}
  >
    {props.children}
  </NotificationContext.Provider>
}

export const useNotificationContext = () => useContext(NotificationContext);