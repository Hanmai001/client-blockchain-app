import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { Grid, Group, Skeleton, Stack, Title, rem, useMantineTheme } from "@mantine/core";

const listcollections = [
  {
    _id: 'afdsf',
    id: '2',
    chainId: '1',
    creator: '0vvdsd',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    averagePrice: "0.56 BNB"
  },
  {
    _id: 'afdsf',
    id: '1',
    chainId: '1',
    creator: '0vvdsd',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    averagePrice: "0.56 BNB"
  },
  {
    _id: 'afdsf',
    id: '3',
    chainId: '1',
    creator: '0vvdsd',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    averagePrice: "0.56 BNB"
  },
  {
    _id: 'afdsf',
    id: '4',
    chainId: '1',
    creator: '0vvdsd',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    averagePrice: "0.56 BNB"
  },
  {
    _id: 'afdsf',
    id: '5',
    chainId: '1',
    creator: '0vvdsd',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    averagePrice: "0.56 BNB"
  }
]
export const ListCollections: FC = () => {
  const defaultState: ListLoadState<any> = { isFetching: true, data: listcollections }
  const [collections, setCollections] = useState(defaultState);
  const theme = useMantineTheme();
  const gridColumns = {
    xl: 4,
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
      <Title size={theme.fontSizes.md}>
        Bộ sưu tập mới nhất
      </Title>

      {function() {
        if (collections.isFetching || !collections.data) return <Grid>
          {Array(3).fill(0).map((_, key) => (
            <Grid.Col key={key} span={{ ...gridColumns }}>
              <Skeleton radius={rem(10)} width='100%' height={250} />
            </Grid.Col>
          ))}
        </Grid>

        // if (collections.error) return <Group><ErrorBox error={collections.error} /></Group>

        // if (!collections.data.length) return <EmptyBox />

        return <Grid gutter={theme.spacing.md}>
          {collections.data!.map((v, key) => (
            <Grid.Col key={key} span={{ ...gridColumns }}>
              v
            </Grid.Col>
          ))}
        </Grid>
      }()}
    </Stack>
  )

}