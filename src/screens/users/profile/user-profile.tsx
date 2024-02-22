import { AccountAvatar } from "@/components/account-avatar";
import { AppButton } from "@/components/app/app-button";
import { AppImage } from "@/components/app/app-image";
import { AppWrapper } from "@/components/app/app-wrapper";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { CollectionCard } from "@/components/collection-card";
import { MyCombobox } from "@/components/combobox/my-combobox";
import { EmptyMessage } from "@/components/empty-message";
import { ErrorMessage } from "@/components/error-message";
import { onError } from "@/components/modals/modal-error";
import { onSuccess } from "@/components/modals/modal-success";
import { NftCard } from "@/components/nft-card";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { useChatContext } from "@/modules/chat/context";
import { ChatModule } from "@/modules/chat/modules";
import { CollectionModule } from "@/modules/collection/modules";
import { CollectionStatus, CollectionType } from "@/modules/collection/types";
import { FriendRequestModule } from "@/modules/friend-request/modules";
import { FriendRequest, FriendRequestStatus } from "@/modules/friend-request/types";
import { MarketOrderModule } from "@/modules/marketorder/modules";
import { MarketStatus } from "@/modules/marketorder/types";
import { NftModule } from "@/modules/nft/modules";
import { NftStatus } from "@/modules/nft/types";
import { RequestModule } from "@/modules/request/request";
import { UserModule } from "@/modules/user/modules";
import { UserInformation } from "@/modules/user/types";
import { getChainId } from "@/share/blockchain/context";
import { StringUtils } from "@/share/utils";
import { ActionIcon, AspectRatio, Box, Card, Grid, Group, Pagination, Skeleton, Stack, Tabs, Text, TextInput, UnstyledButton, rem, useMantineTheme } from "@mantine/core";
import { useClipboard, useDebouncedValue, useHover } from "@mantine/hooks";
import { IconCheck, IconCopy, IconCopyCheck, IconEdit, IconFriendsOff, IconLockAccess, IconMessage, IconPlus, IconSearch, IconTrash, IconUpload } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ListLoadState } from "../../../../types";
import classes from '../../../styles/user/UserProfile.module.scss';

enum UserTabsProfile {
  ALL = 'Video',
  CREATED_COLLECTIONS = 'Bộ sưu tập',
  FAVOURITE = 'Đã yêu thích',
  ACTIVITY = 'Hoạt động'
}

export const UserProfileScreen: FC<{ user: UserInformation }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string | null>(UserTabsProfile.ALL);
  const account = useAccount();
  const theme = useMantineTheme();
  const isSignedUser = account.information?.wallet === user.wallet;

  return (
    <AppWrapper>
      <BoundaryConnectWallet>
        <Stack>
          {function () {
            if (!user) return <Skeleton w={'100%'} height={'100%'} />

            return <UserCover user={user} />
          }()}

          <Stack mx={24} style={{
            position: 'relative',
            top: rem(-64),
            zIndex: 10
          }}>
            {function () {
              if (!user) return <Skeleton radius='50%' w={98} height={98} />

              return <UserAvatar user={user} />
            }()}

            <Tabs value={activeTab} maw={'100%'} onChange={setActiveTab} classNames={{
              root: "tab-root",
              list: "tab-list",
              tab: "tab-button",
            }}>
              <Tabs.List grow style={{
                maxWidth: '50%'
              }}>
                {Object.values(UserTabsProfile).map((v, k) => (
                  <Tabs.Tab value={v} key={k}>{v}</Tabs.Tab>
                ))}
              </Tabs.List>

              <Tabs.Panel value={UserTabsProfile.ALL}>
                <TabNfts user={user} isSignedUser={isSignedUser} />
              </Tabs.Panel>

              <Tabs.Panel value={UserTabsProfile.CREATED_COLLECTIONS}>
                <TabCollections user={user} isSignedUser={isSignedUser} />
              </Tabs.Panel>

              <Tabs.Panel value={UserTabsProfile.FAVOURITE}>
                {isSignedUser ? <TabFavouritedNfts user={user} /> : <Group mt={100} justify="center">
                  <Stack align="center">
                    <IconLockAccess size={48} stroke={1.5} color={theme.colors.gray[7]} />
                    <Text fw={500} c={theme.colors.gray[7]}>Bạn không có quyền xem</Text>
                  </Stack>
                </Group>}
              </Tabs.Panel>

            </Tabs>
          </Stack>
        </Stack>
      </BoundaryConnectWallet>
    </AppWrapper>
  )
}

