import { AppWrapper } from "@/components/app/app-wrapper";
import { EmptyMessage } from "@/components/empty-message";
import { ErrorMessage } from "@/components/error-message";
import { NftModule } from "@/modules/nft/modules";
import { StringUtils } from "@/share/utils";
import { Box, Grid, Group, Image, Skeleton, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconEye, IconHeart, IconShare } from "@tabler/icons-react";
import Link from "next/link";
import { FC, useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ItemMode, ListLoadState } from "../../../types";
import { LoadingComponent } from "../friends";

export const ExploreScreen: FC = () => {
  const theme = useMantineTheme();
  const [activePage, setPage] = useState(1);
  const [items, setItems] = useState<ListLoadState<any, 'tokens'>>({ isFetching: true, data: { tokens: [], count: 0 } });
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const listTokens = await NftModule.getList({ sort: '-createdAt', active: true, limit: 12, offset: (activePage - 1) * 12 });
      if (listTokens.data?.tokens.length === 0) {
        setHasMore(false);
        return;
      }

      setItems(prevState => ({
        isFetching: false,
        data: {
          tokens: [...prevState.data!.tokens, ...listTokens?.data?.tokens || []],
          count: listTokens?.data?.count || 0,
        }
      }));
    } catch (error) {
      setItems(prev => ({
        ...prev,
        isFetching: false,
        data: { tokens: [], count: 0 }
      }));
    }
  }, [activePage]);

  useEffect(() => {
    fetchItems();
  }, [activePage, fetchItems]);

  return (
    <AppWrapper>
      <Box m={20}>
        {items.isFetching ? (
          <Grid>
            {Array(8).fill(0).map((_, key) => (
              <Grid.Col key={key} span={{ base: 3 }}>
                <Skeleton radius={10} width='100%' height={250} />
              </Grid.Col>
            ))}
          </Grid>
        ) : items.error ? (
          <Group><ErrorMessage error={items.error} /></Group>
        ) : items.data?.count === 0 ? (
          <EmptyMessage />
        ) : (
          <InfiniteScroll
            dataLength={items?.data?.tokens.length || 0}
            next={() => setPage(prev => prev + 1)}
            hasMore={hasMore}
            loader={<LoadingComponent />}
          >
            <Box
              style={{
                columnCount: 4,
                columnFill: 'balance',
                gap: '10px',
              }}
            >
              {items?.data?.tokens.map((v, index) => (
                <Link href={`/nfts/${v.tokenID}`} key={index}>
                  <Box pos='relative' style={{
                    breakInside: 'avoid',
                    marginBottom: '10px'
                  }}>
                    {v.mode.toString() === ItemMode.PUBLIC ? (
                      <video
                        src={v.source}
                        muted
                        autoPlay
                        style={{ 
                          width: '100%',
                          position: 'relative',
                          zIndex: 10
                        }}
                        controls
                      />
                    ) : (
                      <Image src={v.avatar} alt={`Image ${index}`} style={{ width: '100%' }} />
                    )}

                    <Group
                      pos='absolute'
                      align="flex-start"
                      bg={`linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))`}
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}>
                      <Stack c={theme.colors.text[0]} m={20} gap={6}>
                        <Text size="14px">{v.title}</Text>
                        <Text size="14px" c={theme.colors.gray[5]}>{StringUtils.compact(v.owner, 5, 5)}</Text>
                        <Group>
                          <Group gap={4}>
                            <IconHeart size={18} />
                            <Text size="14px" c={theme.colors.gray[5]}>{v.listOfLikedUsers.length}</Text>
                          </Group>
                          <Group gap={4}>
                            <IconShare size={18} />
                            <Text size="14px" c={theme.colors.gray[5]}>{v.totalShares || 0}</Text>
                          </Group>
                          <Group gap={4}>
                            <IconEye size={18} />
                            <Text size="14px" c={theme.colors.gray[5]}>{v.totalViews || 0}</Text>
                          </Group>
                        </Group>
                      </Stack>
                    </Group>
                  </Box>
                </Link>
              ))}
            </Box>
          </InfiniteScroll>
        )}
      </Box>
    </AppWrapper>
  )
}