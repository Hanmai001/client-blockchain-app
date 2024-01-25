import { AppImage } from "@/components/app/app-image";
import { ErrorMessage } from "@/components/error-message";
import { onError } from "@/components/modals/modal-error";
import { renderPayment } from "@/modules/coins/utils";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection, CollectionType } from "@/modules/collection/types";
import { useBlockChain } from "@/share/blockchain/context";
import { StringUtils } from "@/share/utils";
import { AspectRatio, Group, Skeleton, Stack, Text, Title, Tooltip, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { EmptyMessage } from "@/components/empty-message";

export const CollectionsRanking: FC<{type: string | null}> = (props) => {
  const defaultState: ListLoadState<any, 'collections'> = { isFetching: true, data: { collections: [], count: 0 } }
  const [collections, setCollections] = useState(defaultState);
  const blockchain = useBlockChain();
  const theme = useMantineTheme();

  const fetchCollectionsRanking = async () => {
    try {
      let filteredRes: any;
      if (props.type !== CollectionType.ALL) {
        const res = await CollectionModule.getList({ chainID: blockchain.chainId, category: props.type as string, sort: '+averagePrice', limit: 5 })
        filteredRes = res.data!.collections.filter(v => true);

      } else {
        const res = await CollectionModule.getList({ chainID: blockchain.chainId, sort: '+averagePrice', limit: 5 })
        filteredRes = res.data!.collections.filter(v => true);
      }
      setCollections(s => ({ ...s, isFetching: false, data: { collections: filteredRes, count: filteredRes.length } }));
    } catch (error) {
      setCollections(s => ({...s, isFetching: false}))
      onError(error)
    }
  }

  useEffect(() => {
    fetchCollectionsRanking();
  }, [])

  return <Stack>
    <Title c={theme.colors.text[1]} size={theme.fontSizes.md} mt={theme.spacing.md}>
      Xếp hạng trong tháng
    </Title>

    <Stack p={theme.spacing.sm} gap={30} style={{
      borderRadius: "10px",
      border: `1px solid ${theme.colors.gray[3]}`,
      boxShadow: `1px 3px ${theme.colors.gray[0]}`
    }}>
      {function () {
        if (collections.isFetching) return <Skeleton width={"100%"} height={300}/>

        if (collections.error) return <Group><ErrorMessage error={collections.error} /></Group>

        if (collections.data?.count === 0) return <Group><EmptyMessage /></Group>

        return <>
          {collections.data?.collections.map((v, k) => (
            <CollectionRaking key={k} collection={v} />
          ))}
        </>
      }()}
    </Stack>
  </Stack>
}


const CollectionRaking: FC<{ collection: Collection }> = (props) => {
  const theme = useMantineTheme();
  const { symbol } = renderPayment(props.collection.paymentType);

  return (
    <Link href={`/collections/${props.collection.collectionID}`}>
      <Group>
        <AspectRatio ratio={240 / 200} w={64} style={{ borderRadius: "12px", border: `2px solid ${theme.colors.primary[5]}`, overflow: "hidden" }}>
          <AppImage src={props.collection.bannerURL} style={{ borderRadius: "12px" }} />
        </AspectRatio>

        <Stack gap={0}>
          <Tooltip label={props.collection.title}>
            <Text fw="bold" c={theme.colors.text[1]}>{StringUtils.limitCharacters(props.collection.title, 15)}</Text>
          </Tooltip>
          <Text c={theme.colors.text[1]}>{props.collection.averagePrice} {symbol}</Text>
        </Stack>
      </Group>
    </Link>
  )
}