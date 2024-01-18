import { Grid, Stack, Title, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { CollectionCard } from "../../components/collection-card";
import { EmptyMessage } from "@/components/empty-message";

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
export const ListCollections: FC = () => {
  const defaultState: ListLoadState<any> = { isFetching: true, data: listcollections }
  const [collections, setCollections] = useState(defaultState);
  const theme = useMantineTheme();
  const gridColumns = {
    lg: 4,
    sm: 6,
    xs: 12
  }

  const fetchCollections = async () => {
    
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  return (
    <Stack>
      <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
        Bộ sưu tập Du lịch nổi bật
      </Title>

      {function() {
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
          {collections.data!.map((v, k) => (
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
          {collections.data!.map((v, k) => (
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
          {collections.data!.map((v, k) => (
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
          {collections.data!.map((v, k) => (
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
          {collections.data!.map((v, k) => (
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
          {collections.data!.map((v, k) => (
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
          {collections.data!.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard key={k} collection={v} />
            </Grid.Col>
          ))}
        </Grid>
      }()}
    </Stack>
  )

}