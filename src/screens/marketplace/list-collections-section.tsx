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
  isFetching: boolean;
  data: {
    collections: Collection[];
    count: number;
  };
}

const gridColumns = {
  md: 3,
  sm: 4,
  xs: 6,
  base: 6
};

const CollectionTypeArray = Object.values(CollectionType).filter(type => type !== CollectionType.ALL) as string[];

const fetchCollectionsByType = async (chainId: string | undefined = '97', type: string | null, filter: CollectionStatus, page: number) => {
  const sortOptions: Record<CollectionStatus, string> = {
    [CollectionStatus.ALL]: '',
    [CollectionStatus.MOST_VIEWS]: '-totalViews',
    [CollectionStatus.MOST_AVGPRICE]: '-averagePrice',
    [CollectionStatus.OLDEST]: '+createdAt',
    [CollectionStatus.NEWEST]: '-createdAt'
  };

  const sort = sortOptions[filter];
  const limit = 20;
  const offset = (page - 1) * limit;

  const res = await CollectionModule.getList({
    chainID: chainId,
    limit,
    offset,
    active: true,
    sort
  });

  if (type !== CollectionType.ALL) {
    return res.data?.collections.filter((v) => v.category === type) || [];
  }

  return res.data?.collections || [];
};

const fetchFeaturedCollections = async (chainId: string | undefined = '97', category: CollectionType) => {
  const res = await CollectionModule.getList({
    chainID: chainId,
    category: category as string,
    sort: '+averagePrice',
    limit: 4,
    active: true
  });

  return res.data?.collections || [];
};

const SkeletonGrid = () => (
  <Grid>
    {Array(4).fill(0).map((_, key) => (
      <Grid.Col key={key} span={gridColumns}>
        <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
      </Grid.Col>
    ))}
  </Grid>
);

export const ListCollections: FC<{ type: string | null }> = ({ type }) => {
  const defaultState: FeaturedProps = { isFetching: true, data: { collections: [], count: 0 } };
  const [collections, setCollections] = useState<ListLoadState<Collection, 'collections'>>(defaultState);
  const [featuredRes, setFeaturedRes] = useState<FeaturedProps[]>([]);
  const blockchain = useBlockChain();
  const theme = useMantineTheme();
  const [activePage, setPage] = useState(1);
  const [filter, setFilter] = useState(CollectionStatus.ALL);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCollections(defaultState);
        if (type !== CollectionType.ALL) {
          const data = await fetchCollectionsByType(blockchain.chainId, type, filter, activePage);
          setCollections({ isFetching: false, data: { collections: data, count: data.length } });
        } else {
          setFeaturedRes([]);
          const featuredCollections = await Promise.all(
            CollectionTypeArray.map(category => fetchFeaturedCollections(blockchain.chainId, category as CollectionType))
          );
          setFeaturedRes(featuredCollections.map(collections => ({ isFetching: false, data: { collections, count: collections.length } })));
        }
      } catch (error) {
        setCollections({ isFetching: false, data: { collections: [], count: 0 } });
      }
    };

    fetchData();
  }, [type, filter, activePage]);

  return (
    <Stack gap={10}>
      {type === CollectionType.ALL ? (
        featuredRes.map((v, k) => (
          <Box key={k}>
            <Title c={theme.colors.text[1]} order={4} fw={500} mt={theme.spacing.md}>
              Bộ sưu tập {CollectionTypeArray[k]} nổi bật
            </Title>
            {v.isFetching ? (
              <SkeletonGrid />
            ) : v.data.count < 1 ? (
              <EmptyMessage />
            ) : (
              <Grid mt={10} gutter={theme.spacing.xs}>
                {v.data.collections.map((item, index) => (
                  <Grid.Col key={index} span={gridColumns}>
                    <CollectionCard key={index} collection={item} />
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Box>
        ))
      ) : (
        <>
          <Group>
            <Title flex={8} c={theme.colors.text[1]} order={4} fw={500} mt={theme.spacing.md}>
              Tất cả Bộ sưu tập {type}
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
                onChange={(value) => setFilter(value)}
              />
            </Box>
          </Group>
          {collections.isFetching ? (
            <SkeletonGrid />
          ) : collections?.data!.count === 0 ? (
            <EmptyMessage />
          ) : (
            <Grid gutter={theme.spacing.xs}>
              {collections?.data!.collections.map((v, k) => (
                <Grid.Col key={k} span={gridColumns}>
                  <CollectionCard key={k} collection={v} />
                </Grid.Col>
              ))}
            </Grid>
          )}
          <Pagination
            color={theme.colors.primary[5]}
            total={Math.ceil((collections?.data?.count || 0) / 10)}
            siblings={2}
            value={activePage}
            onChange={setPage}
            styles={{
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
        </>
      )}
    </Stack>
  );
};