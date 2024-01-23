import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { renderPayment } from "@/modules/coins/utils";
import { getChainId, useConfig } from "@/modules/configs/context";
import { useSelector } from "@/redux/store";
import { useBlockChain } from "@/share/blockchain/context";
import { NumberUtils } from "@/share/utils";
import { ActionIcon, Avatar, Box, Burger, Card, Center, Group, Image, Loader, Menu, MenuItem, Modal, Skeleton, Stack, Switch, Text, TextInput, Transition, UnstyledButton, rem, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useClickOutside, useDebouncedValue, useDisclosure, useWindowScroll } from "@mantine/hooks";
import { IconBell, IconHeartBolt, IconMessage2, IconMoonFilled, IconNetwork, IconSearch, IconSelector, IconSettings, IconUserBolt, IconWallet } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { AppPayment } from "../../../types";
import classes from "../../styles/app/AppHeader.module.scss";
import { AccountInfo } from "../account-info";
import { ConnectWallet } from "../buttons/connect-wallet";
import { onError } from "../modals/modal-error";
import { AppButton } from "./app-button";
import Link from "next/link";
import { AppRoutes } from "../../../app-router";
import { ChainId } from "@/share/blockchain/types";
import { Nft } from "@/modules/nft/types";
import { Collection } from "@/modules/collection/types";
import { EmptyMessage } from "../empty-message";

interface ResultProps {
  isFetching: boolean,
  isInitialized: boolean,
  data: {
    users: any[],
    collections: Collection[],
    nfts: Nft[],
  }
}

export const AppHeader: FC = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [scroll, scrollTo] = useWindowScroll();
  const { isDarkMode } = useConfig();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <header className={scroll.y <= 10 ? classes.headerNormal : classes.headerScroll} style={{
      backgroundColor: isDarkMode ? theme.colors.dark[7] : theme.white,
    }}>
      <Group justify="space-between" align="center" h="100%">
        <Link href={'/'}>
          <Image className={classes.logo} src='/images/logo.png' />
        </Link>

        <HeaderSearch />

        {!isMobile && <Balances />}

        <Group gap={theme.spacing.sm} justify="flex-end">
          {isDesktop && <>
            <ActionIcon variant="light" color={theme.colors.primary[5]} size={28} h={40} w={42}>
              <IconMessage2 size={26} />
            </ActionIcon>

            <ActionIcon variant="light" color={theme.colors.primary[5]} size={28} h={40} w={42}>
              <IconBell size={26} />
            </ActionIcon>
          </>}

          {isMobile && <HeaderSearchMobile />}
          <Account />

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </Group>
    </header>
  );
}

