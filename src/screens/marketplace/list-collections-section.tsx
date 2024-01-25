import { onError } from "@/components/modals/modal-error";
import { CollectionModule } from "@/modules/collection/modules";
import { useBlockChain } from "@/share/blockchain/context";
import { Box, Grid, Group, Pagination, Skeleton, Stack, Title, rem, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { CollectionCard } from "../../components/collection-card";
import { Collection, CollectionType } from "@/modules/collection/types";
import { ErrorMessage } from "@/components/error-message";
import { EmptyMessage } from "@/components/empty-message";

interface FeaturedProps {
  isFetching: boolean,
  data: {
    collections: Collection[],
    count: number,
  }
}
export const ListCollections: FC<{ type: string | null }> = (props) => {
  const defaultState: FeaturedProps = { isFetching: true, data: { collections: [], count: 0 } }
  const [collections, setCollections] = useState(defaultState);
  const [featuredRes, setFeaturedRes] = useState<FeaturedProps[]>([]);
  const blockchain = useBlockChain();
  const theme = useMantineTheme();
  const [activePage, setPage] = useState(1);
  const gridColumns = {
    lg: 4,
    sm: 6,
    xs: 12
  }
  const CollectionTypeArray = Object.values(CollectionType).filter(type => type !== CollectionType.ALL) as string[];

  const fetchFeaturedCollections = async (category: CollectionType) => {
    try {
      const featuredResItem = await CollectionModule.getList({ chainID: blockchain.chainId, category: category as string, sort: '+averagePrice' });
      const tempFeaturedResItem = { isFetching: false, data: { collections: featuredResItem.data ? featuredResItem.data.collections : [], count: featuredResItem.data ? featuredResItem.data.count : 0 } };
      setFeaturedRes(s => [...s, tempFeaturedResItem]);
    } catch (error) {
      onError(error);
    }
  }

  const fetchCollections = async () => {
    try {
      if (props.type !== CollectionType.ALL) {
        const res = await CollectionModule.getList({ chainID: blockchain.chainId, limit: 10, offset: (activePage - 1) * 10 })
        const filteredRes = res.data!.collections?.filter((v, k) => {
          if (v.category === props.type) return true;
          return false;
        })
        setCollections(s => ({ ...s, isFetching: false, data: { collections: filteredRes, count: filteredRes.length } }))
      } else {
        setFeaturedRes([]);

        await fetchFeaturedCollections(CollectionType.TOURISM);
        await fetchFeaturedCollections(CollectionType.GAME);
        await fetchFeaturedCollections(CollectionType.LIFE);
        await fetchFeaturedCollections(CollectionType.EDUCATION);
        await fetchFeaturedCollections(CollectionType.FAMILY);
        await fetchFeaturedCollections(CollectionType.FILM);
        await fetchFeaturedCollections(CollectionType.COOK);
      }
    } catch (error) {
      onError(error)
    }
  }

  useEffect(() => {
    fetchCollections();
  }, [props.type]);

  useEffect(() => {
  }, [featuredRes]);

  return (
    <Stack>
      {props.type === CollectionType.ALL ? featuredRes.map((v, k) => (
        <Box key={k}>
          <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
            Bộ sưu tập {CollectionTypeArray[k]} nổi bật
          </Title>

          {(!featuredRes || !(featuredRes[k] as FeaturedProps)) ? (
            <Grid>
              {Array(3).fill(0).map((_, key) => (
                <Grid.Col key={key} span={{ ...gridColumns }}>
                  <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            (featuredRes[k] as FeaturedProps).data.count < 1 ? (
              <EmptyMessage />
            ) : (
              <Grid mt={10} gutter={theme.spacing.md}>
                {(featuredRes[k] as any).data.collections.map((item, index) => (
                  <Grid.Col key={index} span={{ ...gridColumns }}>
                    <CollectionCard key={k} collection={item} />
                  </Grid.Col>
                ))}
              </Grid>
            )
          )}
        </Box>
      )) : <>
        <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
          Tất cả Bộ sưu tập {props.type}
        </Title>

        {function () {
          if (!collections || collections.isFetching) return <Grid>
            {Array(3).fill(0).map((_, key) => (
              <Grid.Col key={key} span={{ ...gridColumns }}>
                <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
              </Grid.Col>
            ))}
          </Grid>

          if (collections.data.count < 1) return <EmptyMessage />

          return <Grid mt={10} gutter={theme.spacing.md}>
            {collections.data.collections.map((v, k) => <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard key={k} collection={v} />
            </Grid.Col>)}
          </Grid>
        }()}

        <Pagination color={theme.colors.primary[5]} total={Math.ceil(collections.data.count / 10)} siblings={2} value={activePage} onChange={setPage} styles={{
          root: {
            marginTop: '80px',
            display: 'flex',
            justifyContent: 'center'
          },
          control: {
            padding: '20px 15px',
          }
        }}
        />
      </>}
    </Stack>
  )

}