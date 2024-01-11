import { ActionIcon, Text, Box, Burger, Divider, Drawer, Group, HoverCard, Image, Menu, ScrollArea, Skeleton, TextInput, rem, useMantineTheme, UnstyledButton, useMantineColorScheme, Switch } from "@mantine/core";
import { FC, useState } from "react";
import { ConnectWallet } from "../buttons/connect-wallet";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import classes from "../../styles/app/AppHeader.module.scss";
import { IconBell, IconHeartBolt, IconMessage2, IconMoonFilled, IconNetwork, IconNotification, IconSearch, IconSettings, IconUserBolt, IconWallet } from "@tabler/icons-react";
import { useAccount } from "@/modules/account/context";
import { useConfig } from "@/modules/configs/context";
import { useBlockChain } from "@/share/blockchain/context";
import { useRouter } from "next/router";
import { AppButton } from "./app-button";
import { useResponsive } from "@/modules/app/hooks";
import { AccountInfo } from "../account-info";

export const AppHeader: FC = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [scroll] = useWindowScroll();
  const { isDarkMode } = useConfig();

  return (
    <header className={scroll.y <= 10 ? classes.headerNormal : classes.headerScroll} style={{
      backgroundColor: isDarkMode ? theme.colors.dark[7] : theme.white,
    }}>
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

const Account: FC = () => {
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
    { label: 'Chế độ tối', icon: <IconMoonFilled />}
  ];

  if (!account.isInitialized) return <Skeleton width={100} height={40} />

  //Account is initalized but haven't connected to metamask yet
  if (!account.isDappConnected) return <ConnectWallet />

  //If user haven't loged in to webapp and no information
  if (!account.isSigned && !account.information) return <AppButton
    async
    leftSection={<IconWallet size={20} />}
    radius={7}
    onClick={() => account.signIn("metamask").catch(error => { })}
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
        onClick={() => blockchain.connectChain(config.chainId)}
        color={theme.colors.primary[5]}
        height={45}
        width={156}
      >
        Kết nối tới {config.chain.name}
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