const UserCover: FC<{ user: UserInformation }> = (props) => {
  const theme = useMantineTheme();
  const account = useAccount();
  const { hovered, ref } = useHover();
  const [image, setImage] = useState(props.user.cover || '/images/default/bg-user.jpg');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const isSignedUser = account.information?.wallet === props.user.wallet;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (!file) {
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  }, []);

  const removeImage = (e: any) => {
    setPreviewImage(null);
    setFile(null);
    e.stopPropagation();
  };

  const handleChangeBanner = async () => {
    try {
      let coverURL = null;
      if (file instanceof File)
        coverURL = await RequestModule.uploadMedia(`/api/v1/users/cover`, file as File, 400, "cover");
      if (coverURL) {
        await UserModule.update({ cover: coverURL });
        setImage(coverURL);
        setFile(null);
        setPreviewImage(null);
        onSuccess({ title: "Cập nhật hình nền thành công" });
      }
    } catch (error) {
      onError("Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
    onDrop,
  });

  return (
    <AspectRatio ref={ref} ratio={400 / 100} style={{ overflow: 'hidden', cursor: hovered && isSignedUser ? 'pointer' : 'normal' }}>
      <AppImage src={image} alt="" />

      <Group
        style={{
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
        w={'100%'}
      >
        {isSignedUser && previewImage && <Group pos="relative" style={{
          top: 0,
          bottom: 0,
          right: 0,
          left: 0
        }}>
          <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />

          <Group style={{
            position: 'absolute',
            top: rem(8),
            right: rem(8),
            borderRadius: '50%',
            padding: rem(4),
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            flexWrap: 'wrap'
          }}>
            <AppButton async color={theme.colors.primary[5]} onClick={handleChangeBanner}>
              Lưu
            </AppButton>

            <UnstyledButton
              onClick={removeImage}
            >
              <IconTrash color={theme.colors.text[0]} />
            </UnstyledButton>
          </Group>
        </Group>}

        {isSignedUser && hovered && !previewImage && <div
          {...getRootProps({
            className: classes.dropzone,
          })}
          style={{
            background: hovered ? `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))` : ''
          }}
        >
          <input {...getInputProps()} />

          <Group gap={4}>
            <IconUpload
              style={{ width: rem(52), height: rem(52) }}
              stroke={1.5}
              color={theme.colors.text[0]}
            />
            <Stack gap={2}>
              <Text size="xl" c={theme.colors.text[0]} inline>
                Kéo hoặc thả ảnh
              </Text>
              <Text size="sm" c={theme.colors.text[0]} inline mt={7}>
                Kích thước ảnh không quá 5MB
              </Text>
            </Stack>
          </Group>
        </div>}

      </Group>
    </AspectRatio>
  )
}

const UserAvatar: FC<{ user: UserInformation }> = (props) => {
  const theme = useMantineTheme();
  const { hovered, ref } = useHover();
  const chatContext = useChatContext();
  const account = useAccount();
  const [username, setUsername] = useState(props.user.username);
  const [image, setImage] = useState(props.user.avatar || '/images/default/avatar.png');
  const [friendRequest, setFriendRequest] = useState<FriendRequest>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditName, setIsEditName] = useState(false);
  const [opened, setOpened] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isRecipientFriendRequest, setisRecipientFriendRequest] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const clipboard = useClipboard({ timeout: 500 });
  const router = useRouter();
  const isSignedUser = account.information?.wallet === props.user.wallet;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (!file) {
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        return;
      }

      // Tạo một đường dẫn URL cho hình ảnh và đặt nó trong state để hiển thị trước
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  }, []);

  const removeImage = (e: any) => {
    setPreviewImage(null);
    setFile(null);
    e.stopPropagation();
  };

  const getFriendRequest = async () => {
    try {
      let res = await FriendRequestModule.getListFriendRequests({ to: props.user.wallet, sort: '-createdAt' });
      setFriendRequest(res.data.request[0]);
      setIsFriend(res.data.request[0].status === FriendRequestStatus.ISFRIEND);
      setIsPending(res.data.request[0].status === FriendRequestStatus.ISPENDING);
      setisRecipientFriendRequest(account.information?.wallet === res.data.request[0].to && res.data.request[0].status === FriendRequestStatus.ISPENDING);
    } catch (error) {

    }
  }

  const handleChangeAvatar = async () => {
    try {
      let avatarURL = null;
      if (file instanceof File)
        avatarURL = await RequestModule.uploadMedia(`/api/v1/users/avatar`, file as File, 400, "avatar");

      if (avatarURL) {
        await UserModule.update({ avatar: avatarURL });
        setImage(avatarURL);
        setFile(null);
        setPreviewImage(null);
        onSuccess({ title: "Cập nhật ảnh đại diện thành công" });
      }
    } catch (error) {
      onError("Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const handleAddfriend = async () => {
    try {
      const res = await FriendRequestModule.create({ chainID: getChainId()!, to: props.user!.wallet!, from: account.information!.wallet!, status: FriendRequestStatus.ISPENDING })
      setIsFriend(false);
      setIsPending(true);
    } catch (error) {
      onError("Không thể kết bạn");
    }
  }

  const updateUserInfo = async () => {
    try {
      const res = await UserModule.update({ username });
      props.user.username = res.data.username;
      setIsEditName(false);
    } catch (error) {

    }
  }

  const handleUnfriend = async () => {
    try {
      await FriendRequestModule.update({ status: FriendRequestStatus.CANCELLED, to: props.user.wallet, from: account.information?.wallet, chainID: getChainId() });
      setIsFriend(false);
      setIsPending(false);
      setisRecipientFriendRequest(false);
    } catch (error) {
      onError("Hủy kết bạn thất bại, vui lòng thử lại sau");
    }
  }

  const handleAcceptFriendRequest = async () => {
    try {
      await FriendRequestModule.update({ status: FriendRequestStatus.ISFRIEND, to: props.user.wallet, from: account.information?.wallet, chainID: getChainId() });
      setIsFriend(true);
      setIsPending(false);
      setisRecipientFriendRequest(false);
    } catch (error) {
      onError("Hủy kết bạn thất bại, vui lòng thử lại sau");
    }
  }

  const handleStartChat = async () => {
    try {
      const data = await chatContext.checkIfAvailableChat(props.user.wallet!);
      if (!data) {
        await chatContext.createChat({ firstUser: account.information?.wallet, secondUser: props.user.wallet });
      } else await chatContext.handleChangeChat(data.id, data.secondUser);

      router.push("/users/messages");
    } catch (error) {
      onError("Có lỗi xảy ra, vui lòng thử lại sau")
    }
  }

  useEffect(() => {
    getFriendRequest();
  }, [isFriend, isPending])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
    onDrop,
  });

  return (
    <Stack gap={6}>
      <Group style={{
        borderRadius: '50%',
        width: rem(98),
        height: rem(98),
        position: "relative"
      }} ref={ref}>
        <AccountAvatar
          size={98}
          src={image}
        />

        {isSignedUser && previewImage && <div
          className={classes.dropzone}
          style={{ borderRadius: '50%' }}
        >
          <AccountAvatar
            size={98}
            src={previewImage}
          />
        </div>}

        {isSignedUser && hovered && !previewImage && <div
          {...getRootProps({
            className: classes.dropzone,
          })}
          style={{
            background: hovered ? `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))` : '',
            borderRadius: '50%'
          }}
        >
          <input {...getInputProps()} />

          <IconUpload
            style={{ width: rem(36), height: rem(36) }}
            stroke={1.5}
            color={theme.colors.text[0]}
          />
        </div>}
      </Group>

      <Group miw={300} gap={4} style={{
        position: "absolute",
        left: rem(110),
        top: rem(60)
      }}>
        <Text c={theme.colors.gray[7]}>{StringUtils.compact(props.user.wallet, 6, 5)}</Text>
        {clipboard.copied ? <ActionIcon
          c={theme.colors.gray[7]}
          variant="transparent"
        >
          <IconCopyCheck size={20} stroke={1.5} />
        </ActionIcon> : <ActionIcon
          c={theme.colors.gray[7]}
          variant="transparent"
          onClick={() => clipboard.copy(props.user.wallet)}
        >
          <IconCopy size={20} stroke={1.5} />
        </ActionIcon>}

        {!isSignedUser && !isFriend && !isPending && <AppButton
          onClick={handleAddfriend}
          async
          color={theme.colors.primary[5]}
          leftSection={<IconPlus size={20} />}
        >
          Kết bạn
        </AppButton>}

        {!isSignedUser && (isFriend || isPending) && <Box pos="relative">
          <AppButton
            onClick={() => setOpened(!opened)}
            async
            variant={isRecipientFriendRequest ? "filled" : "outline"}
            color={theme.colors.primary[5]}
            leftSection={<IconCheck size={20} />}
          >
            {isFriend ? "Bạn bè" : isRecipientFriendRequest ? "Chấp nhận" : "Đang chờ"}
          </AppButton>

          {opened && <Card shadow="md" p={10} withBorder style={{
            position: 'absolute',
            zIndex: 10
          }}>
            {isRecipientFriendRequest && <AppButton
              onClick={handleAcceptFriendRequest}
              variant="transparent"
              leftSection={<IconPlus size={20} />}
              color={theme.colors.text[1]}
              justify="left"
              height={40}
            >
              Chấp nhận lời mời
            </AppButton>}

            <AppButton
              onClick={handleUnfriend}
              variant="transparent"
              leftSection={<IconFriendsOff size={20} />}
              color={theme.colors.text[1]}
              justify="left"
              height={40}
            >
              Hủy kết bạn
            </AppButton>
          </Card>}
        </Box>}

        {!isSignedUser && <AppButton
          onClick={handleStartChat}
          async
          variant="outline"
          color={theme.colors.primary[5]}
          leftSection={<IconMessage size={20} />}
        >
          Nhắn tin
        </AppButton>}
      </Group>

      {previewImage && <Group ml={14}>
        <ActionIcon
          variant="outline"
          color={theme.colors.green[7]}
          onClick={handleChangeAvatar}
        >
          <IconCheck />
        </ActionIcon>

        <ActionIcon
          variant="outline"
          color="danger"
          onClick={removeImage}
        >
          <IconTrash />
        </ActionIcon>
      </Group>}

      {isEditName ? <Group mt={10}>
        <TextInput
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <ActionIcon
          onClick={updateUserInfo}
          variant="outline"
          color={theme.colors.green[7]}
        >
          <IconCheck />
        </ActionIcon>

        <AppButton
          onClick={() => { setIsEditName(false); setUsername(props.user.username) }}
          variant="light"
          color={theme.colors.gray[7]}
        >
          Hủy
        </AppButton>
      </Group> : <Group gap={2}>
        <Text c={theme.colors.text[1]} fw="bold" ml={14}>{props.user.username}</Text>

        {isSignedUser && <ActionIcon
          onClick={() => setIsEditName(true)}
          c={theme.colors.gray[7]}
          variant="transparent"
        >
          <IconEdit size={20} stroke={1.5} />
        </ActionIcon>}
      </Group>}
    </Stack>
  )
}

