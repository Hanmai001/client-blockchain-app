import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { useConfig } from "@/modules/configs/context";
import { useBlockChain } from "@/share/blockchain/context";
import { ChainId } from "@/share/blockchain/types";
import { Group, Menu, Skeleton, Switch, Text, UnstyledButton, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconLogout, IconMoonFilled, IconNetwork, IconSettings, IconWallet } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import classes from '../../styles/admin/AdminHeader.module.scss';
import { Balances } from "../account-balances";
import { AccountInfo } from "../account-info";
import { AppButton } from "../app/app-button";
import { ConnectWallet } from "../buttons/connect-wallet";
import { onError } from "../modals/modal-error";

export const AdminHeader: FC = () => {
  return <header className={classes.headerNormal}>
    <Group ml={240} grow justify="space-between" align="center" h={'100%'}>
      <Group>
        {/* <TextInput
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
          }} /> */}
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
          <AccountInfo account={account.information as any} style={{
            color: theme.colors.text[0]
          }} />
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