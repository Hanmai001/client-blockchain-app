import { EmptyMessage } from "@/components/empty-message";
import { onError } from "@/components/modals/modal-error";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection, CollectionStatus, CollectionType } from "@/modules/collection/types";
import { useBlockChain } from "@/share/blockchain/context";
import { Box, Grid, Group, Pagination, Skeleton, Stack, Title, rem, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { CollectionCard } from "../../components/collection-card";
import { MyCombobox } from "@/components/combobox/my-combobox";
import classes from '../../styles/Marketplace.module.scss';

interface FeaturedProps {
  isFetching: boolean,
  data: {
    collections: Collection[],
    count: number,
  }
}
export const ListCollections: FC<{ type: string | null }> = (props) => {
  const defaultState: FeaturedProps = { isFetching: true, data: { collections: [], count: 0 } }
  const [collections, setCollections] = useState<ListLoadState<Collection, 'collections'>>(defaultState);
  const [featuredRes, setFeaturedRes] = useState<FeaturedProps[]>([]);
  const blockchain = useBlockChain();
  const theme = useMantineTheme();
  const [activePage, setPage] = useState(1);
  const [filter, setFilter] = useState(CollectionStatus.ALL);
  const gridColumns = {
    xl: 3,
    sm: 4,
    xs: 6,
    base: 6
  }
  const CollectionTypeArray = Object.values(CollectionType).filter(type => type !== CollectionType.ALL) as string[];

  const fetchFeaturedCollections = async (category: CollectionType) => {
    try {
      const featuredResItem = await CollectionModule.getList({ chainID: blockchain.chainId, category: category as string, sort: '+averagePrice', limit: 4, active: true });
      const tempFeaturedResItem = { isFetching: false, data: { collections: featuredResItem.data?.collections || [], count: featuredResItem.data?.count || 0 } };
      setFeaturedRes(s => [...s, tempFeaturedResItem]);
    } catch (error) {
      onError(error);
    }
  }

  const fetchCollections = async () => {
    try {
      setCollections(defaultState);
      if (props.type !== CollectionType.ALL) {
        let sort = '';
        //get list by filter
        if (filter !== CollectionStatus.ALL) {
          if (filter === CollectionStatus.MOST_VIEWS) sort = '-totalViews';
          if (filter === CollectionStatus.MOST_AVGPRICE) sort = '-averagePrice';
          if (filter === CollectionStatus.OLDEST) sort = '+createdAt';
          if (filter === CollectionStatus.NEWEST) sort = '-createdAt';
        }
        const res = await CollectionModule.getList({
          chainID: blockchain.chainId,
          limit: 20,
          offset: (activePage - 1) * 20,
          active: true,
          sort
        })
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
  }, [props.type, filter]);

  return (
    <Stack gap={10}>
      {props.type === CollectionType.ALL ? featuredRes.map((v, k) => (
        <Box key={k}>
          <Title c={theme.colors.text[1]} order={4} fw={500} mt={theme.spacing.md}>
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
              <Grid mt={10} gutter={theme.spacing.xs}>
                {(featuredRes[k] as any).data.collections.map((item: any, index: any) => (
                  <Grid.Col key={index} span={{ ...gridColumns }}>
                    <CollectionCard key={k} collection={item} />
                  </Grid.Col>
                ))}
              </Grid>
            )
          )}
        </Box>
      )) : <>
        <Group>
          <Title flex={8} c={theme.colors.text[1]} order={4} fw={500} mt={theme.spacing.md}>
            Tất cả Bộ sưu tập {props.type}
          </Title>
          <Box flex={4}>
            <MyCombobox
              initialvalue={CollectionStatus.ALL}
              options={CollectionStatus}
              styles={{
                dropdown: {
                  maxHeight: '200px',
                  overflow: 'hidden',
                  overflowY: 'auto',
                },
              }}
              classNames={{
                dropdown: 'hidden-scroll-bar'
              }}
              classnamesinput={classes.comboboxInput}
              classnamesroot={classes.comboboxRootInput}
              onChange={(value) => { setFilter(value) }}
            />
          </Box>
        </Group>

        {function () {
          if (!collections || collections.isFetching) return <Grid>
            {Array(3).fill(0).map((_, key) => (
              <Grid.Col key={key} span={{ ...gridColumns }}>
                <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
              </Grid.Col>
            ))}
          </Grid>

          if (collections.data?.count === 0) return <EmptyMessage />

          return <Grid gutter={theme.spacing.xs}>
            {collections.data?.collections.map((v, k) => <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard key={k} collection={v} />
            </Grid.Col>)}
          </Grid>
        }()}

        <Pagination color={theme.colors.primary[5]} total={Math.ceil(collections.data!.count! / 10)} siblings={2} value={activePage} onChange={setPage} styles={{
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