const TabNfts: FC<{ user: UserInformation, isSignedUser: boolean }> = ({ user, isSignedUser }) => {
  const [tokens, setTokens] = useState<ListLoadState<any, 'tokens'>>({ isFetching: true, data: { tokens: [], count: 0 } });
  const gridColumns = {
    lg: 3,
    sm: 4,
    xs: 6
  }
  const theme = useMantineTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(NftStatus.ALL);
  const [activePage, setPage] = useState(1);
  const [debounced] = useDebouncedValue(search, 200);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { isMobile, isTablet } = useResponsive();
  const limit = isMobile ? 10 : 12;

  const fetchItems = async () => {
    try {
      setTokens(s => ({ ...s, isFetching: true, data: { tokens: [], count: 0 } }));
      let listItems: any;
      let sort = '';
      let status: any;
      //get list by filter
      if (filter !== NftStatus.ALL) {
        if (filter === NftStatus.OLDEST) sort = '+createdAt';
        if (filter === NftStatus.NEWEST) sort = '-createdAt';
      }

      if (filter === NftStatus.ISLISTING) {
        listItems = await MarketOrderModule.getTokensStatus({ status: MarketStatus.ISLISTING, active: isSignedUser ? null : true });
        console.log("list tokens: ", listItems)
      }
      if (filter === NftStatus.SOLD) {
        listItems = await MarketOrderModule.getTokensStatus({ status: MarketStatus.SOLD, active: isSignedUser ? null : true });
        console.log("list tokens: ", listItems)
      } else {
        listItems = await NftModule.getAllNftsOfUser(user.wallet!, { limit, offset: (activePage - 1) * limit, sort, active: isSignedUser ? null : true });
      }

      // if (filter === NftStatus.ISLISTING || filter === NftStatus.SOLD) {
      //   const nfts = [];
      //   for (const v of listItems.data.tokens) {
      //     const checkIsSatisfied = await MarketOrderModule.checkTokenIsListed(v.tokenID, { status: filter });

      //     if (checkIsSatisfied) {
      //       nfts.push(v);
      //     }
      //   }
      //   listItems.data.tokens = nfts;
      //   listItems.data.count = nfts.length;
      // }

      if (search.length > 0 && !!listItems.data.tokens) {
        const nfts = listItems.data.tokens.filter((v: any, k: any) => {
          if (v.title.includes(search) || v.description.includes(search)) return true;
          return false;
        })
        listItems.data.tokens = nfts;
        listItems.data.count = nfts.length;
      }
      setTokens(s => ({ ...s, isFetching: false, data: { tokens: listItems.data.tokens || [], count: listItems.data.count || 0 } }));
      setTotalPages(Math.ceil(listItems.data.count / limit));
    } catch (error) {
      setTokens(s => ({ ...s, isFetching: false }));
    }
  }

  useEffect(() => {
    fetchItems();
  }, [activePage, filter, debounced])

  return (
    <>
      <Group mt={20}>
        <TextInput placeholder="Nhập từ khóa" miw={'30%'} rightSection={<IconSearch />} radius={10} styles={{
          input: {
            height: '45px',
          },
          section: {
            paddingRight: `${theme.spacing.md}`
          }
        }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MyCombobox
          initialvalue={NftStatus.ALL}
          options={NftStatus}
          styles={{
            dropdown: {
              maxHeight: '200px',
              overflow: 'hidden',
              overflowY: 'auto',
            },
          }}
          classNames={{
            dropdown: 'hidden-scroll-bar'
          }}
          classnamesinput="combobox-input"
          classnamesroot="combobox-root-input"
          onChange={(val) => { setFilter(val) }}
        />
      </Group>

      <Text my={10} fw="bold" c={theme.colors.text[1]}>{tokens.data?.count || 0} kết quả</Text>

      {function () {
        if (tokens.isFetching || !tokens.data) return <Grid>
          {Array(4).fill(0).map((_, key) => (
            <Grid.Col key={key} span={{ ...gridColumns }}>
              <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
            </Grid.Col>
          ))}
        </Grid>

        if (tokens.error) return <Group><ErrorMessage error={tokens.error} /></Group>

        if (tokens.data.count === 0) return <EmptyMessage />
        return <Grid gutter={theme.spacing.md}>
          {tokens.data?.tokens.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <NftCard nft={v} key={k} />
            </Grid.Col>
          ))}
        </Grid>
      }()}

      <Pagination color={theme.colors.primary[5]} total={totalPages} siblings={2} value={activePage} onChange={setPage} styles={{
        root: {
          marginTop: '80px',
          display: 'flex',
          justifyContent: 'center'
        },
        control: {
          padding: '20px 15px',
        }
      }}
      />
    </>
  )
}

