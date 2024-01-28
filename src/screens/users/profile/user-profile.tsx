import { AccountAvatar } from "@/components/account-avatar";
import { AppButton } from "@/components/app/app-button";
import { AppImage } from "@/components/app/app-image";
import { AppWrapper } from "@/components/app/app-wrapper";
import { Roles, UserTabsProfile, UserInformation } from "@/modules/user/types";
import { StringUtils } from "@/share/utils";
import { ActionIcon, AspectRatio, Box, Divider, Grid, Group, Pagination, Skeleton, Stack, Tabs, Text, TextInput, UnstyledButton, rem, useMantineTheme } from "@mantine/core";
import { useClipboard, useDebouncedValue, useHover } from "@mantine/hooks";
import { IconCheck, IconCopy, IconSearch, IconTrash, IconUpload } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import classes from '../../../styles/user/UserProfile.module.scss';
import { MyCombobox } from "@/screens/marketplace";
import { ListLoadState } from "../../../../types";
import { NftStatus } from "@/modules/nft/types";
import { NftCard } from "@/components/nft-card";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { NftModule } from "@/modules/nft/modules";
import { ErrorMessage } from "@/components/error-message";
import { EmptyMessage } from "@/components/empty-message";
import { CollectionModule } from "@/modules/collection/modules";
import { onError } from "@/components/modals/modal-error";
import { CollectionCard } from "@/components/collection-card";
import { useResponsive } from "@/modules/app/hooks";
import { CollectionStatus, CollectionType } from "@/modules/collection/types";


export const UserProfileScreen: FC<{ user: UserInformation }> = ({ user }) => {
  const [collections, setCollections] = useState<ListLoadState<any, 'collections'>>({ isFetching: true, data: { collections: [], count: 0 } });
  const [favouritedTokens, setFavouritedTokens] = useState<ListLoadState<any, 'tokens'>>({ isFetching: true, data: { tokens: [], count: 0 } });
  const [activeTab, setActiveTab] = useState<string | null>(UserTabsProfile.ALL);
  const theme = useMantineTheme();

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
                <TabNfts user={user} />
              </Tabs.Panel>

              <Tabs.Panel value={UserTabsProfile.CREATED_COLLECTIONS}>
                <TabCollections user={user} />
              </Tabs.Panel>

              <Tabs.Panel value={UserTabsProfile.FAVOURITE}>
                <TabFavouritedNfts user={user} />
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
  const { hovered, ref } = useHover();
  const [image, setImage] = useState(props.user.cover || '/images/default/bg-user.jpg');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
    }
  }, []);

  const removeImage = (e: any) => {
    setPreviewImage(null);
    e.stopPropagation();
  };

  const handleChangeBanner = async () => {
    try {
      //api put
    } catch (error) {

    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
    onDrop,
  });

  return (
    <AspectRatio ref={ref} ratio={400 / 100} style={{ overflow: 'hidden', cursor: hovered ? 'pointer' : 'none' }}>
      <AppImage src={image} alt="" />

      <Group
        style={{
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
        w={'100%'}
      >
        {previewImage && <Group pos="relative" style={{
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

        {hovered && !previewImage && <div
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
  const [image, setImage] = useState(props.user.cover || '/images/default/bg-user.jpg');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const clipboard = useClipboard({ timeout: 500 });

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
    }
  }, []);

  const removeImage = (e: any) => {
    setPreviewImage(null);
    e.stopPropagation();
  };

  const handleChangeAvatar = async () => {
    try {
      //api put
    } catch (error) {

    }
  }

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
          src={props.user.avatar}
        />

        {previewImage && <div
          className={classes.dropzone}
          style={{ borderRadius: '50%' }}
        >
          <AccountAvatar
            size={98}
            src={previewImage}
          />
        </div>}

        {hovered && !previewImage && <div
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
        <ActionIcon
          c={theme.colors.gray[7]}
          variant="transparent"
          onClick={() => clipboard.copy(props.user.wallet)}
        >
          <IconCopy size={20} stroke={1.5} />
        </ActionIcon>
        {clipboard.copied && <Text c={theme.colors.gray[7]}>Đã sao chép</Text>}
      </Group>

      {previewImage && <Group ml={14}>
        <ActionIcon
          variant="outline"
          color={theme.colors.green[7]}
          onClick={removeImage}
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

      <Text c={theme.colors.text[1]} fw="bold" ml={14}>{props.user.username}</Text>
    </Stack>
  )
}

const TabNfts: FC<{ user: UserInformation }> = ({ user }) => {
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
      //get list by filter
      if (filter !== NftStatus.ALL) {
        if (filter === NftStatus.OLDEST) sort = '+createdAt';
        if (filter === NftStatus.NEWEST) sort = '-createdAt';
      }

      listItems = await NftModule.getAllNftsOfUser(user.wallet!, { limit, offset: (activePage - 1) * limit, sort });
      if (search.length > 0 && !!listItems.data.tokens) {
        const nfts = listItems.data.tokens.filter((v, k) => {
          if (v.title.includes(search) || v.description.includes(search)) return true;
          return false;
        })
        listItems.data.tokens = nfts;
        listItems.data.count = nfts.length;
      }
      setTokens(s => ({ ...s, isFetching: false, data: { tokens: listItems.data.tokens, count: listItems.data.count } }));
      setTotalPages(Math.ceil(listItems.data.count / limit));
    } catch (error) {
      setTokens(s => ({ ...s, isFetching: false }));
      onError(error);
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
          initialValue={NftStatus.ALL}
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
          classNamesInput="combobox-input"
          classNamesRoot="combobox-root-input"
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

const TabCollections: FC<{ user: UserInformation }> = ({ user }) => {
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
      listItems = await CollectionModule.getCollecionsOfUser(user.wallet!, { limit, offset: (activePage - 1) * limit, sort, category: filter !== CollectionType.ALL ? filter as string : '' });
      if (search.length > 0 && !!listItems.data.collections) {
        const collections = listItems.data.collections.filter((v, k) => {
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
          initialValue={CollectionType.ALL}
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
          classNamesInput="combobox-input"
          classNamesRoot="combobox-root-input"
          onChange={(val) => { setFilter(val) }}
        />
        <MyCombobox
          initialValue={CollectionStatus.ALL}
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
          classNamesInput="combobox-input"
          classNamesRoot="combobox-root-input"
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
      //get list by filter
      if (filter !== NftStatus.ALL) {
        if (filter === NftStatus.OLDEST) sort = '+createdAt';
        if (filter === NftStatus.NEWEST) sort = '-createdAt';
      }

      listItems = await NftModule.getFavouritedNftsOfUser({ limit, offset: (activePage - 1) * limit, sort });
      if (search.length > 0 && !!listItems.data.tokens) {
        const nfts = listItems.data.tokens.filter((v, k) => {
          if (v.title.includes(search) || v.description.includes(search)) return true;
          return false;
        })
        listItems.data.tokens = nfts;
        listItems.data.count = nfts.length;
      }
      setTokens(s => ({ ...s, isFetching: false, data: { tokens: listItems.data.tokens, count: listItems.data.count } }));
      setTotalPages(Math.ceil(listItems.data.count / limit));
    } catch (error) {
      setTokens(s => ({ ...s, isFetching: false }));
      onError(error);
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
          initialValue={NftStatus.ALL}
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
          classNamesInput="combobox-input"
          classNamesRoot="combobox-root-input"
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