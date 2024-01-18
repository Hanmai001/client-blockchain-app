import { AppImage } from "@/components/app/app-image";
import { Nft } from "@/modules/nft/types";
import { ClassNames, StringUtils } from "@/share/utils";
import { AspectRatio, Card, Stack, Title, useMantineTheme, Text, Group } from "@mantine/core";
import Link from "next/link";
import { FC, useEffect } from "react";
import classes from '../styles/collections/CollectionDetail.module.scss';
import { AppButton } from "@/components/app/app-button";
import { useHover } from "@mantine/hooks";
import { useAccount } from "@/modules/account/context";
import { ethers } from "ethers";

export const NftCard: FC<{ nft: Nft }> = (props) => {
  const account = useAccount();
  const { hovered, ref } = useHover();
  const theme = useMantineTheme();
  const handleContextMenu = (event: any) => {
    event.preventDefault();
  };

  return (
    <Link href={`/nfts/`}>
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
          <Title size={15} c={theme.colors.text[1]}>{StringUtils.limitCharacters(props.nft.title, 15)}</Title>
          <Text c={theme.colors.gray[6]} lh={1.5} size="12px">{StringUtils.limitCharacters(props.nft.description, 100)}</Text>
        </Stack>

        {hovered && <AppButton color={theme.colors.primary[5]} className={ClassNames({
          [classes.buyButton]: true,
          [classes.buttonUnhovered]: !hovered ? true : false,
          [classes.buttonHovered]: hovered
        })}>
          Mua ngay
        </AppButton>}
      </Card>
    </Link>
  )
}