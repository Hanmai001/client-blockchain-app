import { AdminWrapper } from "@/components/admin/admin-wrapper";
import { AppButton } from "@/components/app/app-button";
import { EmptyMessage } from "@/components/empty-message";
import { PUBLIC_URL } from "@/modules/configs/context";
import { ReportModule } from "@/modules/report/modules";
import { ReportEntity, ReportStatus } from "@/modules/report/types";
import { getChainId, renderLinkContract } from "@/share/blockchain/context";
import { DateTimeUtils, StringUtils } from "@/share/utils";
import { ActionIcon, Box, Card, Divider, Group, Pagination, Select, Skeleton, Stack, Table, Text, TextInput, Title, Tooltip, useMantineTheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconCheck, IconEdit, IconEye, IconSearch, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../../types";
import { NftModule } from "@/modules/nft/modules";
import { onViewNft } from "@/components/modals/modal-nft-detail";
import { onError } from "@/components/modals/modal-error";
import { useAccount } from "@/modules/account/context";

export const AdminReportsScreen: FC = () => {
  const theme = useMantineTheme();
  const [items, setItems] = useState<ListLoadState<ReportEntity, 'reports'>>({ isFetching: true, isInitialized: false, data: { reports: [], count: 0 } });
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 200);
  const [activePage, setActivePage] = useState(1);
  const account = useAccount();
  const limit = 10;

  const fetchNfts = async () => {
    try {
      const res = await ReportModule.getListReports({ limit, offset: (activePage - 1) * limit, search });
      setItems(s => ({ ...s, isFetching: false, data: res.data }));
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchNfts();
  }, [account.information, debounced, activePage])

  return <Box bg="#f8f9fe">
    <AdminWrapper>
      <Stack p={20}>
        <Card radius="md" shadow="sm" withBorder>
          <Title order={4} c={theme.colors.text[1]}>Danh sách báo cáo từ người dùng</Title>

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
                <Table.Th>Nội dung</Table.Th>
                <Table.Th>Người gửi</Table.Th>
                <Table.Th>Chủ sở hữu</Table.Th>
                <Table.Th>Link</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th>Thao tác</Table.Th>
              </Table.Thead>

              <Table.Tbody>
                {items.data.reports.map((v, k) => <ReportItem report={v} />)}
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

const ReportItem: FC<{ report: ReportEntity }> = ({ report }) => {
  const theme = useMantineTheme();
  const [isEdittingStatus, setIsEdittingStatus] = useState(false);
  const [status, setStatus] = useState<string>();

  const handleViewReport = async (id: string) => {
    try {
      const token = await NftModule.getNftByID(id);
      onViewNft({ token: token.data })
    } catch (error) {

    }
  }

  const handleUpdateStatus = async () => {
    try {
      const res = await ReportModule.update(report.id, { status: Number(status) })
      report.status = res.data.status;
      setIsEdittingStatus(false);
    } catch (error) {
      onError(error);
    }
  }

  useEffect(() => {
    setStatus(report.status.toString());
  }, [report])

  return (
    <Table.Tr >
      <Table.Td c={theme.colors.text[1]}>
        <Box maw={350}>
          {report.description}
        </Box>
      </Table.Td>
      <Table.Td c={theme.colors.text[1]}>
        <Tooltip label={report.from}>
          <Link href={renderLinkContract(report.to!, getChainId()!)} target="_blank" style={{
            color: theme.colors.blue[6],
            textDecoration: 'underline'
          }}>{StringUtils.compact(report.from, 5, 5)}</Link>
        </Tooltip>
      </Table.Td>
      <Table.Td c={theme.colors.text[1]}>
        <Tooltip label={report.to}>
          <Link href={renderLinkContract(report.to!, getChainId()!)} target="_blank" style={{
            color: theme.colors.blue[6],
            textDecoration: 'underline'
          }}>{StringUtils.compact(report.to, 5, 5)}</Link>
        </Tooltip>
      </Table.Td>
      <Table.Td c={theme.colors.text[1]}>
        <Tooltip label={report.to}>
          <Link href={`/nfts/${report.tokenID}`} target="_blank" style={{
            color: theme.colors.blue[6],
            textDecoration: 'underline'
          }}>{`${PUBLIC_URL}/nfts/${report.tokenID}`}</Link>
        </Tooltip>
      </Table.Td>
      <Table.Td c={theme.colors.text[1]}>{DateTimeUtils.formatToShow(report.createdAt, false)}</Table.Td>
      <Table.Td>
        {isEdittingStatus ? <Group gap='xs'>
          <Select
            data={Object.values(ReportStatus).map(v => ({ value: v.toString(), label: ReportModule.getNameOfStatuc(v) }))}
            value={status}
            onChange={(v) => setStatus(v!)}
            maw={150}
            styles={{
              dropdown: {
                maxHeight: '200px',
                overflow: 'hidden',
                overflowY: 'auto',
              },
              input: {
                height: '45px',
                borderRadius: '10px',
              }
            }}
          />
          <Group gap="xs">
            <ActionIcon
              color="teal"
              variant="outline"
              onClick={handleUpdateStatus}
            >
              <IconCheck />
            </ActionIcon>

            <ActionIcon
              onClick={() => { setIsEdittingStatus(false); setStatus(report.status.toString()) }}
              variant="light"
              color={theme.colors.gray[7]}
            >
              <IconX />
            </ActionIcon>
          </Group>
        </Group> : <Group>
          <Text fw='bold'>
            {ReportModule.getNameOfStatuc(report.status)}
          </Text>
          <ActionIcon
            variant="outline"
            color={theme.colors.primary[5]}
            onClick={() => setIsEdittingStatus(true)}
          >
            <IconEdit size={18} />
          </ActionIcon>
        </Group>}
      </Table.Td>
      <Table.Td>
        <Group gap='xs'>
          <AppButton
            variant="outline"
            color={theme.colors.primary[5]}
            px={8}
            onClick={() => handleViewReport(report.tokenID)}
          >
            <Tooltip label="Xem chi tiết">
              <IconEye size={18} />
            </Tooltip>
          </AppButton>
        </Group>
      </Table.Td>
    </Table.Tr>
  )
}