const TabCollections: FC<{ user: UserInformation, isSignedUser: boolean }> = ({ user, isSignedUser }) => {
  const [collections, setCollections] = useState<ListLoadState<any, 'collections'>>({ isFetching: true, data: { collections: [], count: 0 } });
  const gridColumns = {
    lg: 3,
    sm: 4,
    xs: 6
  }
  const theme = useMantineTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(CollectionType.ALL);
  const [status, setStatus] = useState(CollectionStatus.ALL);
  const [activePage, setPage] = useState(1);
  const [debounced] = useDebouncedValue(search, 200);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { isMobile, isTablet } = useResponsive();
  const limit = isMobile ? 10 : 12;

  const fetchItems = async () => {
    try {
      setCollections(s => ({ ...s, isFetching: true, data: { collections: [], count: 0 } }));
      let listItems: any;
      let sort = '';
      //get list by filter
      if (status !== CollectionStatus.ALL) {
        if (status === CollectionStatus.MOST_VIEWS) sort = '-totalViews';
        if (status === CollectionStatus.MOST_AVGPRICE) sort = '-averagePrice';
        if (status === CollectionStatus.NEWEST) sort = '-createdAt';
        if (status === CollectionStatus.OLDEST) sort = '+createdAt';
      }

      listItems = await CollectionModule.getCollecionsOfUser(user.wallet!, { limit, offset: (activePage - 1) * limit, sort, category: filter !== CollectionType.ALL ? filter as string : '', active: isSignedUser ? null : true });
      if (search.length > 0 && !!listItems.data.collections) {
        const collections = listItems.data.collections.filter((v: any, k: any) => {
          if (v.title.includes(search) || v.description.includes(search)) return true;
          return false;
        })
        listItems.data.collections = collections;
        listItems.data.count = collections.length;
      }
      setCollections(s => ({ ...s, isFetching: false, data: { collections: listItems.data.collections, count: listItems.data.count } }));

      setTotalPages(Math.ceil(listItems.data.count / limit));
    } catch (error) {
      setCollections(s => ({ ...s, isFetching: false }));
      onError(error);
    }
  }

  useEffect(() => {
    fetchItems();
  }, [activePage, filter, status, debounced])

  return (
    <>
      <Group mt={20}>
        <TextInput placeholder="Nhập từ khóa" miw={'30%'} rightSection={<IconSearch />} radius={10} styles={{
          input: {
            height: '45px',
          },
          section: {
            paddingRight: `${theme.spacing.md}`
          }
        }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MyCombobox
          initialvalue={CollectionType.ALL}
          options={CollectionType}
          styles={{
            dropdown: {
              maxHeight: '200px',
              overflow: 'hidden',
              overflowY: 'auto',
            },
          }}
          classNames={{
            dropdown: 'hidden-scroll-bar'
          }}
          classnamesinput="combobox-input"
          classnamesroot="combobox-root-input"
          onChange={(val) => { setFilter(val) }}
        />
        <MyCombobox
          initialvalue={CollectionStatus.ALL}
          options={CollectionStatus}
          styles={{
            dropdown: {
              maxHeight: '200px',
              overflow: 'hidden',
              overflowY: 'auto',
            },
          }}
          classNames={{
            dropdown: 'hidden-scroll-bar'
          }}
          classnamesinput="combobox-input"
          classnamesroot="combobox-root-input"
          onChange={(val) => { setStatus(val) }}
        />
      </Group>

      <Text my={10} fw="bold" c={theme.colors.text[1]}>{collections.data?.count || 0} kết quả</Text>

      {function () {
        if (collections.isFetching || !collections.data) return <Grid>
          {Array(4).fill(0).map((_, key) => (
            <Grid.Col key={key} span={{ ...gridColumns }}>
              <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
            </Grid.Col>
          ))}
        </Grid>

        if (collections.error) return <Group><ErrorMessage error={collections.error} /></Group>

        if (collections.data.count === 0) return <EmptyMessage />
        return <Grid gutter={theme.spacing.md}>
          {collections.data?.collections.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <CollectionCard collection={v} key={k} />
            </Grid.Col>
          ))}
        </Grid>
      }()}

      <Pagination color={theme.colors.primary[5]} total={totalPages} siblings={2} value={activePage} onChange={setPage} styles={{
        root: {
          marginTop: '80px',
          display: 'flex',
          justifyContent: 'center'
        },
        control: {
          padding: '20px 15px',
        }
      }}
      />
    </>
  )
}

