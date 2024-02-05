import { AppImage } from "@/components/app/app-image";
import { renderPayment } from "@/modules/coins/utils";
import { Collection } from "@/modules/collection/types";
import { StringUtils } from "@/share/utils";
import { ActionIcon, AspectRatio, Box, Card, Group, Stack, Text, Title, Tooltip, rem, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { FC } from "react";
import { AppRoutes } from "../../app-router";
import { useAccount } from "@/modules/account/context";
import { IconEdit, IconEyeBolt } from "@tabler/icons-react";

interface CollectionCardProps {
  collection: Collection
}

export const CollectionCard: FC<CollectionCardProps> = (props) => {
  const theme = useMantineTheme();
  const { image, symbol } = renderPayment(props.collection.paymentType);
  const account = useAccount();
  const isOwner = account.information?.wallet === props.collection.creatorCollection;

  return (
    <Link href={`/collections/${props.collection.collectionID}`}>
      <Card className="app-card" shadow="sm" radius={10}>
        <Card.Section>
          <AspectRatio ratio={260 / 150}>
            <AppImage src={props.collection.bannerURL} />
          </AspectRatio>
        </Card.Section>

        <Stack pt={theme.spacing.xs} gap={theme.spacing.xs}>
          <Tooltip label={props.collection.title}>
            <Title size={15} c={theme.colors.text[1]}>{StringUtils.limitCharacters(props.collection.title, 15)}</Title>
          </Tooltip>
          <Box h={40}>
            <Text c={theme.colors.gray[6]} lh={1.5} size="12px">{StringUtils.limitCharacters(props.collection.description, 80)}</Text>
          </Box>

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

        {isOwner &&
          <Link href={`${AppRoutes.collection.edit}/${props.collection.collectionID}`} style={{
            position: "absolute",
            right: 0,
            marginRight: rem(10),
            zIndex: 10
          }}>
            <ActionIcon c={theme.colors.primary[5]} variant="transparent" >
              <IconEdit />
            </ActionIcon>
          </Link>
        }
      </Card>
    </Link>
  )
}