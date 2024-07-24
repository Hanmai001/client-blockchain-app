import { AppButton } from "@/components/app/app-button";
import { AppConnectedButtons } from "@/components/app/app-connected-buttons";
import { AppImage } from "@/components/app/app-image";
import { AppWrapper } from "@/components/app/app-wrapper";
import { EmptyMessage } from "@/components/empty-message";
import { ErrorMessage } from "@/components/error-message";
import { onSubscribeCollection } from "@/components/modals/modal-subscribe-collection";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { renderPayment } from "@/modules/coins/utils";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection } from "@/modules/collection/types";
import { MarketPackageModule } from "@/modules/market-package/modules";
import { MarketPackage } from "@/modules/market-package/types";
import { MarketOrderModule } from "@/modules/marketorder/modules";
import { MarketOrder, MarketStatus } from "@/modules/marketorder/types";
import { NftModule } from "@/modules/nft/modules";
import { FilterOptions, Nft } from "@/modules/nft/types";
import { DateTimeUtils, StringUtils } from "@/share/utils";
import { ActionIcon, Anchor, AspectRatio, Box, Button, Card, Grid, Group, Image, Pagination, ScrollArea, Skeleton, Spoiler, Stack, Table, Text, TextInput, Title, Tooltip, Transition, rem, useMantineTheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconBorderAll, IconEdit, IconFilter, IconMenu2, IconPlus, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { NftCard } from "../../components/nft-card";
import Link from "next/link";
import { renderLinkContract } from "@/share/blockchain/context";

export const CollectionDetailScreen: FC<{ collection: Collection }> = ({ collection }) => {
  const [activePage, setPage] = useState(1);
  const [items, setItems] = useState<ListLoadState<any, 'tokens'>>({ isFetching: true, data: { tokens: [], count: 0 } });
  const theme = useMantineTheme();
  const account = useAccount();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(FilterOptions.ALL);
  const [debounced] = useDebouncedValue(search, 200);
  const [opened, setIsOpened] = useState(false);
  const [typeDisplay, setTypeDisplay] = useState(1);

  const gridColumns = {
    lg: 12 / 5,
    md: 3,
    sm: 4,
    base: 6
  }

  const fetchItems = useCallback(async () => {
    try {
      setItems(s => ({ ...s, isFetching: true, data: { tokens: [], count: 0 } }))
      let listtokens: any;
      let sort = '';
      //get list by filter
      if (filter !== FilterOptions.ALL) {
        if (filter === FilterOptions.MOST_VIEWS) sort = '-totalViews';
        if (filter === FilterOptions.MOST_SHARES) sort = '-totalShares';
        if (filter === FilterOptions.MOST_LIKES) sort = '-listOfLikedUsers';
        if (filter === FilterOptions.OLDEST) sort = '+createdAt';
        if (filter === FilterOptions.NEWEST) sort = '-createdAt';
      }

      const isSignedUser = account.information?.wallet === collection?.creatorCollection;

      if (filter === FilterOptions.PRICE_TO_HIGH) {
        listtokens = await MarketOrderModule.getTokensStatus({ status: MarketStatus.ISLISTING, sort: '+price', active: isSignedUser ? null : true });
      } else if (filter === FilterOptions.PRICE_TO_LOW) {
        listtokens = await MarketOrderModule.getTokensStatus({ status: MarketStatus.ISLISTING, sort: '-price', active: isSignedUser ? null : true });
      } else {
        listtokens = await NftModule.getList({ collectionID: collection.collectionID, sort, active: isSignedUser ? null : true });
      }

      if (search.length > 0 && !!listtokens.data.tokens) {
        const tokens = listtokens.data.tokens.filter((v: any, k: any) => {
          if (v?.title.includes(search) || v?.description.includes(search)) return true;
          return false;
        })
        listtokens.data.tokens = tokens;
      }
      setItems(s => ({ ...s, isFetching: false, data: { tokens: listtokens.data.tokens || [], count: listtokens.data.count || 0 } }));
    } catch (error) {
      setItems(s => ({ ...s, isFetching: false, data: { tokens: [], count: 0 } }))
    }
  }, [filter, search, account.information, collection?.creatorCollection, collection?.collectionID]);
  
  useEffect(() => {
    fetchItems();
  }, [debounced, filter, account.information])

  return <AppWrapper>
    <Stack>
      {function () {
        if (!collection) return <Skeleton w={'100%'} height={200} />

        return <BannerSection collection={collection} />
      }()}

      <Group mx={theme.spacing.md}>
        <img src="/images/default/note.svg" width={24} height={24} />
        <Spoiler maxHeight={120} showLabel="Xem thêm" hideLabel="Ẩn" >
          <Text c={theme.colors.gray[7]}>{collection?.description || ""}</Text>
        </Spoiler>
      </Group>

      <Box mx={theme.spacing.md}>
        <Group mb={theme.spacing.lg} gap='xs' pos='relative'>
          <Text c={theme.colors.text[1]} fw={500}>{items.data?.count !== 0 ? items.data?.tokens.length : 0} {"kết quả"}</Text>
          <ActionIcon
            color={theme.colors.primary[5]}
            variant="light"
            h={40}
            radius={8}
            w={40}
            onClick={() => setIsOpened(s => !s)}
          >
            <IconFilter />
          </ActionIcon>
          <TextInput placeholder="Nhập từ khóa" flex={1} rightSection={<IconSearch />} radius={10} styles={{
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
          <Group gap={0}>
            <ActionIcon
              variant={typeDisplay === 1 ? "light" : 'transparent'}
              h={40}
              radius={8}
              w={40}
              onClick={() => setTypeDisplay(1)}
            >
              <IconBorderAll />
            </ActionIcon>
            <ActionIcon
              variant={typeDisplay === 2 ? "light" : 'transparent'}
              h={40}
              radius={8}
              w={40}
              onClick={() => setTypeDisplay(2)}
            >
              <IconMenu2 />
            </ActionIcon>
          </Group>

          <Transition
            mounted={opened}
            transition="fade"
            duration={200}
            timingFunction="ease"
            keepMounted
          >
            {(styles) => <Card radius={8} pos="absolute" shadow="sm" w={'100%'} mah={600} top={50} withBorder
              style={{
                zIndex: 20,
                overflow: "auto",

                ...styles
              }}
            >
              <Stack>
                <Stack gap='xs'>
                  <Title c={theme.colors.text[1]} order={5}>
                    Bộ lọc
                  </Title>
                  <Group gap='xs'>
                    {Object.values(FilterOptions).map((v, k) => <Button
                      key={k}
                      radius={8}
                      h={40}
                      color={theme.colors.primary[5]}
                      variant={filter === v ? "outline" : "default"}
                      onClick={() => setFilter(v)}
                      style={{ fontWeight: 'normal' }}
                    >
                      {v}
                    </Button>)}
                  </Group>
                </Stack>
              </Stack>
            </Card>}
          </Transition>
        </Group>

        {typeDisplay === 1 && function () {
          if (items.isFetching || !items.data?.tokens) return <Grid>
            {Array(8).fill(0).map((_, key) => (
              <Grid.Col key={key} span={{ ...gridColumns }}>
                <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
              </Grid.Col>
            ))}
          </Grid>

          if (items.error) return <Group><ErrorMessage error={items.error} /></Group>

          if (items.data?.count === 0) return <EmptyMessage />

          return <Grid gutter={theme.spacing.xs}>
            {items.data?.tokens.map((v, k) => (
              <Grid.Col key={k} span={{ ...gridColumns }}>
                <NftCard nft={v} key={k} />
              </Grid.Col>
            ))}
          </Grid>
        }()}

        {typeDisplay === 2 && function () {
          if (items.isFetching || !items.data?.tokens) return <Grid>
            {Array(8).fill(0).map((_, key) => (
              <Grid.Col key={key} span={{ base: 12 }}>
                <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
              </Grid.Col>
            ))}
          </Grid>

          if (items.error) return <Group><ErrorMessage error={items.error} /></Group>

          if (items.data?.count === 0) return <EmptyMessage />

          return <ScrollArea offsetScrollbars>
            <Table
              miw={800}
              highlightOnHover
              styles={{
                td: {
                  padding: '12px 10px'
                },
                th: {
                  fontSize: '16px',
                  fontWeight: 'normal'
                },

              }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th flex={1}>#</Table.Th>
                  <Table.Th flex={5}>Video</Table.Th>
                  <Table.Th flex={1}>Giá</Table.Th>
                  <Table.Th flex={1}>Ngày đăng</Table.Th>
                  <Table.Th flex={1} visibleFrom="sm">Lượt xem</Table.Th>
                  <Table.Th flex={2}>Người sở hữu</Table.Th>
                  <Table.Th flex={1}></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.data.tokens.map((v, k) => <NftItem key={k} nft={v} />)}
              </Table.Tbody>
            </Table>
          </ScrollArea>
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

    <AppConnectedButtons />
  </AppWrapper>
}

const BannerSection: FC<{ collection: Collection }> = (props) => {
  const theme = useMantineTheme();
  const { symbol } = renderPayment(props.collection.paymentType);
  const [totalItems, setTotalItems] = useState(0);
  const { isMobile } = useResponsive();
  const account = useAccount();
  const [marketPackage, setMarketPackage] = useState<MarketPackage | null>(null);
  const isSignedUser = account.information?.wallet === props.collection?.creatorCollection;

  const fetchItemsOfCollection = async () => {
    try {
      const listtokens = await NftModule.getList({ collectionID: props.collection?.collectionID });
      setTotalItems(listtokens.data?.count || 0);
    } catch (error) {

    }
  }

  const fetchMarketPackage = async () => {
    try {
      const res = await MarketPackageModule.getListOfUser({ collectionID: props.collection?.collectionID });
      setMarketPackage(res.data[0] || null);
    } catch (error) {
      setMarketPackage(null);
    }
  }

  const updateTotalViews = async () => {
    try {
      await CollectionModule.increaseTotalViews(props.collection?.collectionID);
    } catch (error) {

    }
  }

  useEffect(() => {
    if (props.collection) {
      fetchItemsOfCollection();
      updateTotalViews();
    }
  }, [props.collection])

  useEffect(() => {
    fetchMarketPackage();
  }, [account.information])

  return (
    <Box pos='relative'>
      <AspectRatio ratio={isMobile ? 400 / 200 : 400 / 100} style={{ overflow: 'hidden' }}>
        <AppImage src={props.collection.bannerURL} alt="" />
      </AspectRatio>

      <Group
        bg={`linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))`}
        style={{
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          position: 'absolute',
          left: 0,
          bottom: 0
        }}
        w={'100%'}
      >
        <Group>
          <Stack color={theme.white} gap={6} m={theme.spacing.lg} style={{ zIndex: 2 }}>
            <Title order={3} c={theme.colors.text[0]}>
              {props.collection.title}
            </Title>
            <Text c={theme.colors.text[0]} size={theme.fontSizes.sm} fw='bold'>Tạo bởi {StringUtils.compact(props.collection?.creatorCollection, 2, 5)}</Text>
            <Group justify="space-between" mt={4}>
              <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{totalItems || 0} items</Text>
              <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{props.collection.averagePrice} {symbol}</Text>
            </Group>
          </Stack>

          {!isSignedUser && !marketPackage && <AppButton
            color={theme.colors.primary[5]}
            height={45}
            px={20}
            radius={8}
            leftSection={<IconPlus size={18} />}
            onClick={() => onSubscribeCollection({ collection: props.collection, onUpdate: () => fetchMarketPackage() })}
          >
            Đăng kí kênh
          </AppButton>}
        </Group>

        <Group m={isMobile ? 'auto' : theme.spacing.lg} gap={isMobile ? 20 : 40} visibleFrom="sm">
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
    </Box>
  )
}

const NftItem: FC<{ nft: Nft }> = ({ nft }) => {
  const theme = useMantineTheme();
  const [marketOrder, setMarketOrder] = useState<MarketOrder>();
  const [lastSoldOrder, setLastSoldOrder] = useState<MarketOrder>();
  const [payment, setPayment] = useState({ image: '', symbol: '' });
  const { push } = useRouter();

  const fetchMarketOrderOfToken = async () => {
    try {
      const checkListed = await MarketOrderModule.checkTokenIsListed(nft.tokenID, { status: MarketStatus.ISLISTING });
      if (checkListed) {
        const res = await MarketOrderModule.getListOrders({ tokenID: nft.tokenID, limit: 1, offset: 0, status: MarketStatus.ISLISTING });
        const { image, symbol } = renderPayment(res.data.order[0].paymentType);
        setPayment({ image, symbol });
        setMarketOrder(res.data.order[0]);
        setLastSoldOrder(undefined);
      } else {
        //If NFT isn't listed, so get the nearest SOLD order
        const res = await MarketOrderModule.getListOrders({ tokenID: nft.tokenID, status: MarketStatus.SOLD, sort: '-createdAt' });
        const { image, symbol } = renderPayment(res.data.order[0].paymentType);
        setPayment({ image, symbol });
        setLastSoldOrder(res.data.order[0]);
      }
    } catch (error) {
      // onError(error);
    }
  }

  useEffect(() => {
    if (nft) fetchMarketOrderOfToken();
  }, [nft])

  return (
    <Table.Tr
      onClick={() => push(`/nfts/${nft.tokenID}`)}
      style={{
        cursor: 'pointer'
      }}
    >
      <Table.Td>
        <Text fw="bold" c={theme.colors.text[1]}>
          {nft.tokenID}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group>
          <AspectRatio ratio={100 / 120} w={64}>
            <Image src={nft.avatar} />
          </AspectRatio>

          <Tooltip label={nft.title}>
            <Text fw="bold" c={theme.colors.text[1]}>{StringUtils.limitCharacters(nft.title, 15)}</Text>
          </Tooltip>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fw="bold" c={theme.colors.text[1]}>
          {marketOrder?.price || lastSoldOrder?.price || "Chưa được bán"} {payment.symbol}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text c={theme.colors.text[1]}>
          {DateTimeUtils.formatToShow(nft.createdAt, false)}
        </Text>
      </Table.Td>
      <Table.Td visibleFrom="sm">
        <Text c={theme.colors.text[1]}>
          {nft.totalViews || 0}
        </Text>
      </Table.Td>
      <Table.Td>
        <Link href={renderLinkContract(nft.creator, nft.chainID)} target="_blank" style={{
          color: theme.colors.blue[6],
          textDecoration: 'underline',
          fontSize: '15px'
        }}>{StringUtils.compact(nft.creator, 5, 5)}</Link>
      </Table.Td>
      <Table.Td visibleFrom="sm">
        <Link href={`/nfts/edit/${nft.tokenID}`}>
          <ActionIcon
            color={theme.colors.primary[5]}
            variant="light"
          >
            <IconEdit stroke={1.5} />
          </ActionIcon>
        </Link>
      </Table.Td>
    </Table.Tr>
  )
}