const TabFavouritedNfts: FC<{ user: UserInformation }> = ({ user }) => {
  const [tokens, setTokens] = useState<ListLoadState<any, 'tokens'>>({ isFetching: true, data: { tokens: [], count: 0 } });
  const gridColumns = {
    lg: 3,
    sm: 4,
    xs: 6
  }
  enum FavoritedNftStatus {
    ALL = 'Tất cả',
    OLDEST = 'Cũ nhất',
    NEWEST = 'Mới nhất'
  }
  const theme = useMantineTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(FavoritedNftStatus.ALL);
  const [activePage, setPage] = useState(1);
  const [debounced] = useDebouncedValue(search, 200);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { isMobile, isTablet } = useResponsive();
  const limit = isMobile ? 10 : 12;

  const fetchItems = async () => {
    try {
      setTokens(s => ({ ...s, isFetching: true, data: { tokens: [], count: 0 } }));
      let listItems: any;
      let sort = '';
      //get list by filter
      if (filter !== FavoritedNftStatus.ALL) {
        if (filter === FavoritedNftStatus.OLDEST) sort = '+createdAt';
        if (filter === FavoritedNftStatus.NEWEST) sort = '-createdAt';
      }

      listItems = await NftModule.getFavouritedNftsOfUser({ limit, offset: (activePage - 1) * limit, sort });
      console.log(listItems)
      if (search.length > 0 && !!listItems.data.tokens) {
        const nfts = listItems.data.tokens.filter((v: any, k: any) => {
          if (v.title.includes(search) || v.description.includes(search)) return true;
          return false;
        })
        listItems.data.tokens = nfts;
        listItems.data.count = nfts.length;
      }
      console.log("tokens: ", listItems)
      setTokens(s => ({ ...s, isFetching: false, data: { tokens: listItems.data?.tokens, count: listItems.data?.count } }));
      setTotalPages(Math.ceil(listItems.data.count / limit));
    } catch (error) {
      setTokens(s => ({ ...s, isFetching: false }));
      // onError(error);
    }
  }

  useEffect(() => {
    fetchItems();
  }, [activePage, filter, debounced])

  return (
    <>
      <Group mt={20}>
        <TextInput placeholder="Nhập từ khóa" miw={'30%'} rightSection={<IconSearch />} radius={10} styles={{
          input: {
            height: '45px',
          },
          section: {
            paddingRight: `${theme.spacing.md}`
          }
        }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MyCombobox
          initialvalue={FavoritedNftStatus.ALL}
          options={FavoritedNftStatus}
          styles={{
            dropdown: {
              maxHeight: '200px',
              overflow: 'hidden',
              overflowY: 'auto',
            },
          }}
          classNames={{
            dropdown: 'hidden-scroll-bar'
          }}
          classnamesinput="combobox-input"
          classnamesroot="combobox-root-input"
          onChange={(val) => { setFilter(val) }}
        />
      </Group>

      <Text my={10} fw="bold" c={theme.colors.text[1]}>{tokens.data?.count || 0} kết quả</Text>

      {function () {
        if (tokens.isFetching || !tokens.data) return <Grid>
          {Array(4).fill(0).map((_, key) => (
            <Grid.Col key={key} span={{ ...gridColumns }}>
              <Skeleton key={key} radius={rem(10)} width='100%' height={250} />
            </Grid.Col>
          ))}
        </Grid>

        if (tokens.error) return <Group><ErrorMessage error={tokens.error} /></Group>

        if (tokens.data.count === 0) return <EmptyMessage />
        return <Grid gutter={theme.spacing.md}>
          {tokens.data?.tokens.map((v, k) => (
            <Grid.Col key={k} span={{ ...gridColumns }}>
              <NftCard nft={v} key={k} />
            </Grid.Col>
          ))}
        </Grid>
      }()}

      <Pagination color={theme.colors.primary[5]} total={totalPages} siblings={2} value={activePage} onChange={setPage} styles={{
        root: {
          marginTop: '80px',
          display: 'flex',
          justifyContent: 'center'
        },
        control: {
          padding: '20px 15px',
        }
      }}
      />
    </>
  )
}