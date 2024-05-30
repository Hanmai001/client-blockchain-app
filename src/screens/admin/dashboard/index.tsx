import { AdminWrapper } from "@/components/admin/admin-wrapper";
import { AppButton } from "@/components/app/app-button";
import { ActionIcon, Avatar, Box, Card, Grid, Group, Skeleton, Stack, Text, ThemeIcon, Title, useMantineTheme } from "@mantine/core";
import { IconArrowDown, IconArrowUp, IconChartBar, IconChartLine, IconNetwork, IconUsers, IconVideo } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Legend, Bar } from 'recharts';
import classes from '../../../styles/admin/AdminDashboard.module.scss';
import { useAccount } from "@/modules/account/context";
import { StatisticModule } from "@/modules/statistic/modules";
import { Statistic, StatisticType } from "@/modules/statistic/types";
import { DateTimeUtils, NumberUtils } from "@/share/utils";
import { AppPayment, ListLoadState } from "../../../../types";
import { renderPayment } from "@/modules/coins/utils";
import { Roles } from "@/modules/user/types";

export const AdminDashBoard: FC = () => {
  const theme = useMantineTheme();
  const defaultState: ListLoadState<Statistic, 'results'> = { isFetching: true, isInitialized: false, data: { results: [], count: 0 } }
  const [newUsers, setNewUsers] = useState<ListLoadState<Statistic, 'results'>>(defaultState);
  const [newNfts, setNfts] = useState<ListLoadState<Statistic, 'results'>>(defaultState);
  const [orderRevenue, setOrderRevenue] = useState<any>(defaultState);
  const [newSubscribers, setNewSubscribers] = useState<ListLoadState<Statistic, 'results'>>(defaultState);
  const account = useAccount();

  const getStatistics = async () => {
    try {
      let res = await StatisticModule.getUserStatistic({ type: StatisticType.MONTH, from: DateTimeUtils.formatDate(DateTimeUtils.getDateWithOffsetMonths(1)), to: DateTimeUtils.formatDate(new Date()) })
      setNewUsers(s => ({ isFetching: false, data: res.data }))
      res = await StatisticModule.getTokenStatistic({ type: StatisticType.MONTH, from: DateTimeUtils.formatDate(DateTimeUtils.getDateWithOffsetMonths(1)), to: DateTimeUtils.formatDate(new Date()) })
      console.log(res)
      setNfts(s => ({ isFetching: false, data: res.data }))
      res = await StatisticModule.getOrderRevenueStatistic({ type: StatisticType.MONTH, from: DateTimeUtils.formatDate(DateTimeUtils.getDateWithOffsetMonths(1)), to: DateTimeUtils.formatDate(new Date()) })
      console.log(res)
      setOrderRevenue(s => ({ isFetching: false, data: res }))
      res = await StatisticModule.getNewSubscriberStatistic({ type: StatisticType.MONTH, from: DateTimeUtils.formatDate(DateTimeUtils.getDateWithOffsetMonths(1)), to: DateTimeUtils.formatDate(new Date()) })
      console.log(res)
      setNewSubscribers(s => ({ isFetching: false, data: res.data }))
    } catch (error) {

    }
  }

  useEffect(() => {
    getStatistics();
  }, [account.information])

  return <Box bg="#f8f9fe">
    <AdminWrapper>
      <Grid bg={theme.colors.dark[6]} style={{
        padding: '20px 20px 80px 20px'
      }}>
        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <Card flex={3} radius="md">
            <Group justify="space-between">
              {function () {
                if (newUsers.isFetching || !newUsers.data) return <Skeleton h={10} />

                return <Stack gap={6}>
                  <Text fw={500} c={theme.colors.primary[5]}>Người dùng mới</Text>
                  <Text fw={500} size="18px">{newUsers.data?.results[1].count}</Text>
                </Stack>
              }()}

              <ThemeIcon
                variant="gradient"
                gradient={{ from: 'rgba(255, 89, 33, 1)', to: 'yellow', deg: 201 }}
                radius='50%'
                size={48}
              >
                <IconUsers />
              </ThemeIcon>
            </Group>

            <Group mt={20}>
              {function () {
                if (newUsers.isFetching || !newUsers.data) return <Skeleton h={10} />

                return <>
                  <Group gap={0}>
                    {newUsers.data.results[1].count >= newUsers.data.results[0].count ? <IconArrowUp color={theme.colors.green[5]} /> : <IconArrowDown color="red" />}
                    <Text c={newUsers.data.results[1].count >= newUsers.data.results[0].count ? theme.colors.green[5] : "red"}>{NumberUtils.calcPercentChange(newUsers.data.results[1].count, newUsers.data.results[0].count)} %</Text>
                  </Group>

                  <Text c={theme.colors.text[1]}>So với tháng trước</Text>
                </>
              }()}
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <Card flex={3} radius="md">
            <Group justify="space-between">
              {function () {
                if (newNfts.isFetching || !newNfts.data) return <Skeleton h={10} />

                return <Stack gap={6}>
                  <Text fw={500} c={theme.colors.primary[5]}>NFT mới</Text>
                  <Text fw={500} size="18px">{newNfts.data?.results[1].count}</Text>
                </Stack>
              }()}

              <ThemeIcon
                variant="gradient"
                gradient={{ from: 'rgba(240, 91, 180, 1)', to: 'pink', deg: 208 }}
                radius='50%'
                size={48}
              >
                <IconVideo />
              </ThemeIcon>
            </Group>

            <Group mt={20}>
              {function () {
                if (newNfts.isFetching || !newNfts.data) return <Skeleton h={10} />

                return <>
                  <Group gap={0}>
                    {newNfts.data.results[1].count >= newNfts.data.results[0].count ? <IconArrowUp color={theme.colors.green[5]} /> : <IconArrowDown color="red" />}
                    <Text c={newNfts.data.results[1].count >= newNfts.data.results[0].count ? theme.colors.green[5] : "red"}>{NumberUtils.calcPercentChange(newNfts.data.results[1].count, newNfts.data.results[0].count)} %</Text>
                  </Group>

                  <Text c={theme.colors.text[1]}>So với tháng trước</Text>
                </>
              }()}
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <Card flex={3} radius="md">
            <Group justify="space-between">
              {function () {
                if (orderRevenue.isFetching || !orderRevenue.data) return <Skeleton h={10} />

                return <Stack gap={6}>
                  <Text fw={500} c={theme.colors.primary[5]}>Doanh thu</Text>
                  <Text fw={500} size="18px">{newUsers.data?.results[1].count}</Text>
                </Stack>
              }()}

              <ThemeIcon
                variant="gradient"
                gradient={{ from: 'rgba(23, 156, 26, 1)', to: 'lime', deg: 208 }}
                radius='50%'
                size={48}
              >
                <IconChartLine />
              </ThemeIcon>
            </Group>

            <Group mt={20}>
              {function () {
                if (orderRevenue.isFetching || !orderRevenue.data) return <Skeleton h={10} />

                return <>
                  <Group gap={0}>
                    {orderRevenue.data.results[1].revenue >= orderRevenue.data.results[0].revenue ? <IconArrowUp color={theme.colors.green[5]} /> : <IconArrowDown color="red" />}
                    <Text c={orderRevenue.data.results[1].revenue >= orderRevenue.data.results[0].revenue ? theme.colors.green[5] : "red"}>{NumberUtils.calcPercentChange(orderRevenue.data.results[1].revenue, orderRevenue.data.results[0].revenue)} %</Text>
                  </Group>

                  <Text c={theme.colors.text[1]}>So với tháng trước</Text>
                </>
              }()}
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <Card flex={3} radius="md">
            <Group justify="space-between">
              {function () {
                if (newSubscribers.isFetching || !newSubscribers.data) return <Skeleton h={10} />

                return <Stack gap={6}>
                  <Text fw={500} c={theme.colors.primary[5]}>Lượt đăng kí mới</Text>
                  <Text fw={500} size="18px">{newSubscribers.data?.results[1].count}</Text>
                </Stack>
              }()}

              <ThemeIcon
                variant="gradient"
                gradient={{ from: 'violet', to: 'rgba(105, 137, 255, 1)', deg: 244 }}
                radius='50%'
                size={48}
              >
                <IconChartBar />
              </ThemeIcon>
            </Group>

            <Group mt={20}>
              {function () {
                if (newSubscribers.isFetching || !newSubscribers.data) return <Skeleton h={10} />

                return <>
                  <Group gap={0}>
                    {newSubscribers.data.results[1].count >= newSubscribers.data.results[0].count ? <IconArrowUp color={theme.colors.green[5]} /> : <IconArrowDown color="red" />}
                    <Text c={newSubscribers.data.results[1].count >= newSubscribers.data.results[0].count ? theme.colors.green[5] : "red"}>{NumberUtils.calcPercentChange(newSubscribers.data.results[1].count, newSubscribers.data.results[0].count)} %</Text>
                  </Group>

                  <Text c={theme.colors.text[1]}>So với tháng trước</Text>
                </>
              }()}
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Stack mt={-70} p={20} gap={40} pb={60}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
            <RevenueChart />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <UsersChart />
          </Grid.Col>
        </Grid>

        <Box>
          <Title order={4} c={theme.colors.text[1]} mb={10}>Thông tin website</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
              <Card flex={3} radius="md" shadow="sm" className={classes.adminCard}>
                <Group justify="space-between">
                  <Text fw={500} c={theme.colors.primary[5]}>Trang chủ</Text>

                  <ThemeIcon
                    variant="gradient"
                    gradient={{ from: 'rgba(255, 89, 33, 1)', to: 'yellow', deg: 201 }}
                    radius='50%'
                    size={48}
                  >
                    <IconNetwork />
                  </ThemeIcon>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </Box>
      </Stack>
    </AdminWrapper>
  </Box>
}

