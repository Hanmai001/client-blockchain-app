import { AppImage } from "@/components/app/app-image";
import { useAccount } from "@/modules/account/context";
import { renderPayment } from "@/modules/coins/utils";
import { Collection } from "@/modules/collection/types";
import { StringUtils } from "@/share/utils";
import { ActionIcon, AspectRatio, Box, Card, Group, Stack, Text, Title, Tooltip, rem, useMantineTheme } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { FC } from "react";
import { AppRoutes } from "../../app-router";

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
            <Text fw='bold' c={theme.colors.text[1]} style={{
              display: '-webkit-box',
              wordWrap: 'break-word',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '15px'
            }}>{props.collection.title}</Text>
          </Tooltip>
          <Box h={40}>
            <Text c={theme.colors.gray[6]} lh={1.5} style={{
              display: '-webkit-box',
              wordWrap: 'break-word',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '12px'
            }}>{props.collection.description}</Text>
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