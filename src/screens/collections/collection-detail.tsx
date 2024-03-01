import { AppCreateButton } from "@/components/app/app-create-button";
import { AppImage } from "@/components/app/app-image";
import { AppWrapper } from "@/components/app/app-wrapper";
import { EmptyMessage } from "@/components/empty-message";
import { ErrorMessage } from "@/components/error-message";
import { useAccount } from "@/modules/account/context";
import { renderPayment } from "@/modules/coins/utils";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection } from "@/modules/collection/types";
import { NftModule } from "@/modules/nft/modules";
import { FilterOptions } from "@/modules/nft/types";
import { StringUtils } from "@/share/utils";
import { AspectRatio, Box, Grid, Group, Pagination, Skeleton, Spoiler, Stack, Text, TextInput, Title, rem, useMantineTheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { NftCard } from "../../components/nft-card";
import classes from '../../styles/collections/CollectionDetail.module.scss';
import { MyCombobox } from "@/components/combobox/my-combobox";
import { MarketOrderModule } from "@/modules/marketorder/modules";
import { MarketStatus } from "@/modules/marketorder/types";
import { useResponsive } from "@/modules/app/hooks";

export const CollectionDetailScreen: FC<{ collection: Collection }> = ({ collection }) => {
  const [activePage, setPage] = useState(1);
  const [items, setItems] = useState<ListLoadState<any, 'tokens'>>({ isFetching: true, data: { tokens: [], count: 0 } });
  const theme = useMantineTheme();
  const account = useAccount();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(FilterOptions.ALL);
  const [debounced] = useDebouncedValue(search, 200);
  const { isMobile, isTablet } = useResponsive();

  const gridColumns = {
    lg: 3,
    sm: 4,
    xs: 6
  }

  const fetchItems = async () => {
    try {
      let listtokens: any;
      let sort = '';
      //get list by filter
      if (filter !== FilterOptions.ALL) {
        // if (filter === FilterOptions.PRICE_TO_HIGH) sort = '+price';
        // if (filter === FilterOptions.PRICE_TO_LOW) sort = '-price';
        if (filter === FilterOptions.MOST_VIEWS) sort = '-totalViews';
        if (filter === FilterOptions.MOST_SHARES) sort = '-totalShare';
        if (filter === FilterOptions.MOST_LIKES) sort = '-listOfLikedUsers';
        if (filter === FilterOptions.OLDEST) sort = '+createdAt';
        if (filter === FilterOptions.NEWEST) sort = '-createdAt';
      }

      const isSignedUser = account.information?.wallet === collection.creatorCollection;

      if (filter === FilterOptions.PRICE_TO_HIGH) {
        listtokens = await MarketOrderModule.getTokensStatus({ status: MarketStatus.ISLISTING, sort: '+price', active: isSignedUser ? null : true });
        console.log("list tokens: ", listtokens)
      } else if (filter === FilterOptions.PRICE_TO_LOW) {
        listtokens = await MarketOrderModule.getTokensStatus({ status: MarketStatus.ISLISTING, sort: '-price', active: isSignedUser ? null : true });
        console.log("list tokens: ", listtokens)
      } else {
        listtokens = await NftModule.getList({ collectionID: collection.collectionID, sort, active: isSignedUser ? null : true });
      }

      if (search.length > 0 && !!listtokens.data.tokens) {
        const tokens = listtokens.data.tokens.filter((v: any, k: any) => {
          if (v.title.includes(search) || v.description.includes(search)) return true;
          return false;
        })
        listtokens.data.tokens = tokens;
      }
      setItems(s => ({ ...s, isFetching: false, data: { tokens: listtokens.data.tokens || [], count: listtokens.data.count || 0 } }));
    } catch (error) {
      setItems(s => ({ ...s, isFetching: false, data: { tokens: [], count: 0 } }))
    }
  }

  useEffect(() => {
    fetchItems();
  }, [debounced, filter, account.information?.wallet])

  useEffect(() => {
    fetchItems();
  }, [])

  return <AppWrapper>
    <Stack>
      {function () {
        if (!collection) return <Skeleton w={'100%'} height={200} />

        return <BannerSection collection={collection} />
      }()}

      <Group mx={theme.spacing.md}>
        <img src="/images/default/note.svg" width={24} height={24} />
        <Spoiler maxHeight={120} showLabel="Xem thêm" hideLabel="Ẩn" >
          <Text c={theme.colors.gray[7]}>{collection.description}</Text>
        </Spoiler>
      </Group>

      <Box mx={theme.spacing.md}>
        <Group grow={isTablet ? true : false} mb={theme.spacing.lg} justify={isTablet ? "space-between" : ''}>
          <Text c={theme.colors.text[1]} fw={500}>{items.data?.count !== 0 ? items.data?.tokens.length : 0} {"kết quả"}</Text>
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
            initialvalue={FilterOptions.ALL}
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
            classnamesinput={classes.comboboxInput}
            classnamesroot={classes.comboboxRootInput}
            onChange={(value) => { setFilter(value) }}
          />
        </Group>
        {function () {
          if (items.isFetching || !items.data?.tokens) return <Grid>
            {Array(8).fill(0).map((_, key) => (
              <Grid.Col key={key} span={{ ...gridColumns }}>
                <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
              </Grid.Col>
            ))}
          </Grid>

          if (items.error) return <Group><ErrorMessage error={items.error} /></Group>

          if (items.data?.count === 0) return <EmptyMessage />

          return <Grid gutter={theme.spacing.md}>
            {items.data?.tokens.map((v, k) => (
              <Grid.Col key={k} span={{ ...gridColumns }}>
                <NftCard nft={v} key={k} />
              </Grid.Col>
            ))}
          </Grid>
        }()}
      </Box>

      <Pagination color={theme.colors.primary[5]} total={Math.ceil(items.data!.count! / 10)} siblings={2} value={activePage} onChange={setPage} styles={{
        root: {
          margin: "auto",
          marginTop: '40px'
        },
        control: {
          padding: '20px 15px',
        }
      }}
        className="pagination-control"
      />
    </Stack>

    <AppCreateButton />
  </AppWrapper>
}

const BannerSection: FC<{ collection: Collection }> = (props) => {
  const theme = useMantineTheme();
  const { symbol } = renderPayment(props.collection.paymentType);
  const [totalItems, setTotalItems] = useState(0);
  const { isMobile } = useResponsive();

  const fetchItemsOfCollection = async () => {
    try {
      const listtokens = await NftModule.getList({ collectionID: props.collection.collectionID });
      setTotalItems(listtokens.data?.count || 0);
    } catch (error) {

    }
  }

  const updateTotalViews = async () => {
    try {
      await CollectionModule.increaseTotalViews(props.collection.collectionID);
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchItemsOfCollection();
    updateTotalViews();
  }, [props.collection])

  return (
    <AspectRatio ratio={isMobile ? 400 / 200 : 400 / 100} style={{ overflow: 'hidden' }}>
      <AppImage src={props.collection.bannerURL} alt="" />

      <Group
        bg={`linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))`}
        style={{
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}
        w={'100%'}
      >
        <Stack color={theme.white} gap={4} m={isMobile ? 'auto' : theme.spacing.lg} style={{ zIndex: 2 }}>
          <Title size={18} c={theme.colors.text[0]}>
            {props.collection.title}
          </Title>
          <Text c={theme.colors.text[0]} size={theme.fontSizes.sm} fw='bold'>Tạo bởi {StringUtils.compact(props.collection.creatorCollection, 2, 5)}</Text>
          <Group justify="space-between" mt={4}>
            <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{totalItems || 0} items</Text>
            <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{props.collection.averagePrice} {symbol}</Text>
          </Group>
        </Stack>

        <Group m={isMobile ? 'auto' : theme.spacing.lg} gap={isMobile ? 20 : 40}>
          <Stack gap={4} style={{ textAlign: "center" }}>
            <Text c={theme.colors.text[0]}>Tổng Video</Text>
            <Text c={theme.colors.text[0]} fw={500} size={isMobile ? "18px" : "22px"}>{totalItems || 0}</Text>
          </Stack>

          <Stack gap={4} style={{ textAlign: "center" }}>
            <Text c={theme.colors.text[0]}>Lượt xem</Text>
            <Text c={theme.colors.text[0]} fw={500} size={isMobile ? "18px" : "22px"}>{props.collection.totalViews}</Text>
          </Stack>

          <Stack gap={4} style={{ textAlign: "center" }}>
            <Text c={theme.colors.text[0]}>Tỷ giá trung bình</Text>
            <Text c={theme.colors.text[0]} fw={500} size={isMobile ? "18px" : "22px"}>{props.collection.averagePrice} {symbol}</Text>
          </Stack>
        </Group>
      </Group>
    </AspectRatio>
  )
}