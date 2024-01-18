import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { renderPayment } from "@/modules/coins/utils";
import { getChainId, useConfig } from "@/modules/configs/context";
import { useSelector } from "@/redux/store";
import { useBlockChain } from "@/share/blockchain/context";
import { NumberUtils } from "@/share/utils";
import { ActionIcon, Avatar, Group, Image, Menu, Skeleton, Stack, Switch, Text, TextInput, UnstyledButton, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import { IconBell, IconHeartBolt, IconMessage2, IconMoonFilled, IconNetwork, IconSearch, IconSelector, IconSettings, IconUserBolt, IconWallet } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { AppPayment } from "../../../types";
import classes from "../../styles/app/AppHeader.module.scss";
import { AccountInfo } from "../account-info";
import { ConnectWallet } from "../buttons/connect-wallet";
import { onError } from "../modals/modal-error";
import { AppButton } from "./app-button";

export const AppHeader: FC = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [scroll, scrollTo] = useWindowScroll();
  const { isDarkMode } = useConfig();

  return (
    <header className={scroll.y <= 10 ? classes.headerNormal : classes.headerScroll} style={{
      backgroundColor: isDarkMode ? theme.colors.dark[7] : theme.white,
    }}>
      {/* <Text>{scroll.y}</Text> */}
      <Group justify="space-between" align="center" h="100%">
        <Image className={classes.logo} src='/images/logo.png' />

        <Group visibleFrom="sm" style={{
          width: '40%'
        }}>
          <TextInput placeholder="Nhập từ khóa" rightSection={<IconSearch />} radius={24} miw='100%' styles={{
            input: {
              height: '45px',
              paddingLeft: `${theme.spacing.md}`,
            },
            section: {
              paddingRight: `${theme.spacing.md}`
            }
          }} />
        </Group>

        <Balances />

        <Group gap={theme.spacing.sm} justify="flex-end">
          <ActionIcon variant="light" color={theme.colors.primary[5]} size={28} h={40} w={42}>
            <IconMessage2 size={26} />
          </ActionIcon>

          <ActionIcon variant="light" color={theme.colors.primary[5]} size={28} h={40} w={42}>
            <IconBell size={26} />
          </ActionIcon>

          <Account />
        </Group>

        {/* <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" /> */}
      </Group>
    </header>
  );
}

export const Account: FC = () => {
  const account = useAccount();
  const config = useConfig();
  const blockchain = useBlockChain();
  const router = useRouter();
  const { isMobile } = useResponsive();
  const theme = useMantineTheme();
  const { setColorScheme, clearColorScheme } = useMantineColorScheme();
  const [checked, setChecked] = useState(false);

  const profileMenu = [
    { label: 'Trang cá nhân', route: 'd', icon: <IconUserBolt />, },
    { label: 'Yêu thích', route: 'd', icon: <IconHeartBolt />, },
    { label: 'Cài đặt', route: 'd', icon: <IconSettings /> },
    { label: 'Chế độ tối', icon: <IconMoonFilled /> }
  ];

  if (!account.isInitialized) return <Skeleton width={100} height={40} />

  //Account is initalized but haven't connected to metamask yet
  if (!account.isDappConnected) return <ConnectWallet />

  //If user haven't loged in to webapp and no information
  if (!account.isSigned && !account.information) return <AppButton
    async
    leftSection={<IconWallet size={20} />}
    radius={7}
    onClick={() => account.signIn("metamask").catch(error => onError(error))}
    color={theme.colors.primary[5]}
    height={45}
    width={156}
  >
    Đăng nhập
  </AppButton>

  if (config.chainId !== blockchain.chainId) {
    return <Group>
      <AppButton
        async
        leftSection={<IconNetwork size={20} />}
        onClick={() => blockchain.connectChain(blockchain.chainId).catch(error => {})}
        color={theme.colors.primary[5]}
        height={45}
        width={156}
      >
        Đổi mạng
      </AppButton>
    </Group>
  }

  const handleSwitchDarkMode = async () => {
    if (checked) {
      setChecked(!checked);
      setColorScheme('light');
    } else {
      setChecked(!checked);
      setColorScheme('dark');
    }
  }

  return (
    <Menu shadow="md" width={210} trigger="hover" openDelay={100} closeDelay={200} offset={10} closeOnItemClick={false}>
      <Menu.Target>
        <UnstyledButton>
          <AccountInfo account={account.information as any} />
        </UnstyledButton>
      </Menu.Target>

      {function () {
        return <Menu.Dropdown style={{
          borderRadius: theme.radius.md,
        }}>
          {profileMenu.map((v, k) => {
            return <Menu.Item
              key={k}
              onClick={() => {
                if (!!v.route) router.push(v.route);
              }}
              leftSection={v.icon}
              py={theme.spacing.md}
            >
              <Group>
                <Text>{v.label}</Text>
                {!v.route && <Switch size="md" color={theme.colors.primary[5]} checked={checked} onClick={handleSwitchDarkMode} />}
              </Group>
            </Menu.Item>
          })}
        </Menu.Dropdown>
      }()}

    </Menu>
  )
}

const Balances: FC = () => {
  const account = useAccount();
  const blockchain = useBlockChain();
  const balances = useSelector(s => s.coinBalances);
  const [selectedToken, setSelectedToken] = useState<AppPayment>(AppPayment.ETH);
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const { image, symbol } = renderPayment(selectedToken);

  if (!account.information) return;

  if (getChainId() !== blockchain.chainId) return;

  return (
    <>
      {function () {
        if (balances.isFetching) return <Skeleton height={35} width={100} />
        if (!balances.data) return null;

        return (
          <Group gap={10}>
            <Menu shadow="md" openDelay={100} closeDelay={200}>
              <Menu.Target>
                <UnstyledButton w={150} style={(theme) => ({
                  borderRadius: "24px",
                  backgroundColor: theme.colors.primary[0]
                })}>
                  <Group gap={4} justify="space-between">
                    <Avatar size={38} src={image} />
                    <Text c={isDarkMode ? 'white' : 'dark'} size="sm" style={{ lineHeight: 1 }}>{NumberUtils.round(balances.data[selectedToken], 3)}</Text>
                    <IconSelector color={theme.colors.primary[5]} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>


              <Menu.Dropdown miw={150}>
                <Menu.Label>
                  Balances
                </Menu.Label>
                {Object.keys(balances.data).map((key) => {
                  return <Menu.Item
                    key={key}
                    onClick={() => (setSelectedToken(key as AppPayment))}
                  >
                    <Group gap={8}>
                      <Avatar size={30} src={renderPayment(key as any).image} />
                      <Stack gap={0}>
                        <Text c={isDarkMode ? 'white' : 'dark'} opacity={0.7} size={'xs'}>{renderPayment(key as any).symbol}</Text>
                        <Text c={isDarkMode ? 'white' : 'dark'} size={"sm"} style={{ lineHeight: 1 }}>{NumberUtils.round(balances.data[key], 3)}</Text>
                      </Stack>
                    </Group>
                  </Menu.Item>
                })}
              </Menu.Dropdown>
            </Menu>
          </Group>
        )
      }()}
    </>
  )
}