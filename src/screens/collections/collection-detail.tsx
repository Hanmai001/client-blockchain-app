import { Collection } from "@/modules/collection/types";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { AppWrapper } from "@/components/app/app-wrapper";
import { AspectRatio, Box, Group, Stack, Title, useMantineTheme, Text, rem, Grid, TextInput, Skeleton, Pagination } from "@mantine/core";
import { useParams } from "next/navigation";
import classes from '../../styles/collections/CollectionDetail.module.scss';
import { AppImage } from "@/components/app/app-image";
import { StringUtils } from "@/share/utils";
import { renderPayment } from "@/modules/coins/utils";
import { NftCard } from "../../components/nft-card";
import { IconSearch } from "@tabler/icons-react";
import { MyCombobox } from "../marketplace";
import { FilterOptions } from "@/modules/nft/types";
import { useDebouncedValue } from "@mantine/hooks";
import { AppCreateButton } from "@/components/app/app-create-button";

export const CollectionDetailScreen: FC = () => {
  const params = useParams<{ id: string }>();
  const [activePage, setPage] = useState(1);

  const nfts = [
    {
      tokenId: '1',
      _id: '1',
      creator: 'dsfdsf',
      tokenUri: 'dsfdsf',
      collection: {
        createdAt: '12/09/2023',
        updated: '12/09/2023',
        creator: '0vvdsd',
        bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
        title: "Hình nền đẹp",
        totalViews: 12345,
        totalItems: 12,
        averagePrice: 0.56,
        paymentType: '0'
      },
      owner: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
      chainId: '97',
      title: 'Cậu học trò chứng minh bài học vật lý',
      description: "The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣",
      source: "https://www.youtube.com/watch?v=g20t_K9dlhU&list=RDzENVcKkqZWg&index=27",
      totalViews: 0,
      totalLikes: 0,
      totalShare: 0,
    },
    {
      tokenId: '2',
      _id: '2',
      creator: 'dsfdsf',
      tokenUri: 'dsfdsf',
      collection: {
        createdAt: '12/09/2023',
        updated: '12/09/2023',
        creator: '0vvdsd',
        bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
        title: "Hình nền đẹp",
        totalViews: 12345,
        totalItems: 12,
        averagePrice: 0.56,
        paymentType: '0'
      },
      owner: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
      chainId: '97',
      title: 'Cậu học trò chứng minh bài học vật lý',
      description: "The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣",
      source: "https://www.youtube.com/watch?v=g20t_K9dlhU&list=RDzENVcKkqZWg&index=27",
      totalViews: 0,
      totalLikes: 0,
      totalShare: 0,
    },
    {
      tokenId: '3',
      _id: '3',
      creator: 'dsfdsf',
      tokenUri: 'dsfdsf',
      collection: {
        createdAt: '12/09/2023',
        updated: '12/09/2023',
        creator: '0vvdsd',
        bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
        title: "Hình nền đẹp",
        totalViews: 12345,
        totalItems: 12,
        averagePrice: 0.56,
        paymentType: '0'
      },
      owner: 'dsfdsf',
      chainId: '97',
      title: 'Cậu học trò chứng minh bài học vật lý',
      description: "The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣",
      source: "https://www.youtube.com/watch?v=g20t_K9dlhU&list=RDzENVcKkqZWg&index=27",
      totalViews: 0,
      totalLikes: 0,
      totalShare: 0,
    },
    {
      tokenId: '4',
      _id: '4',
      creator: 'dsfdsf',
      tokenUri: 'dsfdsf',
      collection: {
        createdAt: '12/09/2023',
        updated: '12/09/2023',
        creator: '0vvdsd',
        bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
        title: "Hình nền đẹp",
        totalViews: 12345,
        totalItems: 12,
        averagePrice: 0.56,
        paymentType: '0'
      },
      owner: 'dsfdsf',
      chainId: '97',
      title: 'Cậu học trò chứng minh bài học vật lý',
      description: "The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣",
      source: "https://www.youtube.com/watch?v=g20t_K9dlhU&list=RDzENVcKkqZWg&index=27",
      totalViews: 0,
      totalLikes: 0,
      totalShare: 0,
    },
    {
      tokenId: '5',
      _id: '5',
      creator: 'dsfdsf',
      tokenUri: 'dsfdsf',
      collection: {
        createdAt: '12/09/2023',
        updated: '12/09/2023',
        creator: '0vvdsd',
        bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
        title: "Hình nền đẹp",
        totalViews: 12345,
        totalItems: 12,
        averagePrice: 0.56,
        paymentType: '0'
      },
      owner: 'dsfdsf',
      chainId: '97',
      title: 'Cậu học trò chứng minh bài học vật lý',
      description: "The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣",
      source: "https://www.youtube.com/watch?v=g20t_K9dlhU&list=RDzENVcKkqZWg&index=27",
      totalViews: 0,
      totalLikes: 0,
      totalShare: 0,
    },
    {
      tokenId: '6',
      _id: '6',
      creator: 'dsfdsf',
      tokenUri: 'dsfdsf',
      collection: {
        createdAt: '12/09/2023',
        updated: '12/09/2023',
        creator: '0vvdsd',
        bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
        title: "Hình nền đẹp",
        totalViews: 12345,
        totalItems: 12,
        averagePrice: 0.56,
        paymentType: '0'
      },
      owner: 'dsfdsf',
      chainId: '97',
      title: 'Cậu học trò chứng minh bài học vật lý',
      description: "The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣",
      source: "https://www.youtube.com/watch?v=g20t_K9dlhU&list=RDzENVcKkqZWg&index=27",
      totalViews: 0,
      totalLikes: 0,
      totalShare: 0,
    },
  ]

  const [items, setItems] = useState<ListLoadState<any, 'nfts'>>({ isFetching: true, data: { nfts: nfts } });
  const theme = useMantineTheme();
  const [collection, setCollection] = useState<any>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(FilterOptions.PRICE_TO_LOW);
  const [debounced] = useDebouncedValue(search, 200);

  const fetchItems = async () => {
    let data = items.data; //test nên gán items.data nhaa

    try {
      //get list by filter
    } catch (error) {

    }
    if (search.length > 0) {
      data = data?.filter((v, k) => {
        if (v.title.includes(search) || v.description.includes(search)) return true;
        return false;
      })
    }
    setItems(s => ({ ...s, data: data }));
  }

  const fetchCollection = async () => {
    try {

    } catch (error) {

    }
  }

  useEffect(() => {
    fetchItems();
  }, [search, filter])

  useEffect(() => {
    setCollection({
      createdAt: '12/09/2023',
      updated: '12/09/2023',
      creator: '0vvdsd',
      bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
      title: "Hình nền đẹp",
      totalViews: 12345,
      totalItems: 12,
      averagePrice: 0.56,
      paymentType: '0'
    })
  }, [])

  const gridColumns = {
    lg: 3,
    sm: 4,
    xs: 6
  }

  const fetchItemsOfCollection = async () => {
    try {

    } catch (error) {

    }
  }

  useEffect(() => {
    fetchItemsOfCollection();
  }, []);

  return <AppWrapper>
    <Stack>
      {function () {
        if (!collection) return <Skeleton w={'100%'} height={200} />

        return <BannerSection collection={collection} />
      }()}


      <Box m={theme.spacing.md}>
        <Group mb={theme.spacing.lg}>
          <Text c={theme.colors.text[1]} fw={500}>{items.data?.nfts.length} {"kết quả"}</Text>
          <TextInput placeholder="Nhập từ khóa" miw={'30%'} rightSection={<IconSearch />} radius={10} styles={{
            input: {
              height: '45px',
            },
            section: {
              paddingRight: `${theme.spacing.md}`
            }
          }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <MyCombobox
            initialValue={FilterOptions.PRICE_TO_LOW}
            options={FilterOptions}
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
            classNamesInput={classes.comboboxInput}
            classNamesRoot={classes.comboboxRootInput}
            onChange={() => { }}
          />
        </Group>
        {function () {
          // if (items.isFetching || !items.data) return <Grid>
          //   {Array(3).fill(0).map((_, key) => (
          //     <Grid.Col key={key} span={{ ...gridColumns }}>
          //       <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
          //     </Grid.Col>
          //   ))}
          // </Grid>

          // if (items.error) return <Group><ErrorBox error={items.error} /></Group>

          // if (!items.data.length) return <EmptyBox />

          return <Grid gutter={theme.spacing.md}>
            {items.data?.nfts.map((v, k) => (
              <Grid.Col key={k} span={{ ...gridColumns }}>
                <NftCard nft={v} key={k} />
              </Grid.Col>
            ))}
          </Grid>
        }()}
      </Box>

      <Pagination color={theme.colors.primary[5]} total={20} siblings={2} value={activePage} onChange={setPage} styles={{
          root: {
            margin: "auto",
            marginTop: '40px'
          },
          control: {
            padding: '20px 15px',
          }
        }}
        classNames={{
          control: classes.control
        }}
      />
    </Stack>

    <AppCreateButton />
  </AppWrapper>
}

const BannerSection: FC<{ collection: any }> = (props) => {
  const theme = useMantineTheme();
  const { symbol } = renderPayment(props.collection.paymentType);

  return (
    <AspectRatio ratio={400 / 100} style={{ overflow: 'hidden' }}>
      <AppImage src={props.collection.bannerUrl} alt="" />

      <Group
        bg={`linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))`}
        style={{
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}
        w={'100%'}
      >
        <Stack color={theme.white} gap={4} m={theme.spacing.lg} style={{ zIndex: 2 }}>
          <Title size={18} c={theme.colors.text[0]}>
            {props.collection.title}
          </Title>
          <Text c={theme.colors.text[0]} size={theme.fontSizes.sm} fw='bold'>Tạo bởi {StringUtils.compact(props.collection.creator, 2, 5)}</Text>
          <Group justify="space-between" mt={4}>
            <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{props.collection.totalItems} items</Text>
            <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{props.collection.averagePrice} {symbol}</Text>
          </Group>
        </Stack>

        <Group m={theme.spacing.lg} gap={40}>
          <Stack gap={4} style={{ textAlign: "center" }}>
            <Text c={theme.colors.text[0]}>Tổng Video</Text>
            <Text c={theme.colors.text[0]} fw={500} size="22px">{props.collection.totalItems}</Text>
          </Stack>

          <Stack gap={4} style={{ textAlign: "center" }}>
            <Text c={theme.colors.text[0]}>Lượt xem</Text>
            <Text c={theme.colors.text[0]} fw={500} size="22px">{props.collection.totalViews}</Text>
          </Stack>

          <Stack gap={4} style={{ textAlign: "center" }}>
            <Text c={theme.colors.text[0]}>Tỷ giá trung bình</Text>
            <Text c={theme.colors.text[0]} fw={500} size="22px">{props.collection.averagePrice} {symbol}</Text>
          </Stack>
        </Group>
      </Group>
    </AspectRatio>
  )
}