import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection } from "@/modules/collection/types";
import { useConfig } from "@/modules/configs/context";
import { NftModule } from "@/modules/nft/modules";
import { Nft } from "@/modules/nft/types";
import { UserModule } from "@/modules/user/modules";
import { useBlockChain } from "@/share/blockchain/context";
import { ChainId } from "@/share/blockchain/types";
import { StringUtils } from "@/share/utils";
import { ActionIcon, AspectRatio, Box, Burger, Card, Center, Divider, Drawer, Group, Image, Loader, Menu, Modal, Skeleton, Stack, Switch, Text, TextInput, Transition, UnstyledButton, rem, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useClickOutside, useDebouncedValue, useDisclosure, useWindowScroll } from "@mantine/hooks";
import { IconFriends, IconLogout, IconMessage2, IconMoonFilled, IconNetwork, IconSearch, IconSettings, IconUserBolt, IconWallet } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { AppRoutes } from "../../../app-router";
import classes from "../../styles/app/AppHeader.module.scss";
import { Balances } from "../account-balances";
import { AccountInfo } from "../account-info";
import { ConnectWallet } from "../buttons/connect-wallet";
import { onError } from "../modals/modal-error";
import { AppButton } from "./app-button";
import { AppNotification } from "./app-notification";

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
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [scroll, scrollTo] = useWindowScroll();
  const { isDarkMode } = useConfig();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const router = useRouter();

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
            <ActionIcon
              onClick={() => router.push(AppRoutes.user.messages)}
              variant="light"
              color={theme.colors.primary[5]}
              size={28}
              h={40}
              w={42}>
              <IconMessage2 size={26} />
            </ActionIcon>

            <AppNotification />
          </>}

          {isMobile && <HeaderSearchMobile />}

          <Account />

          {isMobile && <MenuAccountMobile />}
        </Group>
      </Group>
    </header>
  );
}

