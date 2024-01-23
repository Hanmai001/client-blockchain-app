import { onError } from "@/components/modals/modal-error";
import { CollectionModule } from "@/modules/collection/modules";
import { useBlockChain } from "@/share/blockchain/context";
import { Grid, Stack, Title, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { CollectionCard } from "../../components/collection-card";
import { CollectionType } from "@/modules/collection/types";

const listcollections = [
  {
    _id: 'afdsf',
    tokenId: '2',
    chainId: '97',
    creator: '0vvdsd',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    averagePrice: 0.56,
    paymentType: "0",
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '1',
    chainId: '97',
    creator: '0vvdsd',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    paymentType: "0",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '3',
    chainId: '97',
    creator: '0vvdsd',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    paymentType: "0",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
]
export const ListCollections: FC<{ type: string | null }> = (props) => {
  const defaultState: ListLoadState<any, 'collections'> = { isFetching: true, data: { collections: listcollections, count: listcollections.length } }
  const [collections, setCollections] = useState(defaultState);
  const [featuredTourism, setFeaturedTourism] = useState<ListLoadState<any, 'collections'>>({ isFetching: true });
  const [featuredGame, setFeaturedGame] = useState<ListLoadState<any, 'collections'>>({ isFetching: true });
  const [featuredLife, setFeaturedLife] = useState<ListLoadState<any, 'collections'>>({ isFetching: true });
  const [featuredEducation, setFeaturedEducation] = useState<ListLoadState<any, 'collections'>>({ isFetching: true });
  const [featuredFamily, setFeaturedFamily] = useState<ListLoadState<any, 'collections'>>({ isFetching: true });
  const [featuredFilm, setFeaturedFilm] = useState<ListLoadState<any, 'collections'>>({ isFetching: true });
  const [featuredCook, setFeaturedCook] = useState<ListLoadState<any, 'collections'>>({ isFetching: true });
  const blockchain = useBlockChain();
  const theme = useMantineTheme();
  const gridColumns = {
    lg: 4,
    sm: 6,
    xs: 12
  }

  const fetchCollections = async () => {
    try {
      // const res = await CollectionModule.getList({chainID: blockchain.chainId})
      // console.log("res ", res.data)

      // if (props.type !== CollectionType.ALL) {
      //   res.data!.collections = res.data!.collections.filter((v, k) => {
      //     if (v.category === props.type) return true;
      //     return false;
      //   })
      // } else {
      //   let featuredRes = await CollectionModule.getListFeaturedCollections({ chainID: blockchain.chainId, category: CollectionType.TOURISM });
      //   setFeaturedTourism(s => ({ ...s, isFetching: false, data: { collections: featuredRes.data!.collections, count: featuredRes.data?.count }}))

      //   featuredRes = await CollectionModule.getListFeaturedCollections({ chainID: blockchain.chainId, category: CollectionType.LIFE });
      //   setFeaturedLife(s => ({ ...s, isFetching: false, data: { collections: featuredRes.data!.collections, count: featuredRes.data?.count } }))

      //   featuredRes = await CollectionModule.getListFeaturedCollections({ chainID: blockchain.chainId, category: CollectionType.GAME});
      //   setFeaturedGame(s => ({ ...s, isFetching: false, data: { collections: featuredRes.data!.collections, count: featuredRes.data?.count } }))

      //   featuredRes = await CollectionModule.getListFeaturedCollections({ chainID: blockchain.chainId, category: CollectionType.FILM });
      //   setFeaturedFilm(s => ({ ...s, isFetching: false, data: { collections: featuredRes.data!.collections, count: featuredRes.data?.count } }))

      //   featuredRes = await CollectionModule.getListFeaturedCollections({ chainID: blockchain.chainId, category: CollectionType.FAMILY });
      //   setFeaturedFamily(s => ({ ...s, isFetching: false, data: { collections: featuredRes.data!.collections, count: featuredRes.data?.count } }))

      //   featuredRes = await CollectionModule.getListFeaturedCollections({ chainID: blockchain.chainId, category: CollectionType.EDUCATION });
      //   setFeaturedEducation(s => ({ ...s, isFetching: false, data: { collections: featuredRes.data!.collections, count: featuredRes.data?.count } }))

      //   featuredRes = await CollectionModule.getListFeaturedCollections({ chainID: blockchain.chainId, category: CollectionType.COOK });
      //   setFeaturedCook(s => ({ ...s, isFetching: false, data: { collections: featuredRes.data!.collections, count: featuredRes.data?.count } }))
      // }

      // setCollections(s => ({...s, isFetching: false, data: {collections: res.data.collections, count: res.count}}))
    } catch (error) {
      onError(error)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [props.type])

  return (
    <Stack>
      <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
        Bộ sưu tập Du lịch nổi bật
      </Title>

      {function () {
        // if (collections.isFetching || !collections.data) return <Grid>
        //   {Array(3).fill(0).map((_, key) => (
        //     <Grid.Col key={key} span={{ ...gridColumns }}>
        //       <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
        //     </Grid.Col>
        //   ))}
        // </Grid>

        // if (collections.error) return <Group><ErrorBox error={collections.error} /></Group>

        // if (!collections.data.length) return <EmptyMessage />

        return <Grid gutter={theme.spacing.md}>
          {collections.data?.collections.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard key={k} collection={v} />
            </Grid.Col>
          ))}
        </Grid>
      }()}

      <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
        Bộ sưu tập Du lịch nổi bật
      </Title>

      {function () {
        // if (collections.isFetching || !collections.data) return <Grid>
        //   {Array(3).fill(0).map((_, key) => (
        //     <Grid.Col key={key} span={{ ...gridColumns }}>
        //       <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
        //     </Grid.Col>
        //   ))}
        // </Grid>

        // if (collections.error) return <Group><ErrorBox error={collections.error} /></Group>

        // if (!collections.data.length) return <EmptyBox />

        return <Grid gutter={theme.spacing.md}>
          {collections.data?.collections.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard key={k} collection={v} />
            </Grid.Col>
          ))}
        </Grid>
      }()}

      <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
        Bộ sưu tập Du lịch nổi bật
      </Title>

      {function () {
        // if (collections.isFetching || !collections.data) return <Grid>
        //   {Array(3).fill(0).map((_, key) => (
        //     <Grid.Col key={key} span={{ ...gridColumns }}>
        //       <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
        //     </Grid.Col>
        //   ))}
        // </Grid>

        // if (collections.error) return <Group><ErrorBox error={collections.error} /></Group>

        // if (!collections.data.length) return <EmptyBox />

        return <Grid gutter={theme.spacing.md}>
          {collections.data?.collections.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard key={k} collection={v} />
            </Grid.Col>
          ))}
        </Grid>
      }()}

      <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
        Bộ sưu tập Du lịch nổi bật
      </Title>

      {function () {
        // if (collections.isFetching || !collections.data) return <Grid>
        //   {Array(3).fill(0).map((_, key) => (
        //     <Grid.Col key={key} span={{ ...gridColumns }}>
        //       <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
        //     </Grid.Col>
        //   ))}
        // </Grid>

        // if (collections.error) return <Group><ErrorBox error={collections.error} /></Group>

        // if (!collections.data.length) return <EmptyBox />

        return <Grid gutter={theme.spacing.md}>
          {collections.data?.collections.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard key={k} collection={v} />
            </Grid.Col>
          ))}
        </Grid>
      }()}

      <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
        Bộ sưu tập Du lịch nổi bật
      </Title>

      {function () {
        // if (collections.isFetching || !collections.data) return <Grid>
        //   {Array(3).fill(0).map((_, key) => (
        //     <Grid.Col key={key} span={{ ...gridColumns }}>
        //       <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
        //     </Grid.Col>
        //   ))}
        // </Grid>

        // if (collections.error) return <Group><ErrorBox error={collections.error} /></Group>

        // if (!collections.data.length) return <EmptyBox />

        return <Grid gutter={theme.spacing.md}>
          {collections.data?.collections.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard key={k} collection={v} />
            </Grid.Col>
          ))}
        </Grid>
      }()}

      <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
        Bộ sưu tập Du lịch nổi bật
      </Title>

      {function () {
        // if (collections.isFetching || !collections.data) return <Grid>
        //   {Array(3).fill(0).map((_, key) => (
        //     <Grid.Col key={key} span={{ ...gridColumns }}>
        //       <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
        //     </Grid.Col>
        //   ))}
        // </Grid>

        // if (collections.error) return <Group><ErrorBox error={collections.error} /></Group>

        // if (!collections.data.length) return <EmptyBox />

        return <Grid gutter={theme.spacing.md}>
          {collections.data?.collections.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard key={k} collection={v} />
            </Grid.Col>
          ))}
        </Grid>
      }()}

      <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
        Bộ sưu tập Du lịch nổi bật
      </Title>

      {function () {
        // if (collections.isFetching || !collections.data) return <Grid>
        //   {Array(3).fill(0).map((_, key) => (
        //     <Grid.Col key={key} span={{ ...gridColumns }}>
        //       <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
        //     </Grid.Col>
        //   ))}
        // </Grid>

        // if (collections.error) return <Group><ErrorBox error={collections.error} /></Group>

        // if (!collections.data.length) return <EmptyBox />

        return <Grid gutter={theme.spacing.md}>
          {collections.data?.collections.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard key={k} collection={v} />
            </Grid.Col>
          ))}
        </Grid>
      }()}
    </Stack>
  )

}