import { useAccount } from "@/modules/account/context";
import { useChatContext } from "@/modules/chat/context";
import { FriendRequestModule } from "@/modules/friend-request/modules";
import { Nft } from "@/modules/nft/types";
import { UserInformation } from "@/modules/user/types";
import { AspectRatio, Avatar, Group, Loader, Modal, Skeleton, Stack, Text, TextInput, ThemeIcon, Tooltip, useMantineTheme } from "@mantine/core";
import { useClipboard, useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconCopy, IconCopyCheck, IconSearch } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ListLoadState } from "../../../types";
import { AppButton } from "../app/app-button";
import { onError } from "./modal-error";

interface State {
  token: Nft,
  onUpdate?: () => void
}


export let onShareToken = (state: State) => undefined;
export const ModalShareNft: FC = () => {
  const [state, setState] = useState<State>();
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [search, setSearch] = useState('');
  const [activePage, setPage] = useState(1);
  const [debounced] = useDebouncedValue(search, 200);
  const [users, setUsers] = useState<ListLoadState<UserInformation, 'users'>>({ isFetching: true, data: { users: [], count: 0 } });
  const account = useAccount();
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState<string>("");
  const clipboard = useClipboard({ timeout: 500 });
  const limit = 10;

  const fetchFriends = async () => {
    try {
      setHasMore(true);
      let res: any;
      res = await FriendRequestModule.getListFriends({ limit, offset: (activePage - 1) * limit });
      if (res.data.users.length === 0) {
        setHasMore(false);
        return null;
      }

      setHasMore(true);

      let prevItems = users.data?.users || [];
      if (activePage === 1) {
        prevItems = res.data.users;
      } else {
        prevItems = prevItems.concat(res.data.users);
      }

      if (search.length > 0 && !!prevItems) {
        const users = prevItems.filter((v: any, k: any) => {
          if (v.wallet.includes(search) || v.username.includes(search)) return true;
          return false;
        })
        prevItems = users;
      }
      if (prevItems.length < 1) setHasMore(false);
      setUsers(s => ({ ...s, isFetching: false, data: { users: prevItems || [], count: prevItems?.length || 0 } }));
    } catch (error) {
      setUsers(s => ({ ...s, isFetching: false, data: { users: [], count: 0 } }))
    }
  }

  useEffect(() => {
    fetchFriends();
  }, [account.information, activePage, debounced]);

  onShareToken = (state) => {
    setState(state);
    open();
  }

  const onClose = () => {
    close();
  }

  useEffect(() => {
    const shareLink = window.location.href;
    setMessage(shareLink);
  }, [state?.token])

  return <Modal size="lg" title="Chia sẻ" closeOnClickOutside={false} centered opened={opened} onClose={onClose} styles={{
    overlay: {
      zIndex: 100
    },
    title: {
      fontWeight: 500,
      fontSize: '24px',
      color: theme.colors.text[1]
    }
  }}>
    <Stack>
      {function () {
        if (!message) return <Skeleton h={60} radius={8} />

        return <Group style={{
          backgroundColor: theme.colors.gray[2],
          borderRadius: '8px',
          padding: '14px 16px'
        }}>
          <Text c={theme.colors.text[1]} fw={500} flex={8} style={{
            wordBreak: 'break-word'
          }}>{message}</Text>
          <AspectRatio ratio={64 / 48} w={64} style={{
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <img src={'/images/default/video.svg'} />
          </AspectRatio>
        </Group>
      }()}

      <Tooltip label="Sao chép liên kết"><ThemeIcon variant="light" radius="xl" size={64} p={12} style={{
        cursor: 'pointer'
      }}>
        {clipboard.copied ? <IconCopyCheck
          color={theme.colors.gray[7]}
          size={36}
          stroke={1.5}
        /> : <IconCopy
          color={theme.colors.gray[7]}
          onClick={() => clipboard.copy(message)}
          size={36}
          stroke={1.5}
        />}
      </ThemeIcon></Tooltip>

      <TextInput
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Tìm kiếm bạn"
        rightSection={<IconSearch />}
        radius={24} miw='100%'
        styles={{
          input: {
            height: '40px',
            paddingLeft: `${theme.spacing.md}`,
          },
          section: {
            paddingRight: `${theme.spacing.md}`
          }
        }}
      />

      <InfiniteScroll
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
        dataLength={users.data?.users.length || 0}
        next={() => setPage(s => s + 1)}
        hasMore={hasMore}
        loader={<Group justify="center"><Loader color={theme.colors.primary[5]} size={24} /></Group>}
      >
        {users.data?.users.map((v, k) => <UserChatsBox message={message} user={v} key={k} />)}

        {users.data?.count === 0 && <Group justify="center">
          <Text c={theme.colors.gray[7]}>Không tìm thấy</Text>
        </Group>}
      </InfiniteScroll>
    </Stack>
  </Modal>
}

interface UserChatsBoxProps {
  user: UserInformation,
  message: string
}
const UserChatsBox: FC<UserChatsBoxProps> = (props) => {
  const theme = useMantineTheme();
  const [isSent, setIsSent] = useState(false);
  const chatContext = useChatContext();
  const account = useAccount();

  const handleShare = async (recipient: string) => {
    try {
      const data = await chatContext.checkIfAvailableChat(recipient);
      if (!data) {
        await chatContext.createChat({ firstUser: account.information?.wallet, secondUser: recipient });
      } else {
        await chatContext.handleChangeChat(data.id, data.secondUser);
      }
      setIsSent(true);
    } catch (error) {
      onError("Có lỗi xảy ra, vui lòng thử lại sau")
    }
  }

  useEffect(() => {
    const handleSendMessages = async () => {
      try {
        if (isSent) {
          await chatContext.sendMessages(props.message);
          setTimeout(() => {
            setIsSent(false);
          }, 2000);
        }
      } catch (error) {
        onError("Có lỗi xảy ra, vui lòng thử lại sau")
      }
    }

    handleSendMessages();
  }, [isSent])

  return <Group justify="space-between">
    <Group>
      <Avatar src={props.user.avatar || '/images/default/avatar.png'} w={48} h={48} />
      <Text fw={500}>{props.user.username}</Text>
    </Group>

    {isSent ? <AppButton
      async
      disabled
      color={theme.colors.primary[5]}
    >
      Đã gửi
    </AppButton> : <AppButton
      onClick={() => handleShare(props.user.wallet!)}
      async
      color={theme.colors.primary[5]}
    >
      Gửi
    </AppButton>}
  </Group>
}