import { AppImage } from "@/components/app/app-image";
import { onError } from "@/components/modals/modal-error";
import { useResponsive } from "@/modules/app/hooks";
import { renderPayment } from '@/modules/coins/utils';
import { CollectionModule } from "@/modules/collection/modules";
import { Collection, CollectionType } from '@/modules/collection/types';
import { useBlockChain } from "@/share/blockchain/context";
import { StringUtils } from "@/share/utils";
import { Carousel } from '@mantine/carousel';
import { AspectRatio, Box, Grid, Group, Skeleton, Stack, Text, Title, rem, useMantineTheme } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import { ListLoadState } from "../../../types";
import classes from '../../styles/Marketplace.module.scss';

export const BannerSection: FC<{ type: string | null }> = (props) => {
  const [collections, setCollections] = useState<ListLoadState<any, 'collections'>>({ isFetching: true, data: { collections: [], count: 0 } });
  const theme = useMantineTheme();
  const blockchain = useBlockChain();
  const { isMobile, isTablet } = useResponsive();
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  const gridColumns = {
    xl: 4,
    sm: 6,
    xs: 12
  }

  function getRandomItems(array: any[], count: number): any[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const fetchCollections = async () => {
    try {
      let filteredRes: any;
      if (props.type !== CollectionType.ALL) {
        const res = await CollectionModule.getList({ chainID: blockchain.chainId, category: props.type as string, active: true, limit: 12, sort: '-createdAt' })
        filteredRes = res.data!.collections.filter(v => true);

      } else {
        const res = await CollectionModule.getList({ chainID: blockchain.chainId, active: true, limit: 12, sort: '-createdAt' })
        filteredRes = res.data!.collections.filter(v => true);
      }
      // filteredRes = getRandomItems(filteredRes, 12);
      setCollections(s => ({ ...s, isFetching: false, data: { collections: filteredRes, count: filteredRes.length } }));
    } catch (error) {
      setCollections(s => ({ ...s, isFetching: false }))
      onError(error)
    }
  }

  useEffect(() => {
    fetchCollections();
  }, [props.type])

  return (
    <>
      {function () {
        if (collections.isFetching || !collections.data) return <Grid>
          {Array(3).fill(0).map((_, key) => (
            <Grid.Col key={key} span={{ ...gridColumns }}>
              <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
            </Grid.Col>
          ))}
        </Grid>

        return <Carousel
          w={'100%'}
          withIndicators
          loop
          slideSize={{ base: '100%', sm: '50%', md: '33.33333%' }}
          slideGap={{ base: 'xs' }}
          slidesToScroll={isMobile ? 1 : isTablet ? 2 : 3}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          styles={{
            control: {
              width: '48px',
              height: '48px',
            },
          }}
          classNames={classes}
        >
          {collections.data?.collections.map((v, k) => <Carousel.Slide key={k}>
            <BannerSlide collection={v} />
          </Carousel.Slide>)}
        </Carousel>
      }()}
    </>
  )
}


const BannerSlide: FC<{ collection: Collection }> = (props) => {
  const { image, symbol } = renderPayment(props.collection.paymentType);
  const [totalItems, setTotalItems] = useState(0);
  const theme = useMantineTheme();

  const fetchTotalItems = () => {

  }

  useEffect(() => {
    fetchTotalItems();
  }, [])

  return (
    <Link href={`/collections/${props.collection.collectionID}`}>
      <Box className={classes.banner} pos='relative'>
        <AspectRatio ratio={820 / 600} w={'100%'} style={{ overflow: 'hidden', borderRadius: rem(10) }}>
          <AppImage src={props.collection.bannerURL} alt="" className={classes.bannerImage} />
        </AspectRatio>

        <Group
          //bg={`linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))`}
          style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            borderRadius: '12px',
            position: 'absolute',
            left: 0,
            bottom: 0
          }}
        >
          <Stack color={theme.white} gap={4} m={theme.spacing.lg} style={{ zIndex: 2 }}>
            <Title size={18} c={theme.colors.text[0]}>
              {props.collection.title}
            </Title>
            <Text c={theme.colors.text[0]} size={theme.fontSizes.sm} fw='bold'>Tạo bởi {StringUtils.compact(props.collection.creatorCollection, 2, 5)}</Text>
            <Group justify="space-between" mt={4}>
              <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{totalItems} items</Text>
              <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{props.collection.averagePrice} {symbol}</Text>
            </Group>
          </Stack>
        </Group>
      </Box>
    </Link>
  )
}