import { AppImage } from "@/components/app/app-image";
import { useResponsive } from "@/modules/app/hooks";
import { renderPayment } from '@/modules/coins/utils';
import { Collection, CollectionType } from '@/modules/collection/types';
import { StringUtils } from "@/share/utils";
import { AspectRatio, Box, Grid, Group, Skeleton, Stack, Text, Title, rem, useMantineTheme } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import Slider from "react-slick";
import { ListLoadState } from "../../../types";
import classes from '../../styles/Marketplace.module.scss';
import { onError } from "@/components/modals/modal-error";
import { useBlockChain } from "@/share/blockchain/context";
import { CollectionModule } from "@/modules/collection/modules";

const CustomedNextArrow: FC<any> = ({ onClick }) => {
  return (
    <div className={classes.nextArrow} onClick={onClick}>
      <IconChevronRight size={32} />
    </div>
  )
}

const CustomedPrevArrow: FC<any> = ({ onClick }) => {
  return (
    <div className={classes.prevArrow} onClick={onClick}>
      <IconChevronLeft size={32} />
    </div>
  )
}

export const BannerSection: FC<{ type: string | null }> = (props) => {
  const [collections, setCollections] = useState<ListLoadState<any, 'collections'>>({ isFetching: true, data: { collections: [], count: 0 } });
  const theme = useMantineTheme();
  const blockchain = useBlockChain();
  const { isMobile, isTablet } = useResponsive();

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
    slidesToScroll: isMobile ? 1 : isTablet ? 2 : 3,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <CustomedNextArrow />,
    prevArrow: <CustomedPrevArrow />,
  };

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
        const res = await CollectionModule.getList({ chainID: blockchain.chainId, category: props.type as string })
        filteredRes = res.data!.collections.filter(v => true);

      } else {
        const res = await CollectionModule.getList({ chainID: blockchain.chainId })
        filteredRes = res.data!.collections.filter(v => true);
      }
      filteredRes = getRandomItems(filteredRes, 9);
      setCollections(s => ({ ...s, isFetching: false, data: { collections: filteredRes, count: filteredRes.length } }));

      console.log("filtered res: ", collections)
    } catch (error) {
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

        return <Slider {...settings}>
          {collections.data?.collections.map((v, k) => (
            <BannerSlide collection={v} key={k} />
          ))}
        </Slider>
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
    <Link href={`/collections/${props.collection._id}`}>
      <Box px={theme.spacing.xs} className={classes.banner}>
        <AspectRatio ratio={820 / 600} style={{ overflow: 'hidden', borderRadius: rem(10) }}>
          <AppImage src={props.collection.bannerURL} alt="" className={classes.bannerImage} />

          <Group
            //bg={`linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))`}
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              borderRadius: '12px',
            }}
          >
            <Stack color={theme.white} gap={4} m={theme.spacing.lg} style={{ zIndex: 2 }}>
              <Title size={18} c={theme.colors.text[0]}>
                {props.collection.title}
              </Title>
              <Text c={theme.colors.text[0]} size={theme.fontSizes.sm} fw='bold'>Tạo bởi {StringUtils.compact(props.collection.creator, 2, 5)}</Text>
              <Group justify="space-between" mt={4}>
                <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{totalItems} items</Text>
                <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{props.collection.averagePrice} {symbol}</Text>
              </Group>
            </Stack>
          </Group>
        </AspectRatio>
      </Box>
    </Link>
  )
}