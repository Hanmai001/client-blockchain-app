import { AppImage } from "@/components/app/app-image";
import { renderPayment } from "@/modules/coins/utils";
import { Collection } from "@/modules/collection/types";
import { StringUtils } from "@/share/utils";
import { AspectRatio, Group, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";

const listcollections = [
  {
    _id: 'afdsf',
    tokenId: '2',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    averagePrice: 0.56,
    paymentType: "0",
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '1',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    paymentType: "0",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '3',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    paymentType: "0",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '4',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    paymentType: "0",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '5',
    chainId: '97',
    creator: '0vvdsd',
    bannerURL: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    paymentType: "0",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
]
export const CollectionsRanking: FC = () => {
  const defaultState: ListLoadState<any, 'collections'> = { isFetching: true, data: { collections: listcollections } }
  const [collections, setCollections] = useState(defaultState);
  const theme = useMantineTheme();
  const fetchCollectionsRanking = () => {

  }

  useEffect(() => {
    fetchCollectionsRanking();
  }, [])

  return <Stack>
    <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
      Xếp hạng trong tháng
    </Title>

    <Stack p={theme.spacing.sm} gap={30} style={{
      borderRadius: "10px",
      border: `1px solid ${theme.colors.gray[3]}`,
      boxShadow: `1px 3px ${theme.colors.gray[0]}`
    }}>
      {function () {
        // if (collections.isFetching) return <Skeleton width={"100%"} height={300}/>

        // if (collections.error) return <Group><ErrorBox error={collections.error} /></Group>

        // if (!collections.data.length) return <EmptyBox />

        return <>
          {collections.data?.collections.map((v, k) => (
            <CollectionRaking key={k} collection={v} />
          ))}
        </>
      }()}
    </Stack>
  </Stack>
}


const CollectionRaking: FC<{ collection: Collection }> = (props) => {
  const theme = useMantineTheme();
  const { symbol } = renderPayment(props.collection.paymentType);

  return (
    <Group>
      <AspectRatio ratio={240 / 200} w={64} style={{ borderRadius: "12px", border: `2px solid ${theme.colors.primary[5]}`, overflow: "hidden" }}>
        <AppImage src={props.collection.bannerURL} style={{ borderRadius: "12px" }} />
      </AspectRatio>

      <Stack gap={0}>
        <Text fw="bold" c={theme.colors.text[1]}>{StringUtils.limitCharacters(props.collection.title, 15)}</Text>
        <Text c={theme.colors.text[1]}>{props.collection.averagePrice} {symbol}</Text>
      </Stack>
    </Group>
  )
}