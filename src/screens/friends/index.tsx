import { AppWrapper } from "@/components/app/app-wrapper";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { EmptyMessage } from "@/components/empty-message";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { NftModule } from "@/modules/nft/modules";
import { Nft } from "@/modules/nft/types";
import { UserModule } from "@/modules/user/modules";
import { UserInformation } from "@/modules/user/types";
import { getChainId } from "@/share/blockchain/context";
import { DateTimeUtils, StringUtils } from "@/share/utils";
import { ActionIcon, AspectRatio, Avatar, Group, Skeleton, Spoiler, Stack, Text, rem, useMantineTheme } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconCopy, IconCopyCheck } from "@tabler/icons-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import InfiniteScroll from 'react-infinite-scroll-component';

export const FriendsScreen: FC = () => {
  const [items, setItems] = useState<ListLoadState<any, 'tokens'>>({ isFetching: true, data: { tokens: [], count: 0 } });
  const [users, setUsers] = useState<{ token: Nft, user: UserInformation }[]>([]);
  const [activePage, setPage] = useState(1);
  const theme = useMantineTheme();
  const account = useAccount();
  const clipboard = useClipboard({ timeout: 500 });
  const { isMobile, isTablet } = useResponsive();
  const [hasMore, setHasMore] = useState(true);
  const limit = isMobile ? 20 : 2;

  const fetchItems = async () => {
    try {
      const listItems = await NftModule.getList({ chainID: getChainId(), limit, offset: (activePage - 1) * limit });
      if (listItems.data?.tokens.length === 0) {
        setHasMore(false);
        return;
      }

      setHasMore(true);
      const prevItems = items.data!.tokens.concat(listItems.data?.tokens);
      setItems(s => ({ ...s, isFetching: false, data: { tokens: prevItems || [], count: prevItems.length || 0 } }));
    } catch (error) {
      setItems(s => ({ ...s, isFetching: false, data: { tokens: [], count: 0 } }))
      // onError(error);
      throw error
    }
  }

  const getUserOfNft = async (wallet: string) => {
    const user = await UserModule.getByWallet(wallet);
    return user;
  }

  const fetchUsers = async () => {
    setUsers([]);
    const userPromises = items.data?.tokens.map(async (v, k) => {
      const user = await getUserOfNft(v.owner);
      return { token: v, user: user };
    });

    const usersResult = await Promise.all(userPromises!);
    setUsers(usersResult);
  };

  const handleContextMenu = (event: any) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchItems();
  }, [account.information, activePage])

  useEffect(() => {
    fetchUsers();
  }, [items.data?.tokens])

  return <AppWrapper>
    <BoundaryConnectWallet>
      <InfiniteScroll
        dataLength={items.data?.count || 0}
        next={() => setPage(activePage + 1)}
        hasMore={hasMore}
        loader={<LoadingComponent />}
        endMessage={
          <Group pt={40} justify="center">
            <Text fw={500} c={theme.colors.text[1]}>Bạn đã xem hết rồi</Text>
          </Group>
        }
      >
        {users.map(({ token, user }, k) => <Group py={25} w={isMobile ? 400 : 800} key={k} m={'auto'}>
          <Link href={`/nfts/${token.tokenID}`}>
            <AspectRatio ratio={100 / 160} style={{
              overflow: 'hidden',
              borderRadius: theme.radius.md,
              width: rem(400)
            }}>
              <video
                controls
                controlsList="nodownload"
                // crossOrigin="use-credentials"
                preload="auto"
                src={token.source}
                onContextMenu={handleContextMenu}
              />
            </AspectRatio>
          </Link>

          {function () {
            if (users.length === 0) return <Skeleton h={'100vh'} />

            return <Stack gap={0} mih={isMobile ? '' : 640}>
              <Group align="flex-start" justify="space-between">
                <Link href={`/users/${user.wallet}`}>
                  <Group align="flex-start">
                    <Avatar w={64} h={64} src={user.avatar || '/images/default/avatar.png'} />
                    <Stack gap={0}>
                      <Text fw={500} c={theme.colors.text[1]}>{StringUtils.limitCharacters(user.username!, 15)}</Text>

                      <Text size="14px" c="dimmed">Tạo vào {DateTimeUtils.formatToShow(user.createdAt)}</Text>
                    </Stack>
                  </Group>
                </Link>

                <Group gap={0}>
                  <Text size="14px" c="dimmed">{StringUtils.compact(user.wallet, 8, 5)}</Text>
                  <ActionIcon
                    c={theme.colors.gray[7]}
                    variant="transparent"
                    onClick={() => clipboard.copy(user.wallet)}
                  >
                    {clipboard.copied ? <IconCopyCheck size={20} stroke={1.5} /> : <IconCopy size={20} stroke={1.5} />}
                  </ActionIcon>
                </Group>
              </Group>

              <Text mt={10} fw={500} ml={10} c={theme.colors.text[1]}>{token.title}</Text>

              <Spoiler ml={10} maw={370} mt={5} maxHeight={150} showLabel="Xem thêm" hideLabel="Ẩn" styles={{
                control: {
                  color: theme.colors.primary[5]
                },
                content: {
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  color: theme.colors.text[1]
                }
              }}>
                {token.description}
              </Spoiler>
            </Stack>
          }()}
        </Group>)}
      </InfiniteScroll>
    </BoundaryConnectWallet>
  </AppWrapper>
}

export const LoadingComponent: FC = () => {

  return <div className="loading">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
}
