import { AppFooter } from "@/components/app/app-footer";
import { AppHeader } from "@/components/app/app-header";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { EmptyMessage } from "@/components/empty-message";
import { onError } from "@/components/modals/modal-error";
import { useAccount } from "@/modules/account/context";
import { UserModule } from "@/modules/user/modules";
import { UserInformation } from "@/modules/user/types";
import { StringUtils } from "@/share/utils";
import { ActionIcon, AspectRatio, Box, Card, Flex, Group, Menu, Pagination, Skeleton, Stack, Tabs, Text, TextInput, Title, useMantineTheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconCheck, IconDots, IconFriendsOff, IconSearch, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../../types";
import classes from '../../../styles/collections/CollectionDetail.module.scss';
import { FriendRequestModule } from "@/modules/friend-request/modules";
import { FriendRequestStatus } from "@/modules/friend-request/types";
import { getChainId } from "@/share/blockchain/context";

enum UserFriendsTabs {
  FRIENDS = 'Bạn bè',
  FRIEND_REQUEST = 'Lời mời kết bạn',
}

export const UserFriendsScreen: FC = () => {
  const theme = useMantineTheme();
  const account = useAccount();
  const [search, setSearch] = useState('');
  const [activePage, setPage] = useState(1);
  const [debounced] = useDebouncedValue(search, 200);
  const [users, setUsers] = useState<ListLoadState<UserInformation, 'users'>>({ isFetching: true, data: { users: [], count: 0 } });
  const [activeTab, setActiveTab] = useState<string | null>(UserFriendsTabs.FRIENDS);
  const [forceUpdate, setForceUpdate] = useState(1);
  const limit = 20;

  const fetchFriends = async () => {
    try {
      let res: any;
      if (activeTab === UserFriendsTabs.FRIENDS) {
        res = await FriendRequestModule.getListFriends({ limit, offset: (activePage - 1) * limit });
      } else {
        res = await FriendRequestModule.getListFriendRequests({ limit, offset: (activePage - 1) * limit, status: FriendRequestStatus.ISPENDING, to: account.information?.wallet });
        const requesters = [];
        for (const v of res.data.request) {
          const from = await UserModule.getByWallet(v.from);
          requesters.push(from);
        }
        res.data.users = requesters;
        res.data.count = requesters.length;
      }
      if (search.length > 0 && !!res.data?.users) {
        const users = res.data.users.filter((v: any, k: any) => {
          if (v.wallet.includes(search) || v.username.includes(search)) return true;
          return false;
        })
        res.data.users = users;
        res.data.count = users.length;
      }
      setUsers(s => ({ ...s, isFetching: false, data: { users: res.data?.users || [], count: res.data?.count } }));
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchFriends();
  }, [account.information, debounced, activeTab, forceUpdate])

  return <>
    <AppHeader />
    <Box my={100}>
      <BoundaryConnectWallet>
        <Card shadow="md" px={25} withBorder maw='80%' style={{
          margin: 'auto'
        }}>
          <Stack >
            <Group justify="space-between">
              <Title order={3} c={theme.colors.text[1]}>Bạn bè</Title>

              <Group>
                <TextInput placeholder="Nhập từ khóa" miw={300} rightSection={<IconSearch />} radius={10} styles={{
                  input: {
                    height: '45px',
                  },
                  section: {
                    paddingRight: `${theme.spacing.md}`
                  }
                }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Group>
            </Group>

            <Tabs value={activeTab} miw={250} onChange={setActiveTab} classNames={{
              root: "tab-root",
              list: "tab-list",
              tab: "tab-button",
            }}>
              <Tabs.List mb={20} grow style={{
                maxWidth: '35%'
              }}>
                {Object.values(UserFriendsTabs).map((v, k) => (
                  <Tabs.Tab
                    //rightSection={<Text>({users.data?.count})</Text>}
                    value={v}
                    key={k}>
                    {v}
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              <Tabs.Panel value={UserFriendsTabs.FRIENDS}>
                <Flex
                  direction="row"
                  wrap="wrap"
                  justify="space-between"
                  columnGap={40}
                >
                  {function () {
                    if (users.isFetching || !users.data?.users) return <>
                      {Array(6).map((v, k) => <Skeleton key={k} height={40} />)}
                    </>

                    if (users.data.count === 0) return <Group w={'100%'} justify="center"><EmptyMessage message="Chưa có người bạn nào" /></Group>

                    return <>
                      {users.data.users.map((v, k) => (
                        <FriendBox key={k} onUpdate={() => setForceUpdate(s => s + 1)} user={v} type="friend" />
                      ))}
                    </>
                  }()}
                </Flex>
              </Tabs.Panel>

              <Tabs.Panel value={UserFriendsTabs.FRIEND_REQUEST}>
                <Flex
                  direction="row"
                  wrap="wrap"
                  justify="space-between"
                  columnGap={40}
                >
                  {function () {
                    if (users.isFetching || !users.data?.users) return <>
                      {Array(6).map((v, k) => <Skeleton key={k} height={40} />)}
                    </>

                    if (users.data.count === 0) return <Group w={'100%'} justify="center"><EmptyMessage message="Chưa có lời mời nào" /></Group>

                    return <>
                      {users.data.users.map((v, k) => (
                        <FriendBox key={k} onUpdate={() => setForceUpdate(s => s + 1)} user={v} type="request" />
                      ))}
                    </>
                  }()}
                </Flex>
              </Tabs.Panel>
            </Tabs>

            <Pagination color={theme.colors.primary[5]} total={Math.ceil(users.data!.count! / 20)} siblings={2} value={activePage} onChange={setPage} styles={{
              root: {
                margin: "auto",
                marginTop: '40px'
              },
              control: {
                padding: '20px 15px',
              }
            }}
              classNames={{
                control: classes.control
              }}
            />
          </Stack>
        </Card>
      </BoundaryConnectWallet>
    </Box>

    <AppFooter />
  </>
}

interface FriendBoxProps {
  user: UserInformation,
  type?: 'friend' | 'request',
  onUpdate: () => void
}

const FriendBox: FC<FriendBoxProps> = (props) => {
  const theme = useMantineTheme();
  const account = useAccount();

  const handleUnfriend = async () => {
    try {
      await FriendRequestModule.update({ status: FriendRequestStatus.CANCELLED, to: props.user.wallet, from: account.information?.wallet, chainID: getChainId() });
      props.onUpdate();
    } catch (error) {
      onError("Hủy kết bạn thất bại, vui lòng thử lại sau");
    }
  }

  const handleAddfriend = async () => {
    try {
      await FriendRequestModule.update({ status: FriendRequestStatus.ISFRIEND, to: props.user.wallet, from: account.information?.wallet, chainID: getChainId() });
      props.onUpdate();
    } catch (error) {
      onError("Đồng ý thất bại, vui lòng thử lại sau");
    }
  }

  return <Group flex="0 1 46%" mb={60} justify="space-between">
    <Link href={`/users/${props.user.wallet}`}>
      <Group>
        <AspectRatio style={{
          width: '82px',
          overflow: 'hidden',
          borderRadius: '8px'
        }}>
          <img src={props.user.avatar || '/images/default/ava.jpeg'} />
        </AspectRatio>

        <Stack gap={4}>
          <Text fw={500} c={theme.colors.text[1]}>{StringUtils.limitCharacters(props.user.username || '', 15)}</Text>
          <Text c="dimmed" size="14px">{StringUtils.compact(props.user.wallet, 5, 5)}</Text>
        </Stack>
      </Group>

    </Link>

    {props.type === 'friend' && <Menu position="bottom-end" styles={{
      dropdown: {
        boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
        border: 'none'
      },
      item: {
        padding: '10px 16px'
      }
    }}>
      <Menu.Target>
        <ActionIcon variant="light" color={theme.colors.primary[5]}>
          <IconDots />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={handleUnfriend} leftSection={<IconFriendsOff size={20} color={theme.colors.text[1]} />}>
          Hủy kết bạn
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>}

    {props.type === 'request' && <Group>
      <ActionIcon onClick={handleAddfriend} size={24} color="green" variant="outline">
        <IconCheck />
      </ActionIcon>

      <ActionIcon onClick={handleUnfriend} size={26} color="danger">
        <IconTrash />
      </ActionIcon>
    </Group>}
  </Group>
}