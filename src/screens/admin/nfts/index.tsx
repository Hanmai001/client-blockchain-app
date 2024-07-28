import { AdminWrapper } from "@/components/admin/admin-wrapper";
import { AppButton } from "@/components/app/app-button";
import { EmptyMessage } from "@/components/empty-message";
import { onError } from "@/components/modals/modal-error";
import { onViewNft } from "@/components/modals/modal-nft-detail";
import { NftModule } from "@/modules/nft/modules";
import { Nft } from "@/modules/nft/types";
import { getChainId, renderLinkContract } from "@/share/blockchain/context";
import { DateTimeUtils, StringUtils } from "@/share/utils";
import { Box, Card, Divider, Group, Pagination, Skeleton, Stack, Table, Text, TextInput, Title, Tooltip, useMantineTheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconEye, IconLock, IconLockOff, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { ItemMode, ListLoadState } from "../../../../types";

export const AdminNftsScreen: FC = () => {
  const theme = useMantineTheme();
  const [items, setItems] = useState<ListLoadState<Nft, 'tokens'>>({ isFetching: true, isInitialized: false, data: { tokens: [], count: 0 } });
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 200);
  const [activePage, setActivePage] = useState(1);
  const limit = 10;

  const fetchNfts = async () => {
    try {
      const res = await NftModule.getList({ limit, offset: (activePage - 1) * limit, search });
      setItems(s => ({ ...s, isFetching: false, data: res.data }));
    } catch (error) {
    }
  }

  const handleActive = async (token: Nft) => {
    try {
      await NftModule.updateToken({ ...token, active: !token.active }, false);
      await fetchNfts();
    } catch (error) {
      onError("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  useEffect(() => {
    fetchNfts();
  }, [debounced, activePage])

  return <Box bg="#f8f9fe">
    <AdminWrapper>
      <Stack p={20}>
        <Card radius="md" shadow="sm" withBorder>
          <Title order={4} c={theme.colors.text[1]}>Danh sách NFTs</Title>

          <Divider my={10} />

          <TextInput
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Nhập từ khóa"
            rightSection={<IconSearch />}
            radius="md"
            miw='100%'
            mb={20}
            styles={{
              input: {
                height: '40px',
                paddingLeft: `${theme.spacing.md}`,
              },
              section: {
                paddingRight: `${theme.spacing.md}`
              }
            }} />
          {function () {
            if (items.isFetching || !items.data) return <Skeleton h={400} />

            if (items.data.count === 0) return <EmptyMessage />

            return <Table striped highlightOnHover withRowBorders={false}>
              <Table.Thead c={theme.colors.text[1]}>
                <Table.Th>Tiêu đề</Table.Th>
                <Table.Th>Chế độ</Table.Th>
                <Table.Th>Chủ sở hữu</Table.Th>
                <Table.Th>Người tạo</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th>Thao tác</Table.Th>
              </Table.Thead>

              <Table.Tbody>
                {items.data.tokens.map((v, k) => <Table.Tr key={k}>
                  <Table.Td c={theme.colors.text[1]}>
                    <Tooltip label={v.title}>
                      <Text>{StringUtils.limitCharacters(v.title!, 20)}</Text>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td c={theme.colors.text[1]}>
                    <Card
                      bg={v.mode.toString() === ItemMode.PUBLIC ? theme.colors.blue[1] : theme.colors.yellow[5]}
                      style={{
                        maxWidth: 'fit-content'
                      }}
                      p={8}
                      radius={'lg'}
                    >
                      <Text size="14px" fw='bold'>{NftModule.getTokenMode(v.mode.toString())}</Text>
                    </Card>
                  </Table.Td>
                  <Table.Td c={theme.colors.text[1]}>
                    <Tooltip label={v.owner}>
                      <Link href={renderLinkContract(v.owner!, getChainId()!)} target="_blank" style={{
                        color: theme.colors.blue[6],
                        textDecoration: 'underline'
                      }}>{StringUtils.compact(v.owner, 5, 5)}</Link>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td c={theme.colors.text[1]}>
                    <Tooltip label={v.owner}>
                      <Link href={renderLinkContract(v.creator!, getChainId()!)} target="_blank" style={{
                        color: theme.colors.blue[6],
                        textDecoration: 'underline'
                      }}>{StringUtils.compact(v.creator, 5, 5)}</Link>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td c={theme.colors.text[1]}>{DateTimeUtils.formatToShow(v.createdAt, false)}</Table.Td>
                  <Table.Td>
                    <Group gap='xs'>
                      <AppButton
                        variant="outline"
                        color={theme.colors.primary[5]}
                        px={8}
                        onClick={() => onViewNft({ token: v })}
                      >
                        <Tooltip label="Xem chi tiết">
                          <IconEye size={18} />
                        </Tooltip>
                      </AppButton>

                      <AppButton
                        async
                        color="danger"
                        onClick={() => handleActive(v)}
                        px={8}
                      >
                        <Tooltip label={v.active ? "Ẩn" : "Hiện"}>
                          {v.active ? <IconLock size={18} /> : <IconLockOff size={18} />}
                        </Tooltip>
                      </AppButton>
                    </Group>
                  </Table.Td>
                </Table.Tr>)}
              </Table.Tbody>
            </Table>
          }()}

          <Pagination color={theme.colors.primary[5]} total={Math.ceil(items.data!.count! / limit)} siblings={2} value={activePage} onChange={setActivePage} styles={{
            root: {
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end'
            },
            control: {
              boxShadow: `0 1px 4px rgba(0, 0, 0, 0.1)`,
              border: 'none',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
            }
          }}
          />
        </Card>
      </Stack>
    </AdminWrapper>
  </Box>
}