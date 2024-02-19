import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { useConfig } from "@/modules/configs/context";
import { useBlockChain } from "@/share/blockchain/context";
import { Group, Image, Menu, Skeleton, Switch, Text, TextInput, UnstyledButton, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconLogout, IconMoonFilled, IconNetwork, IconSearch, IconSettings, IconUserBolt, IconWallet } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { AppRoutes } from "../../../app-router";
import classes from '../../styles/app/AppHeader.module.scss';
import { Balances } from "../account-balances";
import { AccountInfo } from "../account-info";
import { AppButton } from "../app/app-button";
import { ConnectWallet } from "../buttons/connect-wallet";
import { onError } from "../modals/modal-error";
import { ChainId } from "@/share/blockchain/types";

export const AdminHeader: FC = () => {
  const [search, setSearch] = useState<string>();
  const theme = useMantineTheme();
  return <header className={classes.headerNormal}>
    <Group grow justify="space-between" align="center" h={'100%'}>
      <Link href={'/'}>
        <Image className={classes.logo} src='/images/logo.png' />
      </Link>

      <Group>
        <TextInput
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          // onFocus={() => setOpened(true)}
          placeholder="Nhập từ khóa"
          rightSection={<IconSearch />}
          radius={24} miw='100%'
          styles={{
            input: {
              height: '45px',
              paddingLeft: `${theme.spacing.md}`,
            },
            section: {
              paddingRight: `${theme.spacing.md}`
            }
          }} />
      </Group>

      <Group justify="flex-end">
        <Balances />

        <Account />
      </Group>
    </Group>
  </header>
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
    { label: 'Trang cá nhân', route: `${AppRoutes.admin.profile}/${account.information?.wallet}`, icon: <IconUserBolt />, },
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
        onClick={() => config.handleChangeChain(blockchain.chainId as ChainId).catch((error: any) => { onError(error) })}
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
    <Menu shadow="md" width={210} trigger="click-hover" openDelay={100} closeDelay={200} offset={10} closeOnItemClick={false}>
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
              c={theme.colors.text[1]}
            >
              <Group>
                <Text>{v.label}</Text>
                {!v.route && <Switch size="md" color={theme.colors.primary[5]} checked={checked} onClick={handleSwitchDarkMode} />}
              </Group>
            </Menu.Item>
          })}

          <Menu.Divider />

          <Menu.Item
            onClick={() => account.signOut()}
            leftSection={<IconLogout />}
            py={theme.spacing.md}
            c={theme.colors.text[1]}
          >
            <Text>Đăng xuất</Text>
          </Menu.Item>
        </Menu.Dropdown>
      }()}

    </Menu>
  )
}