import { AppImage } from "@/components/app/app-image";
import { renderPayment } from "@/modules/coins/utils";
import { Collection } from "@/modules/collection/types";
import { StringUtils } from "@/share/utils";
import { AspectRatio, Card, Group, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { FC } from "react";

interface CollectionCardProps {
  collection: Collection
}

export const CollectionCard: FC<CollectionCardProps> = (props) => {
  const theme = useMantineTheme();
  const { image, symbol } = renderPayment(props.collection.paymentType);

  return (
    <Link href={`/collections/${props.collection.collectionID}`}>
      <Card className="app-card" shadow="sm" radius={10}>
        <Card.Section>
          <AspectRatio ratio={260 / 150}>
            <AppImage src={props.collection.bannerUrl} />
          </AspectRatio>
        </Card.Section>

        <Stack pt={theme.spacing.xs} gap={theme.spacing.xs}>
          <Title size={15} c={theme.colors.text[1]}>{StringUtils.limitCharacters(props.collection.title, 15)}</Title>
          <Text c={theme.colors.gray[6]} lh={1.5} size="12px">{StringUtils.limitCharacters(props.collection.description, 100)}</Text>

          <Group justify="space-between">
            <Text c={theme.colors.gray[6]} size="12px">Average price</Text>
            <Group gap={4}>
              <AppImage radius="50%" src={image} style={{
                width: "24px",
                height: "24px"
              }} />
              <Text fw={500}>{props.collection.averagePrice} {symbol}</Text>
            </Group>
          </Group>
        </Stack>
      </Card>
    </Link>
  )
}