const RevenueChart: FC = () => {
  const theme = useMantineTheme();
  const [data, setData] = useState<any>([]);
  const [selectedToken, setSelectedToken] = useState<AppPayment>(AppPayment.ETH);
  const account = useAccount();
  //const isAdmin = account.information && account.information?.roles.includes(Roles.ADMIN);

  const formatXAxisLabel = (value: any) => {
    const parts = value.split('/');
    return `${parts[0]}/${parts[2]}`
  };

  const getOrderStatistic = async () => {
    const res = await StatisticModule.getOrderRevenueStatistic({ type: StatisticType.MONTH, from: DateTimeUtils.formatDate(DateTimeUtils.getDateWithOffsetMonths(12)), to: DateTimeUtils.formatDate(new Date()) })
    setData(res.results);
  }

  useEffect(() => {
     getOrderStatistic();
  }, [account.information, selectedToken])

  return <Card shadow="sm">
    <Group justify="space-between">
      <Title order={4} c={theme.colors.text[1]}>Doanh thu</Title>

      <Group gap='sm'>
        {Object.values(AppPayment).map((v, k) => <ActionIcon
          key={k}
          radius='50%'
          variant="transparent"
          size={48}
        >
          <Avatar src={renderPayment(v).image} size={64} />
        </ActionIcon>)}
      </Group>
    </Group>
    <Card.Section py={30}>
      {function () {
        if (data) return <LineChart width={800} height={350} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis tickFormatter={formatXAxisLabel} dataKey="from" />
          <YAxis />
          <Tooltip />
          <Line type="natural" dataKey="revenue" stroke={theme.colors.primary[5]} strokeWidth={2} />
        </LineChart>
      }()}
    </Card.Section>
  </Card>
}

const UsersChart: FC = () => {
  const theme = useMantineTheme();
  const [data, setData] = useState<any>([])
  const account = useAccount();
  //const isAdmin = account.information && account.information.roles.includes(Roles.ADMIN);

  const formatXAxisLabel = (value: any) => {
    const parts = value.split('/');
    return `${parts[0]}/${parts[2]}`
  };

  const getUserStatistic = async () => {
    const res = await StatisticModule.getUserStatistic({ type: StatisticType.MONTH, from: DateTimeUtils.formatDate(DateTimeUtils.getDateWithOffsetMonths(12)), to: DateTimeUtils.formatDate(new Date()) })
    setData(res.data?.results);
  }

  useEffect(() => {
    getUserStatistic();
  }, [account.information])

  return <Card shadow="sm">
    <Group justify="space-between">
      <Title order={4} c={theme.colors.text[1]}>Người dùng mới</Title>
    </Group>

    <Card.Section py={30}>
      {function () {
        if (data) return <BarChart width={350} height={360} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis tickFormatter={formatXAxisLabel} dataKey="from" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#f5365c" />
        </BarChart>
      }()}
    </Card.Section>
  </Card>
}