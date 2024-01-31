import { AppCreateButton } from "@/components/app/app-create-button";
import { AppImage } from "@/components/app/app-image";
import { AppWrapper } from "@/components/app/app-wrapper";
import { EmptyMessage } from "@/components/empty-message";
import { ErrorMessage } from "@/components/error-message";
import { renderPayment } from "@/modules/coins/utils";
import { Collection } from "@/modules/collection/types";
import { NftModule } from "@/modules/nft/modules";
import { FilterOptions } from "@/modules/nft/types";
import { StringUtils } from "@/share/utils";
import { AspectRatio, Box, Grid, Group, Pagination, Skeleton, Stack, Text, TextInput, Title, rem, useMantineTheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { NftCard } from "../../components/nft-card";
import classes from '../../styles/collections/CollectionDetail.module.scss';
import { MyCombobox } from "../marketplace";

export const CollectionDetailScreen: FC<{ collection: Collection }> = ({ collection }) => {
  const [activePage, setPage] = useState(1);
  const [items, setItems] = useState<ListLoadState<any, 'tokens'>>({ isFetching: true, data: { tokens: [], count: 0 } });
  const theme = useMantineTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(FilterOptions.ALL);
  const [debounced] = useDebouncedValue(search, 200);

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
        if (filter === FilterOptions.MOST_VIEWS) sort = '+totalViews';
        if (filter === FilterOptions.MOST_SHARES) sort = '+totalShare';
        if (filter === FilterOptions.MOST_LIKES) sort = '+totalLikes';
        if (filter === FilterOptions.OLDEST) sort = '+createdAt';
        if (filter === FilterOptions.NEWEST) sort = '-createdAt';
      }

      listtokens = await NftModule.getList({ collectionID: collection.collectionID, sort, active: true });
      console.log("fs", listtokens)
      if (search.length > 0 && !!listtokens.data.tokens) {
        const tokens = listtokens.data.tokens.filter((v: any, k: any) => {
          if (v.title.includes(search) || v.description.includes(search)) return true;
          return false;
        })
        listtokens.data.tokens = tokens;
      }
      setItems(s => ({ ...s, isFetching: false, data: { tokens: listtokens.data.tokens, count: listtokens.data.count } }));
    } catch (error) {
      setItems(s => ({ ...s, isFetching: false, data: { tokens: [], count: 0 } }))
      // onError(error);
      throw error
    }
  }

  useEffect(() => {
    fetchItems();
  }, [debounced, filter])

  useEffect(() => {
    fetchItems();
  }, [])

  return <AppWrapper>
    <Stack>
      {function () {
        if (!collection) return <Skeleton w={'100%'} height={200} />

        return <BannerSection collection={collection} />
      }()}


      <Box m={theme.spacing.md}>
        <Group mb={theme.spacing.lg}>
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
            initialValue={FilterOptions.ALL}
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
        classNames={{
          control: classes.control
        }}
      />
    </Stack>

    <AppCreateButton />
  </AppWrapper>
}

const BannerSection: FC<{ collection: Collection }> = (props) => {
  const theme = useMantineTheme();
  const { symbol } = renderPayment(props.collection.paymentType);
  const [totalItems, setTotalItems] = useState(0);

  const fetchItemsOfCollection = async () => {
    try {

    } catch (error) {

    }
  }

  useEffect(() => {
    fetchItemsOfCollection();
  }, [props.collection])

  return (
    <AspectRatio ratio={400 / 100} style={{ overflow: 'hidden' }}>
      <AppImage src={props.collection.bannerURL} alt="" />

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
            <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{totalItems || 0} items</Text>
            <Text c={theme.colors.text[0]} size={theme.fontSizes.sm}>{props.collection.averagePrice} {symbol}</Text>
          </Group>
        </Stack>

        <Group m={theme.spacing.lg} gap={40}>
          <Stack gap={4} style={{ textAlign: "center" }}>
            <Text c={theme.colors.text[0]}>Tổng Video</Text>
            <Text c={theme.colors.text[0]} fw={500} size="22px">{totalItems || 0}</Text>
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