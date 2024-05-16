import { CollectionCard } from "@/components/collection-card";
import { useResponsive } from "@/modules/app/hooks";
import { CollectionModule } from "@/modules/collection/modules";
import { CollectionType } from "@/modules/collection/types";
import { useBlockChain } from "@/share/blockchain/context";
import { Carousel } from "@mantine/carousel";
import { Box, Grid, Skeleton, Stack, Title, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import classes from '../../styles/Marketplace.module.scss';

export const NotableCollectionsSection: FC<{ type: string | null }> = (props) => {
  const [collections, setCollections] = useState<ListLoadState<any, 'collections'>>({ isFetching: true, data: { collections: [], count: 0 } });
  const theme = useMantineTheme();
  const blockchain = useBlockChain();
  const { isMobile, isTablet } = useResponsive();

  const gridColumns = {
    xl: 3,
    sm: 4,
    xs: 6
  }

  const fetchCollections = async () => {
    try {
      let filteredRes: any;
      if (props.type !== CollectionType.ALL) {
        const res = await CollectionModule.getList({ chainID: blockchain.chainId, category: props.type as string, active: true, limit: 8 })
        filteredRes = res.data!.collections.filter(v => true);

      } else {
        const res = await CollectionModule.getList({ chainID: blockchain.chainId, active: true, limit: 8 })
        filteredRes = res.data!.collections.filter(v => true);
      }
      setCollections(s => ({ ...s, isFetching: false, data: { collections: filteredRes, count: filteredRes.length } }));
    } catch (error) {
      setCollections(s => ({ ...s, isFetching: false }))
    }
  }

  useEffect(() => {
    fetchCollections();
  }, [props.type])

  return <Box>
    <Title order={4} fw={500} c={theme.colors.text[1]}>
      Được đăng ký nhiều
    </Title>
    {function () {
      if (collections.isFetching || !collections.data) return <Grid>
        {Array(3).fill(0).map((_, key) => (
          <Grid.Col key={key} span={{ ...gridColumns }}>
            <Skeleton key={key} radius={10} width='100%' height={250} />
          </Grid.Col>
        ))}
      </Grid>

      return <Carousel
        w={'100%'}
        slideSize={{ base: '50%', sm: '33.33333%', md: '25%' }}
        slideGap={{ base: 'xs' }}
        align='start'
        slidesToScroll={isMobile ? 2 : isTablet ? 3 : 4}
        styles={{
          control: {
            width: '48px',
            height: '48px',
          },
          viewport: {
            padding: '10px 0'
          }
        }}
        classNames={classes}
      >
        {collections.data?.collections.map((v, k) => <Carousel.Slide key={k}>
          <CollectionCard collection={v} />
        </Carousel.Slide>)}
      </Carousel>
    }()}
  </Box>
}