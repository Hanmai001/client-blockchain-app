import { useBlockChain } from "@/share/blockchain/context";
import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { NotificationModule } from "./modules";
import { Notification, NotificationPayload, NotificationPropsContext, NotificationStatus } from "./types";

export const NotificationContext = createContext<any>({} as any);

export const NotificationProvider: FC<PropsWithChildren> = (props) => {
  const [status, setStatus] = useState<NotificationStatus>({ isFetching: true, notifications: [], count: 0 });
  const blockchain = useBlockChain();
  const [activePage, setPage] = useState(1);
  const limit = 10;

  const fetchNotifications = async () => {
    try {
      const res = await NotificationModule.getListNotifications({ offset: (activePage - 1) * 10, limit })
      console.log(res)
      if (res.data.notifications.length === 0) {
        setStatus(s => ({ ...s, isFetching: false, initialized: true }));
        return false;
      }

      const prevItems = status.notifications;
      setStatus(s => ({ ...s, isFetching: false, initialized: true, notifications: [...prevItems, ...res.data.notifications] || [], count: res.data.count }));
      if (res.data.notifications.length <= limit) return false;
      return true;
    } catch (error) {

    }
  }

  const pushNotification = async (newNotification: Notification) => {
    try {
      setStatus(s => ({ ...s, notifications: [newNotification, ...status.notifications] }));
    } catch (error) {
      setStatus(s => ({ ...s }));
    }
  }

  const sendNotification = async (payload: NotificationPayload) => {
    try {
      await NotificationModule.addNotification(payload)
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
    sendNotification,
    setActivePage
  }

  return <NotificationContext.Provider
    value={context}
  >
    {props.children}
  </NotificationContext.Provider>
}

export const useNotificationContext = () => useContext(NotificationContext);