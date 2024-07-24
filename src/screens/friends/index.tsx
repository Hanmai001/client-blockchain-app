import { AppWrapper } from "@/components/app/app-wrapper";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { NftModule } from "@/modules/nft/modules";
import { Nft } from "@/modules/nft/types";
import { UserModule } from "@/modules/user/modules";
import { UserInformation } from "@/modules/user/types";
import { getChainId } from "@/share/blockchain/context";
import { DateTimeUtils, StringUtils } from "@/share/utils";
import { ActionIcon, AspectRatio, Avatar, Card, Group, Skeleton, Spoiler, Stack, Text, useMantineTheme } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconCopy, IconCopyCheck } from "@tabler/icons-react";
import Link from "next/link";
import { FC, useEffect, useState, useCallback } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { ListLoadState } from "../../../types";

export const FriendsScreen: FC = () => {
  const [items, setItems] = useState<ListLoadState<any, 'tokens'>>({ isFetching: true, data: { tokens: [], count: 0 } });
  const [users, setUsers] = useState<{ token: Nft, user: UserInformation }[]>([]);
  const [activePage, setPage] = useState(1);
  const theme = useMantineTheme();
  const account = useAccount();
  const clipboard = useClipboard({ timeout: 500 });
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchItems = useCallback(async () => {
    try {
      const listItems = await NftModule.getListNftsOfFriends({ chainID: getChainId(), limit, offset: (activePage - 1) * limit });
      if (listItems.data?.tokens.length === 0) {
        setHasMore(false);
        return;
      }

      setItems(prev => ({
        ...prev,
        isFetching: false,
        data: {
          tokens: [...prev?.data?.tokens || [], ...listItems?.data?.tokens || []],
          count: (prev?.data?.tokens.length || 0) + (listItems?.data?.tokens.length || 0)
        }
      }));
    } catch (error) {
      setItems(prev => ({
        ...prev,
        isFetching: false,
        data: { tokens: [], count: 0 }
      }));
      // Handle error if needed
    }
  }, [activePage]);

  const fetchUsers = useCallback(async () => {
    if (!items?.data?.tokens.length) return;

    const userPromises = items.data.tokens.map(token =>
      UserModule.getByWallet(token.owner).then(user => ({ token, user }))
    );

    const usersResult = await Promise.all(userPromises);
    setUsers(usersResult);
  }, [items?.data?.tokens]);

  useEffect(() => {
    fetchItems();
  }, [account.information?.wallet, activePage, fetchItems]);

  useEffect(() => {
    fetchUsers();
  }, [items?.data?.tokens, fetchUsers]);

  return (
    <AppWrapper>
      <BoundaryConnectWallet>
        <InfiniteScroll
          dataLength={items?.data?.tokens.length || 0}
          next={() => setPage(prev => prev + 1)}
          hasMore={hasMore}
          loader={<LoadingComponent />}
        >
          {users.map(({ token, user }, index) => (
            <Group py={25} key={index} justify="center" align="flex-start">
              <Link href={`/nfts/${token.tokenID}`}>
                <AspectRatio ratio={100 / 160} w={400} style={{ overflow: 'hidden', borderRadius: theme.radius.md }}>
                  <video controls preload="auto" src={token.source} style={{ display: 'block', objectFit: 'contain' }} />
                </AspectRatio>
              </Link>

              <Stack gap='md'>
                <Group align="flex-start" justify="space-between">
                  <Link href={`/users/${user.wallet}`}>
                    <Group align="flex-start">
                      <Avatar
                        w={64}
                        h={64}
                        src={user.avatar || '/images/default/avatar.png'}
                        style={{ border: `1px solid ${theme.colors.primary[5]}` }}
                      />
                      <Stack gap={6}>
                        <Text fw='bold' c={theme.colors.text[1]}>
                          {StringUtils.limitCharacters(user.username!, 15)}
                        </Text>
                        <Text size="14px" c="dimmed">
                          Đăng vào {DateTimeUtils.formatToShow(token.createdAt)}
                        </Text>
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

                <Card shadow="sm" radius={8} p={10}>
                  <Text mt={10} fw='bold' ml={10} c={theme.colors.text[1]}>{token.title}</Text>
                  <Spoiler
                    ml={10}
                    mt={5}
                    maxHeight={150}
                    showLabel="Xem thêm"
                    hideLabel="Ẩn"
                    styles={{
                      control: { color: theme.colors.primary[5] },
                      content: {
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        color: theme.colors.text[1]
                      }
                    }}
                  >
                    {token.description}
                  </Spoiler>
                </Card>
              </Stack>
            </Group>
          ))}
        </InfiniteScroll>
      </BoundaryConnectWallet>
    </AppWrapper>
  );
}

export const LoadingComponent: FC = () => (
  <div className="loading">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="dot"></div>
    ))}
  </div>
);
