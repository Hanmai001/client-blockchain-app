import { AppImage } from "@/components/app/app-image";
import { useResponsive } from "@/modules/app/hooks";
import { renderPayment } from '@/modules/coins/utils';
import { Collection } from '@/modules/collection/types';
import { StringUtils } from "@/share/utils";
import { AspectRatio, Box, Group, Stack, Text, Title, rem, useMantineTheme } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import Slider from "react-slick";
import { ListLoadState } from "../../../types";
import classes from '../../styles/Marketplace.module.scss';

const listcollections = [
  {
    _id: 'afdsf',
    tokenId: '2',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://i.pinimg.com/736x/9a/ed/f1/9aedf1aa575ddcb86a63f91f258833bc.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    averagePrice: 0.56,
    paymentType: "3",
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '1',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://www.tnmt.edu.vn/wp-content/uploads/2023/11/hinh-nen-dep-nhat-the-gioi.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    paymentType: "3",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '3',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/12/hinh-nen-vu-tru-72.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    paymentType: "3",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '4',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/12/hinh-nen-vu-tru-67.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    averagePrice: 0.56,
    paymentType: "3",
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '5',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://msmobile.com.vn/upload_images/images/tai-hinh-nen-cho-may-tinh-dep-nhat-the-gioi-12.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    paymentType: "3",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '6',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://i.pinimg.com/originals/c2/e9/02/c2e902e031e1d9d932411dd0b8ab5eef.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    paymentType: "3",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
]

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

export const BannerSection: FC = () => {
  const [collections, setCollections] = useState<ListLoadState<any, 'collections'>>({ isFetching: true, data: { collections: listcollections } });
  const theme = useMantineTheme();
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

  return (
    <>
      {function () {
        // if (collections.isFetching || !collections.data) return <Grid>
        //   {Array(3).fill(0).map((_, key) => (
        //     <Grid.Col key={key} span={{ ...gridColumns }}>
        //       <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
        //     </Grid.Col>
        //   ))}
        // </Grid>

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