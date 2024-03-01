import { AdminWrapper } from "@/components/admin/admin-wrapper";
import { AppButton } from "@/components/app/app-button";
import { Box, Card, Grid, Group, Stack, Text, ThemeIcon, Title, useMantineTheme } from "@mantine/core";
import { IconArrowUp, IconChartBar, IconChartLine, IconNetwork, IconUsers, IconVideo } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Legend, Bar } from 'recharts';
import classes from '../../../styles/admin/AdminDashboard.module.scss';

export const AdminDashBoard: FC = () => {
  const theme = useMantineTheme();

  return <Box bg="#f8f9fe">
    {/* <BoundaryConnectWallet>
      
    </BoundaryConnectWallet> */}
    <AdminWrapper>
      <Grid bg={theme.colors.dark[6]} style={{
        padding: '20px 20px 80px 20px'
      }}>
        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <Card flex={3} radius="md">
            <Group justify="space-between">
              <Stack gap={6}>
                <Text fw={500} c={theme.colors.primary[5]}>Người dùng mới</Text>
                <Text fw={500} size="18px">350,897</Text>
              </Stack>

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
              <Group gap={0}>
                <IconArrowUp color={theme.colors.green[5]} />
                <Text c={theme.colors.green[5]}>3,41 %</Text>
              </Group>

              <Text c={theme.colors.text[1]}>So với tháng trước</Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <Card flex={3} radius="md">
            <Group justify="space-between">
              <Stack gap={6}>
                <Text fw={500} c={theme.colors.primary[5]}>Tổng NFT</Text>
                <Text fw={500} size="18px">350,897</Text>
              </Stack>

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
              <Group gap={0}>
                <IconArrowUp color={theme.colors.green[5]} />
                <Text c={theme.colors.green[5]}>3,41 %</Text>
              </Group>

              <Text c={theme.colors.text[1]}>So với tháng trước</Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <Card flex={3} radius="md">
            <Group justify="space-between">
              <Stack gap={6}>
                <Text fw={500} c={theme.colors.primary[5]}>Doanh thu</Text>
                <Text fw={500} size="18px">350,897</Text>
              </Stack>

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
              <Group gap={0}>
                <IconArrowUp color={theme.colors.green[5]} />
                <Text c={theme.colors.green[5]}>3,41 %</Text>
              </Group>

              <Text c={theme.colors.text[1]}>So với tháng trước</Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <Card flex={3} radius="md">
            <Group justify="space-between">
              <Stack gap={6}>
                <Text fw={500} c={theme.colors.primary[5]}>Mua NFT</Text>
                <Text fw={500} size="18px">350,897</Text>
              </Stack>

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
              <Group gap={0}>
                <IconArrowUp color={theme.colors.green[5]} />
                <Text c={theme.colors.green[5]}>3,41 %</Text>
              </Group>

              <Text c={theme.colors.text[1]}>So với tháng trước</Text>
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
  const dataTest = [
    {
      date: '1',
      Revenue: 2890,
    },
    {
      date: '2',
      Revenue: 2756,
    },
    {
      date: '3',
      Revenue: 3322,
    },
    {
      date: '4',
      Revenue: 3470,
    },
    {
      date: '5',
      Revenue: 3129,
    },
    {
      date: '6',
      Revenue: 2890,
    },
    {
      date: '7',
      Revenue: 2756,
    },
    {
      date: '8',
      Revenue: 3322,
    },
    {
      date: '9',
      Revenue: 3470,
    },
    {
      date: '10',
      Revenue: 3129,
    },
    {
      date: '11',
      Revenue: 3129,
    },
    {
      date: '12',
      Revenue: 3129,
    },
  ];

  const theme = useMantineTheme();
  const [data, setData] = useState<any>([])

  const formatXAxisLabel = (value: any) => {
    const monthNames = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];
    return monthNames[value - 1];
  };

  useEffect(() => {
    setData(dataTest);
  }, [])

  return <Card shadow="sm">
    <Group justify="space-between">
      <Title order={4} c={theme.colors.text[1]}>Doanh thu</Title>

      <Group gap='sm'>
        <AppButton
          async
          variant="outline"
          color={theme.colors.primary[5]}
        >
          Tuần
        </AppButton>
        <AppButton
          async
          color={theme.colors.primary[5]}
        >
          Tháng
        </AppButton>
      </Group>
    </Group>
    <Card.Section py={30}>
      {function () {
        if (data) return <LineChart width={800} height={350} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis tickFormatter={formatXAxisLabel} dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="natural" dataKey="Revenue" stroke={theme.colors.primary[5]} strokeWidth={2} />
        </LineChart>
      }()}
    </Card.Section>
  </Card>
}

const UsersChart: FC = () => {
  const dataTest = [
    {
      date: '7',
      Users: 10,
    },
    {
      date: '8',
      Users: 20,
    },
    {
      date: '9',
      Users: 12,
    },
    {
      date: '10',
      Users: 23,
    },
    {
      date: '11',
      Users: 43,
    },
    {
      date: '12',
      Users: 43,
    },
  ];
  const theme = useMantineTheme();
  const [data, setData] = useState<any>([])

  const formatXAxisLabel = (value: any) => {
    const monthNames = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];
    return monthNames[value - 1];
  };

  useEffect(() => {
    setData(dataTest);
  }, [])

  return <Card shadow="sm">
    <Group justify="space-between">
      <Title order={4} c={theme.colors.text[1]}>Người dùng mới</Title>
    </Group>

    <Card.Section py={30}>
      {function () {
        if (data) return <BarChart width={350} height={360} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis tickFormatter={formatXAxisLabel} dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Users" fill="#f5365c" />
        </BarChart>
      }()}
    </Card.Section>
  </Card>
}