export const HeaderSearch: FC = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState<boolean>(false);
  const blockchain = useBlockChain();
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 200);
  const defaultState: ResultProps = { isFetching: false, isInitialized: false, data: { users: [], collections: [], nfts: [], } }
  const [results, setResults] = useState<ResultProps>(defaultState);
  const clickOutsideRef = useClickOutside(() => setOpened(false));

  const fetchSearchResults = async () => {
    if (!search) return setResults(defaultState);

    try {
      setResults(s => ({ ...s, isInitialized: true }))
      const res = await Promise.all([
        NftModule.getList({ chainID: blockchain.chainId, search, limit: 5 }),
        CollectionModule.getList({ chainID: blockchain.chainId, search, limit: 5 }),
        UserModule.getListUsers({ chainID: blockchain.chainId, search, limit: 5 })
      ])
      // console.log(res)
      setResults(s => ({
        ...s,
        isFetching: false,
        isInitialized: true,
        data: {
          ...s.data,
          nfts: res[0].data ? res[0].data.tokens : [],
          collections: res[1].data ? res[1].data.collections : [],
          users: res[2].data ? res[2].data.users : []
        }
      }))
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
            top: "50px",
            maxHeight: '600px',
            overflowY: 'scroll'
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
                  <Text size="14px" mb={5} fw='bold' c={theme.colors.text[1]}>Video</Text>
                  <Stack gap={0}>
                    {videos.map((item, key) => <Link key={key} href={`/nfts/${item.tokenID}`}>
                      <Group className="menu-item" mb={10}>
                        <AspectRatio ratio={64 / 48} w={64} style={{
                          overflow: 'hidden',
                          borderRadius: '8px'
                        }}>
                          <img src={'/images/default/video.svg'} />
                        </AspectRatio>

                        <Stack gap={4}>
                          <Text fw={500} c={theme.colors.text[1]}>{StringUtils.limitCharacters(item.title || '', 15)}</Text>
                          <Text c="dimmed" size="14px">{StringUtils.limitCharacters(item.owner || '', 15)}</Text>
                        </Stack>
                      </Group>
                    </Link>)}
                  </Stack>
                </>}
                {!!collections.length && <>
                  <Text size="14px" mb={5} fw='bold' c={theme.colors.text[1]}>Bộ sưu tập</Text>
                  <Stack gap={0}>
                    {collections.map((item, key) => <Link key={key} href={`/collections/${item.collectionID}`}>
                      <Group className="menu-item" gap={8}>
                        <AspectRatio ratio={64 / 48} w={64} style={{ overflow: 'hidden' }}>
                          <Image radius={10} src={item.bannerURL} />
                        </AspectRatio>

                        <Stack gap={2}>
                          <Text fw={500} c={theme.colors.text[1]}>{item.title}</Text>
                          <Text size="12px" c="dimmed">{StringUtils.compact(item.creatorCollection, 4, 5)}</Text>
                        </Stack>
                      </Group>
                    </Link>)}
                  </Stack>
                </>}
                {!!users.length && <>
                  <Text size="14px" mb={5} fw='bold' c={theme.colors.text[1]}>Nhà sáng tạo</Text>
                  <Stack gap={0}>
                    {users.map((item, key) => <Link key={key} href={`/users/${item.wallet}`}>
                      <Group className="menu-item" gap={8}>
                        <AspectRatio ratio={1} w={48} style={{
                          overflow: 'hidden',
                          borderRadius: '8px'
                        }}>
                          <img src={item.avatar || '/images/default/ava.jpeg'} />
                        </AspectRatio>

                        <Stack gap={4}>
                          <Text fw={500} c={theme.colors.text[1]}>{StringUtils.limitCharacters(item.username || '', 15)}</Text>
                          <Text c="dimmed" size="14px">{StringUtils.compact(item.wallet, 5, 5)}</Text>
                        </Stack>
                      </Group>
                    </Link>)}
                  </Stack>
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
  const blockchain = useBlockChain();
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 200);
  const defaultState: ResultProps = { isFetching: false, isInitialized: false, data: { users: [], collections: [], nfts: [], } }
  const [results, setResults] = useState<ResultProps>(defaultState)

  const fetchSearchResults = async () => {
    if (!search) return setResults(defaultState);

    try {
      setResults(s => ({ ...s, isInitialized: true }))
      const res = await Promise.all([
        NftModule.getList({ chainID: blockchain.chainId, search, limit: 5 }),
        CollectionModule.getList({ chainID: blockchain.chainId, search, limit: 5 }),
        UserModule.getListUsers({ chainID: blockchain.chainId, search, limit: 5 })
      ])
      setResults(s => ({
        ...s,
        isFetching: false,
        isInitialized: true,
        data: {
          ...s.data,
          nfts: res[0].data ? res[0].data.tokens : [],
          collections: res[1].data ? res[1].data.collections : [],
          users: res[2].data ? res[2].data.users : []
        }
      }))
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
          <TextInput
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Nhập từ khóa"
            rightSection={<IconSearch />}
            radius={24}
            miw='100%'
            styles={{
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

            return <Box>
              {function () {
                if (results.isFetching) return <Center>
                  <Loader size={"xs"} />
                </Center>

                const users = results.data.users;
                const collections = results.data.collections;
                const videos = results.data.nfts;

                return <Stack gap={5}>
                  {!!videos.length && <>
                    <Text size="14px" fw='bold' c={theme.colors.text[1]}>Video</Text>
                    <Stack>
                      {videos.map((item, key) => <Link key={key} href={`/nfts/${item.tokenID}`}>
                        <Group className="menu-item" mb={10}>
                          <AspectRatio style={{
                            width: '64px',
                            overflow: 'hidden',
                            borderRadius: '8px'
                          }}>
                            <img src={'/images/default/video.svg'} />
                          </AspectRatio>

                          <Stack gap={4}>
                            <Text fw={500} c={theme.colors.text[1]}>{StringUtils.limitCharacters(item.title || '', 15)}</Text>
                            <Text c="dimmed" size="14px">{StringUtils.limitCharacters(item.owner || '', 15)}</Text>
                          </Stack>
                        </Group>
                      </Link>)}
                    </Stack>
                  </>}

                  <Divider my={5} color="none" />

                  {!!collections.length && <>
                    <Text size="14px" fw='bold' c={theme.colors.text[1]}>Bộ sưu tập</Text>
                    <Stack>
                      {collections.map((item, key) => <Link key={key} href={`/collections/${item.collectionID}`}>
                        <Group className="menu-item">
                          <Image radius={10} src={item.bannerURL} width={64} height={58} />
                          <Stack gap={2}>
                            <Text fw={500} c={theme.colors.text[1]}>{item.title}</Text>
                            <Text size="12px" c="dimmed">{StringUtils.compact(item.creatorCollection, 4, 5)}</Text>
                          </Stack>
                        </Group>
                      </Link>)}
                    </Stack>
                  </>}

                  <Divider my={5} color="none" />

                  {!!users.length && <>
                    <Text size="14px" fw='bold' c={theme.colors.text[1]}>Nhà sáng tạo</Text>
                    <Stack>
                      {users.map((item, key) => <Link key={key} href={`/users/${item.wallet}`}>
                        <Group className="menu-item">
                          <AspectRatio style={{
                            width: '64px',
                            overflow: 'hidden',
                            borderRadius: '8px'
                          }}>
                            <img src={item.avatar || '/images/default/ava.jpeg'} />
                          </AspectRatio>

                          <Stack gap={4}>
                            <Text fw={500} c={theme.colors.text[1]}>{StringUtils.limitCharacters(item.username || '', 15)}</Text>
                            <Text c="dimmed" size="14px">{StringUtils.compact(item.wallet, 5, 5)}</Text>
                          </Stack>
                        </Group>
                      </Link>)}
                    </Stack>
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
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);

  return <>
    <Burger c={theme.colors.gray[2]} onClick={open} />

    <Drawer position="right" opened={opened} onClose={close} title="Menu">
      {/* Drawer content */}
    </Drawer>
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
    { label: 'Bạn bè', route: AppRoutes.user.friends, icon: <IconFriends />, },
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