export const HeaderSearch: FC = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState<boolean>(false);
  const { chainId } = useBlockChain();
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 200);
  const defaultState: ResultProps = { isFetching: false, isInitialized: false, data: { users: [], collections: [], nfts: [], } }
  const [results, setResults] = useState<ResultProps>(defaultState);
  const clickOutsideRef = useClickOutside(() => setOpened(false));

  const fetchSearchResults = async () => {
    if (!search) return setResults(defaultState);

    try {
      // setResults(s => ({ ...s, isInitialized: true }))
      // const res = await Promise.all([
      // ])
      // setResults(s => ({
      //   ...s,
      //   isFetching: false,
      //   isInitialized: true,
      //   data: {
      //     ...s.data,
      //     tokens: res[0].data,
      //     collections: res[1].data,
      //     users: res[2],
      //   }
      // }))
    } catch (error) {
      setResults(s => ({ ...s, isFetching: false, isInitialized: true }))
    }
  }

  useEffect(() => {
    fetchSearchResults()
  }, [debounced])

  return (
    <Group visibleFrom="sm" style={{
      width: '40%',
      position: 'relative'
    }}>
      <TextInput
        onChange={(e) => setSearch(e.target.value)} 
        value={search}
        onFocus={() => setOpened(true)}
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

      <Transition mounted={opened} transition={"scale-y"} duration={200} timingFunction="ease">
        {(styles) => {

          return <Card ref={clickOutsideRef} radius={10} shadow="sm" style={{
            ...styles,
            position: "absolute",
            width: '100%',
            marginTop: "80px",
          }}>
            {function () {
              if (results.isFetching) return <Center>
                <Loader size={"xs"} />
              </Center>

              const users = results.data.users;
              const collections = results.data.collections;
              const videos = results.data.nfts;

              return <Stack gap={5}>
                {!!videos.length && <>
                  <Text size='12px' fw='bold' c={theme.colors.text[1]}>Video</Text>
                  {videos.map((item, key) => <Group>
                    <Stack>
                      <Text>{item.title}</Text>
                      <Text c="dimmed">{item.creator}</Text>
                    </Stack>
                  </Group>)}
                </>}
                {!!collections.length && <>
                  <Text size='12px' fw='bold' c={theme.colors.text[1]}>Video</Text>
                  {collections.map((item, key) => <Group>
                    <Image src={item.bannerURL} width={92} height={64} />
                    <Stack>
                      <Text>{item.title}</Text>
                      <Text c="dimmed">{item.creator}</Text>
                    </Stack>
                  </Group>)}
                </>}
                {!!users.length && <>
                  <Text size='12px' fw='bold' c={theme.colors.text[1]}>Video</Text>
                  {users.map((item, key) => <Group>
                    <Avatar src={item.avatar} />
                    {/* <Stack>
                        <Text>{item.title}</Text>
                        <Text c="dimmed">{item.creator}</Text>
                      </Stack> */}
                  </Group>)}
                </>}
              </Stack>
            }()}
          </Card>
        }}
      </Transition>
    </Group>
  )
}
export const HeaderSearchMobile: FC = () => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const { chainId } = useBlockChain();
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 200);
  const defaultState: ResultProps = { isFetching: false, isInitialized: false, data: { users: [], collections: [], nfts: [], } }
  const [results, setResults] = useState<ResultProps>(defaultState)

  const fetchSearchResults = async () => {
    if (!search) return setResults(defaultState);

    try {
      // setResults(s => ({ ...s, isInitialized: true }))
      // const res = await Promise.all([
      // ])
      // setResults(s => ({
      //   ...s,
      //   isFetching: false,
      //   isInitialized: true,
      //   data: {
      //     ...s.data,
      //     tokens: res[0].data,
      //     collections: res[1].data,
      //     users: res[2],
      //   }
      // }))
    } catch (error) {
      setResults(s => ({ ...s, isFetching: false, isInitialized: true }))
    }
  }

  useEffect(() => {
    fetchSearchResults()
  }, [debounced])

  return (
    <>
      <UnstyledButton onClick={open} style={{
        backgroundColor: `${theme.colors.primary[5]}20`,
        padding: `5px 8px`,
        borderRadius: rem(10),
        display: 'flex'
      }}>
        <IconSearch color={theme.colors.primary[5]} size={28} stroke={1.5} />
      </UnstyledButton>

      <Modal opened={opened} onClose={close} title="Tìm kiếm" fullScreen
        closeButtonProps={{ size: 32 }}
      >
        <Stack>
          <TextInput placeholder="Nhập từ khóa" rightSection={<IconSearch />} radius={24} miw='100%' styles={{
            input: {
              height: '45px',
              paddingLeft: `${theme.spacing.md}`,
            },
            section: {
              paddingRight: `${theme.spacing.md}`
            }
          }} />

          {function () {
            if (!results.isInitialized) return null;

            return <Box pos='absolute' ml={5} pr={50}>
              {function () {
                if (results.isFetching) return <Center>
                  <Loader size={"xs"} />
                </Center>

                const users = results.data.users;
                const collections = results.data.collections;
                const videos = results.data.nfts;

                return <Stack gap={5}>
                  {!!videos.length && <>
                    <Text size='12px' fw='bold' c={theme.colors.text[1]}>Video</Text>
                    {videos.map((item, key) => <Group>
                      <Stack>
                        <Text>{item.title}</Text>
                        <Text c="dimmed">{item.creator}</Text>
                      </Stack>
                    </Group>)}
                  </>}
                  {!!collections.length && <>
                    <Text size='12px' fw='bold' c={theme.colors.text[1]}>Video</Text>
                    {collections.map((item, key) => <Group>
                      <Image src={item.bannerURL} width={92} height={64} />
                      <Stack>
                        <Text>{item.title}</Text>
                        <Text c="dimmed">{item.creator}</Text>
                      </Stack>
                    </Group>)}
                  </>}
                  {!!users.length && <>
                    <Text size='12px' fw='bold' c={theme.colors.text[1]}>Video</Text>
                    {users.map((item, key) => <Group>
                      <Avatar src={item.avatar} />
                      {/* <Stack>
                        <Text>{item.title}</Text>
                        <Text c="dimmed">{item.creator}</Text>
                      </Stack> */}
                    </Group>)}
                  </>}
                </Stack>
              }()}
            </Box>
          }()}
        </Stack>
      </Modal>
    </>
  )
}

export const MenuAccountMobile: FC = () => {

  return <>
  </>
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
    { label: 'Trang cá nhân', route: `${AppRoutes.user.profile}/${account.information?.wallet}`, icon: <IconUserBolt />, },
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
        onClick={() => config.handleChangeChain(blockchain.chainId as ChainId).catch(error => { })}
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