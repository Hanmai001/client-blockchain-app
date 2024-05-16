import { useNotificationContext } from "@/modules/notification/context";
import { Notification } from "@/modules/notification/types";
import { ActionIcon, Avatar, Group, Loader, Menu, Skeleton, Text, useMantineTheme } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import Link from "next/link";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export const AppNotification: FC = () => {
  const theme = useMantineTheme();
  const notification = useNotificationContext();
  const [hasMore, setHasMore] = useState(true);

  return <Menu shadow="md" width={360} openDelay={100} closeDelay={200} closeOnItemClick={false} styles={{
    dropdown: {
      height: '500px',
    }
  }}>
    <Menu.Target>
      <ActionIcon
        variant="light"
        color={theme.colors.primary[5]}
        size={40}
      >
        <IconBell size={24} stroke={1.5} />
      </ActionIcon>
    </Menu.Target>

    <Menu.Dropdown>
      <InfiniteScroll
        height={490}
        dataLength={notification.notifications.length || 0}
        next={notification.setActivePage}
        hasMore={hasMore}
        loader={<Group justify="center"><Loader color={theme.colors.primary[5]} size={24} /></Group>}
        style={{
          paddingBottom: '14px'
        }}
      >
        {function () {
          //if (notification.isFetching) return <Skeleton h={100}/>

          return <>
            {notification.notifications.map((v: Notification, k: number) => <NotificationItem key={k} notification={v} />)}
          </>
        }()}
      </InfiniteScroll>
    </Menu.Dropdown>
  </Menu>
}

interface NotificationItemProps {
  notification: Notification
}

const NotificationItem: FC<NotificationItemProps> = (props) => {
  const theme = useMantineTheme();

  return <Link href={props.notification.link}>
    <Group gap={6} className="noti-item"
      align="flex-start"
    >
      <Avatar src={props.notification.image} h={52} w={52} />

      <Text mt={2} flex={10} size="14px" style={{
        display: 'inline-block',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}
        c={theme.colors.text[1]}
      ><Text fw={500} style={{
        display: 'inline-block',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}>{props.notification.title} <span>&nbsp;</span></Text>{props.notification.description}</Text>
    </Group>
  </Link>
}