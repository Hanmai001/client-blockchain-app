import { AppButton } from "@/components/app/app-button";
import { useAccount } from "@/modules/account/context";
import { Nft } from "@/modules/nft/types";
import { ClassNames, StringUtils } from "@/share/utils";
import { ActionIcon, AspectRatio, Box, Card, Stack, Text, Title, Tooltip, rem, useMantineTheme } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { FC } from "react";
import { AppRoutes } from "../../app-router";
import classes from '../styles/collections/CollectionDetail.module.scss';

export const NftCard: FC<{ nft: Nft }> = (props) => {
  const account = useAccount();
  const { hovered, ref } = useHover();
  const theme = useMantineTheme();
  const handleContextMenu = (event: any) => {
    event.preventDefault();
  };
  const isOwner = account.information?.wallet === props.nft.owner;

  return (
    <Link href={`/nfts/${props.nft.tokenID}`}>
      <Card className="app-card" shadow="sm" radius={10} ref={ref}>
        <Card.Section>
          <AspectRatio ratio={100 / 120} style={{ overflow: 'hidden' }}>
            <video
              controls
              controlsList="nodownload"
              className={classes.video}
              src={`${props.nft.source}`}
              muted
              onContextMenu={handleContextMenu}
            />
          </AspectRatio>
        </Card.Section>

        <Stack pt={theme.spacing.xs} gap={theme.spacing.xs}>
          <Tooltip label={props.nft.title}>
            <Text fw='bold' c={theme.colors.text[1]} style={{
              display: '-webkit-box',
              wordWrap: 'break-word',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '15px'
            }}>{props.nft.title}</Text>
          </Tooltip>
          <Box h={40}>
            <Text c={theme.colors.gray[6]} lh={1.5} style={{
              display: '-webkit-box',
              wordWrap: 'break-word',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '12px'
            }}>{props.nft.description}</Text>
          </Box>
        </Stack>

        {hovered && account.information?.wallet !== props.nft.owner && <AppButton async color={theme.colors.primary[5]} className={ClassNames({
          [classes.buyButton]: true,
          [classes.buttonUnhovered]: !hovered ? true : false,
          [classes.buttonHovered]: hovered
        })}>
          Mua ngay
        </AppButton>}

        {isOwner &&
          <Link href={`${AppRoutes.nft.edit}/${props.nft.tokenID}`} style={{
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