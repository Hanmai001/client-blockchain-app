import { AppImage } from "@/components/app/app-image";
import { EmptyMessage } from "@/components/empty-message";
import { ErrorMessage } from "@/components/error-message";
import { onError } from "@/components/modals/modal-error";
import { renderPayment } from "@/modules/coins/utils";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection, CollectionType } from "@/modules/collection/types";
import { useBlockChain } from "@/share/blockchain/context";
import { StringUtils } from "@/share/utils";
import { AspectRatio, Group, ScrollArea, Skeleton, Table, Text, Tooltip, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";

export const CollectionsRanking: FC<{ type: string | null }> = (props) => {
  const defaultState: ListLoadState<any, 'collections'> = { isFetching: true, data: { collections: [], count: 0 } }
  const [collections, setCollections] = useState(defaultState);
  const blockchain = useBlockChain();
  
  const fetchCollectionsRanking = async () => {
    try {
      let filteredRes: any;
      if (props.type !== CollectionType.ALL) {
        const res = await CollectionModule.getList({ chainID: blockchain.chainId, category: props.type as string, sort: '+totalSubscribers', limit: 10, active: true })
        filteredRes = res.data!.collections.filter(v => true);

      } else {
        const res = await CollectionModule.getList({ chainID: blockchain.chainId, sort: '+totalSubscribers', limit: 10, active: true })
        filteredRes = res.data!.collections.filter(v => true);
      }
      setCollections(s => ({ ...s, isFetching: false, data: { collections: filteredRes, count: filteredRes.length } }));
    } catch (error) {
      setCollections(s => ({ ...s, isFetching: false }))
      onError(error)
    }
  }

  useEffect(() => {
    fetchCollectionsRanking();
  }, [])

  const firstFiveCollections = collections.data?.collections.slice(0, 5) || [];
  const remainingCollections = collections.data?.collections.slice(5) || [];

  return <ScrollArea offsetScrollbars type="always">
    <Group mt={10} miw={800} grow align="flex-start">
      {function () {
        if (collections.isFetching) return <Skeleton width={"100%"} height={300} />

        if (collections.error) return <Group><ErrorMessage error={collections.error} /></Group>

        if (collections.data?.count === 0) return <Group><EmptyMessage /></Group>

        return <Table
          highlightOnHover
          styles={{
            td: {
              padding: '15px 10px'
            },
            th: {
              fontSize: '16px',
              fontWeight: 'normal'
            },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th flex={1}>#</Table.Th>
              <Table.Th flex={8}>Bộ sưu tập</Table.Th>
              <Table.Th flex={3}>Avg</Table.Th>
              <Table.Th visibleFrom="sm">Lượt đăng ký</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {firstFiveCollections.map((v, k) => (
              <CollectionRaking key={k} collection={v} rank={k + 1} />
            ))}
          </Table.Tbody>
        </Table>
      }()}

      {function () {
        if (collections.isFetching) return <Skeleton width={"100%"} height={300} />

        if (collections.error) return <Group><ErrorMessage error={collections.error} /></Group>

        if (collections.data?.count === 0) return <Group><EmptyMessage /></Group>

        return <Table
          highlightOnHover
          styles={{
            td: {
              padding: '15px 10px'
            },
            th: {
              fontSize: '16px',
              fontWeight: 'normal'
            },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th flex={1}>Rank</Table.Th>
              <Table.Th flex={8}>Bộ sưu tập</Table.Th>
              <Table.Th flex={3}>Avg</Table.Th>
              <Table.Th visibleFrom="sm">Lượt đăng ký</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {remainingCollections.map((v, k) => (
              <CollectionRaking key={k} collection={v} rank={k + 6} />
            ))}
          </Table.Tbody>
        </Table>
      }()}
    </Group>
  </ScrollArea>
}


const CollectionRaking: FC<{ collection: Collection, rank: number }> = ({ collection, rank }) => {
  const theme = useMantineTheme();
  const { symbol } = renderPayment(collection.paymentType);
  const { push } = useRouter();

  return (
    <Table.Tr
      onClick={() => push(`/collections/${collection.collectionID}`)}
      style={{
        cursor: 'pointer'
      }}
    >
      <Table.Td>
        <Text fw="bold" c={theme.colors.text[1]}>
          {rank}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group>
          <AspectRatio ratio={240 / 220} w={64} style={{ borderRadius: "12px", border: `2px solid ${theme.colors.primary[5]}`, overflow: "hidden" }}>
            <AppImage src={collection.bannerURL} />
          </AspectRatio>

          <Tooltip label={collection.title}>
            <Text fw="bold" c={theme.colors.text[1]}>{StringUtils.limitCharacters(collection.title, 15)}</Text>
          </Tooltip>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fw="bold" c={theme.colors.text[1]}>
          {collection.averagePrice} {symbol}
        </Text>
      </Table.Td>
      <Table.Td visibleFrom="sm">
        <Text fw="bold" c={theme.colors.text[1]}>
          {collection.totalSubscribers || 0}
        </Text>
      </Table.Td>
    </Table.Tr>
  )
}