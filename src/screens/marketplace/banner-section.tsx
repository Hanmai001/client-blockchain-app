import { AspectRatio, Group, Skeleton, Stack, Text, Title, rem, useMantineTheme } from "@mantine/core";
import { FC, useState } from "react";
import { DataLoadState } from "../../../types";
import { AppImage } from "@/components/app/app-image";
import { useHover } from "@mantine/hooks";
import classes from '../../styles/Marketplace.module.scss';
import { ClassNames, StringUtils } from "@/share/utils";
import { useResponsive } from "@/modules/app/hooks";

const collection = {
  _id: 'afdsf',
  id: '2',
  chainId: '1',
  creator: '0vvdsd',
  bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
  title: "Hình nền đẹp",
  totalViews: 12345,
  totalItems: 12,
  averagePrice: "0.56 BNB"
}

export const BannerSection: FC = () => {
  const test = {
    _id: 'afdsf',
    id: '2',
    chainId: '1',
    creator: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
    bannerUrl: 'https://www.invert.vn/media/uploads/uploads/2022/10/04155838-2.jpeg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    averagePrice: "0.56 BNB"
  }
  const [collection, setCollection] = useState<DataLoadState<any>>({ isFetching: true, data: test });
  const { hovered, ref } = useHover();
  const theme = useMantineTheme();
  const { isMobile } = useResponsive();

  return (
    <AspectRatio ratio={820 / 300} ref={ref} style={{overflow: 'hidden', borderRadius: rem(10)}}>
      {function () {
        // if (collection.isFetching || !collection.data) return <Skeleton />

        return <>
          <AppImage src={collection.data.bannerUrl} alt=""
            style={{ 
              transition: '0.2s', 
              transform: `scale(${hovered ? 1.05 : 1})`,
              borderRadius: rem(10)
            }}
            className={ClassNames({
              [classes.image]: true,
              [classes.placeholder]: collection.isFetching || !collection.data,
            })}
          />

          <Group 
            bg={`linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))`}
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              borderRadius: '12px'
            }}
          >
            <Stack color={theme.white} gap={4} m={theme.spacing.lg}>
              <Title size={18} c={theme.colors.dark[0]}>
                {collection.data.title}
              </Title>
              <Text c={theme.colors.dark[0]} size={theme.fontSizes.sm} fw='bold'>Tạo bởi {StringUtils.compact(collection.data.creator, 2, 5)}</Text>
              <Group justify="space-between" mt={4}>
                <Text c={theme.colors.dark[0]} size={theme.fontSizes.sm}>{collection.data.totalItems} items</Text>
                <Text c={theme.colors.dark[0]} size={theme.fontSizes.sm}>{collection.data.averagePrice}</Text>
              </Group>
            </Stack>
          </Group>
        </>
      }()}   
    </AspectRatio>
  )
}