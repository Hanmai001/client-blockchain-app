import { AdminWrapper } from "@/components/admin/admin-wrapper";
import { EmptyMessage } from "@/components/empty-message";
import { onError } from "@/components/modals/modal-error";
import { UserModule } from "@/modules/user/modules";
import { UserInformation } from "@/modules/user/types";
import { getChainId, renderLinkContract } from "@/share/blockchain/context";
import { DateTimeUtils, StringUtils } from "@/share/utils";
import { ActionIcon, Box, Card, Divider, Group, Pagination, Skeleton, Stack, Table, Text, TextInput, Title, Tooltip, useMantineTheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconLock, IconLockOff, IconSearch, IconUserEdit } from "@tabler/icons-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../../types";

export const AdminUsersScreen: FC = () => {
  const theme = useMantineTheme();
  const [users, setUsers] = useState<ListLoadState<UserInformation, 'users'>>({ isFetching: true, isInitialized: false, data: { users: [], count: 0 } });
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 200);
  const [activePage, setActivePage] = useState(1);
  const limit = 10;

  const fetchUsers = async () => {
    try {
      const res = await UserModule.getListUsers({ limit, offset: (activePage - 1) * limit, search });
      setUsers(s => ({ ...s, isFetching: false, data: res.data }));
    } catch (error) {

    }
  }

  const handleBlockUnBlock = async (userId: string) => {
    try {
      await UserModule.blockOrUnBlock(userId);
    } catch (error) {
      onError("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [debounced, activePage])

  return <Box bg="#f8f9fe">
    <AdminWrapper>
      <Stack p={20}>
        <Card radius="md" shadow="sm" withBorder>
          <Title order={4} c={theme.colors.text[1]}>Danh sách người dùng</Title>

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
            if (users.isFetching || !users.data) return <Skeleton h={400} />

            if (users.data.count === 0) return <EmptyMessage />

            return <Table striped highlightOnHover withRowBorders={false}>
              <Table.Thead c={theme.colors.text[1]}>
                <Table.Th>Địa chỉ ví</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th>Thao tác</Table.Th>
              </Table.Thead>

              <Table.Tbody>
                {users.data.users.map((v, k) => <Table.Tr key={k}>
                  <Table.Td c={theme.colors.text[1]}>
                    <Tooltip label={v.wallet}>
                      <Link href={renderLinkContract(v.wallet!, getChainId()!)} target="_blank" style={{
                        color: theme.colors.blue[6],
                        textDecoration: 'underline'
                      }}>{StringUtils.compact(v.wallet, 5, 5)}</Link>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td c={theme.colors.text[1]}>
                    <Tooltip label={v.username}>
                      <Text>{StringUtils.limitCharacters(v.username!, 20)}</Text>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td c={theme.colors.text[1]}>{DateTimeUtils.formatToShow(v.createdAt, false)}</Table.Td>
                  <Table.Td>
                    <Group gap='xs'>
                      <Tooltip label='Đi đến Profile'>
                        <Link href={`/users/${v.wallet}`} target="_blank" style={{
                          color: theme.colors.blue[6],
                          textDecoration: 'underline'
                        }}><IconUserEdit size={18} /></Link>
                      </Tooltip>

                      <Tooltip label={v.active ? "Hạn chế người dùng" : "Mở quyền"}>
                        <ActionIcon color="danger" onClick={() => handleBlockUnBlock(v.id)}>
                          {v.active ? <IconLock size={18} /> : <IconLockOff size={18} />}
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>)}
              </Table.Tbody>
            </Table>
          }()}

          <Pagination color={theme.colors.primary[5]} total={Math.ceil(users.data!.count! / limit)} siblings={2} value={activePage} onChange={setActivePage} styles={{
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