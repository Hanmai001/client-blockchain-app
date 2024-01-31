import { AppButton } from "@/components/app/app-button";
import { AppFooter } from "@/components/app/app-footer";
import { AppHeader } from "@/components/app/app-header";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { useAccount } from "@/modules/account/context";
import { renderPayment } from "@/modules/coins/utils";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection } from "@/modules/collection/types";
import { Nft } from "@/modules/nft/types";
import { renderLinkContract, useBlockChain } from "@/share/blockchain/context";
import { DateTimeUtils, StringUtils } from "@/share/utils";
import { ActionIcon, AspectRatio, Avatar, Box, Card, Divider, Group, Image, Skeleton, Spoiler, Stack, Text, TextInput, Title, rem, useMantineTheme } from "@mantine/core";
import { useClipboard, useDebouncedValue } from "@mantine/hooks";
import { IconCopy, IconCopyCheck, IconEye, IconSearch, IconShare, IconShoppingCartFilled } from "@tabler/icons-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { AppPayment, DataLoadState } from "../../../types";
import classes from '../../styles/nfts/NftDetail.module.scss';
import { UserModule } from "@/modules/user/modules";
import { onError } from "@/components/modals/modal-error";
import { onListNft } from "@/components/modals/modal-list-nft";
import { NftModule } from "@/modules/nft/modules";
import { onBuyNft } from "@/components/modals/modal-buy-nft";
import { MarketOrder, MarketStatus } from "@/modules/marketorder/types";
import { MarketOrderModule } from "@/modules/marketorder/modules";
import { EmptyMessage } from "@/components/empty-message";

export const NftDetailScreen: FC<{ token: Nft }> = ({ token }) => {
  const theme = useMantineTheme();
  const account = useAccount();
  const blockchain = useBlockChain();
  const [collection, setCollection] = useState<Collection | null>();
  const payment = { image: '', symbol: '' };
  const [isLiked, setIsLiked] = useState<boolean>();
  const [isFavourite, setIsFavourite] = useState<boolean>();
  const [comments, setComments] = useState();
  const [marketOrder, setMarketOrder] = useState<MarketOrder>();
  const [lastSoldOrder, setLastSoldOrder] = useState<MarketOrder>();
  const [marketOrders, setMarketOrders] = useState<MarketOrder[]>([]);
  const [user, setUser] = useState<DataLoadState<any>>({ isFetching: false, data: {} });
  const clipboard = useClipboard({ timeout: 500 });
  const { image, symbol } = renderPayment(collection?.paymentType || AppPayment.ETH);
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 200);
  const [isListing, setIsListing] = useState<boolean>();
  payment.image = image;
  payment.symbol = symbol;

  const fetchCollection = async () => {
    try {
      const res = await CollectionModule.getCollectionByID(token.collectionID);
      setCollection(res.data);
    } catch (error) {
      setCollection(null);
      throw error;
    }
  }

  const fetchUser = async () => {
    try {
      const res = await UserModule.getByWallet(token.creator);
      setUser(s => ({ ...s, isFetching: false, data: res }));
    } catch (error) {
      setUser(s => ({ ...s, isFetching: false }));
      onError(error);
    }
  }

  const fetchComments = async () => {

  }

  const fetchMarketOrders = async () => {
    try {
      let res = await MarketOrderModule.getListOrders({ tokenID: token.tokenID });
      const filteredOrders = res.data.order.filter((v: any) => {
        if (search.length > 0) {
          const satisfiedSearch = MarketOrderModule.getMarketEvent(v.event)?.includes(search)
            || v.buyer.includes(search)
            || v.seller.includes(search)
            || v.price.toString().includes(search);
          if (v.status !== MarketStatus.ISLISTING && satisfiedSearch) return true;
          else return false;
        }
        if (v.status !== MarketStatus.ISLISTING) return true;
      });

      setMarketOrders(filteredOrders);
      res = await MarketOrderModule.getListOrders({ tokenID: token.tokenID, status: MarketStatus.SOLD });
      setLastSoldOrder(res.data.order[res.data.count - 1]);
    } catch (error) {

    }
  }

  const fetchMarketOrderOfToken = async () => {
    try {

      const checkListed = (await MarketOrderModule.checkTokenIsListed(token.tokenID)).data.isListed;
      if (checkListed) {
        const res = await MarketOrderModule.getNewesOrderOfToken(token.tokenID);
        setIsListing(true);
        setMarketOrder(res.data[0]);
      } else setIsListing(false);
    } catch (error) {
      // onError(error);
    }
  }

  const checkLikeFavourite = async () => {
    try {
      const isLiked = await NftModule.checkIsLikeNft(token.tokenID);
      setIsLiked(isLiked);
      const isFavourited = await NftModule.checkIsFavouriteNft(token.tokenID);
      setIsFavourite(isFavourited);
    } catch (error) {
      setIsFavourite(false);
      setIsLiked(false);
    }
  }

  const handleLike = async () => {
    try {
      const res = await NftModule.updateLikeNft(token.tokenID);
      token.listOfLikedUsers = res.data.listOfLikedUsers;
      setIsLiked(!isLiked);
    } catch (error) {
      onError(error);
    }
  }

  const handleFavourite = async () => {
    try {
      const res = await NftModule.updateFavouriteNft(token.tokenID);
      token.listOfFavoriteUsers = res.data.listOfFavoriteUsers;
      setIsFavourite(!isFavourite);
    } catch (error) {
      onError(error);
    }
  }

  const handleContextMenu = (event: any) => {
    event.preventDefault();
  };

  const updateTotalViews = async () => {
    try {
      await NftModule.increaseTotalViews(token.tokenID);
      token.totalViews += 1;
    } catch (error) {
      // onError(error);
    }
  }

  useEffect(() => {
    fetchUser();
    checkLikeFavourite();
    fetchCollection();
    fetchComments();
    fetchMarketOrders();
    fetchMarketOrderOfToken();
  }, [account.information, isListing])

  useEffect(() => {
    fetchMarketOrders();
  }, [debounced])

  useEffect(() => {
    updateTotalViews();
  }, [])

  return (
    <BoundaryConnectWallet>
      <AppHeader />

      {function () {
        if (!token) return <Skeleton width={'100%'} height={600} />

        const isNotSigned = !account.information;
        const isDifferentAccount = account.information?.wallet !== token.owner;

        return <>
          <Stack mx={20} my={90}>
            <Group align="flex-start" gap={30}>
              <Card flex={4} w={500} p={0}>
                <Card.Section>
                  <AspectRatio ratio={100 / 120} style={{
                    overflow: 'hidden',
                    borderRadius: theme.radius.md
                  }}>
                    <video
                      controls
                      controlsList="nodownload"
                      src={token.source}
                      onContextMenu={handleContextMenu}
                    />
                  </AspectRatio>
                </Card.Section>

                {function () {
                  if (marketOrder) return <Group my={10} justify="space-between">
                    <Text c={theme.colors.text[1]}>Giá hiện tại</Text>
                    <Group gap={6}>
                      <Image width={28} height={28} src={payment.image} />
                      <Text size="20px" c={theme.colors.text[1]} fw="bold">{marketOrder.price} {payment.symbol}</Text>
                    </Group>
                  </Group>

                  if (lastSoldOrder) return <Group my={10} justify="space-between">
                    <Text c={theme.colors.text[1]}>Giá bán gần nhất</Text>
                    <Group gap={6}>
                      <Image width={28} height={28} src={payment.image} />
                      <Text size="20px" c={theme.colors.text[1]} fw="bold">{lastSoldOrder.price} {payment.symbol}</Text>
                    </Group>
                  </Group>

                  return <Group my={10} justify="space-between">
                    <Text c={theme.colors.text[1]}>Chưa được bán</Text>
                  </Group>
                }()}

                {(isNotSigned || isDifferentAccount) && isListing && <AppButton
                  async
                  onClick={() => onBuyNft({ order: marketOrder!, onUpdate: () => setIsListing(false) })}
                  leftSection={<IconShoppingCartFilled />}
                  radius={theme.radius.md}
                  color={theme.colors.primary[5]}
                  height={48}
                >
                  Mua ngay
                </AppButton>}

                {!isListing && account.information?.wallet === token.owner && <AppButton
                  async
                  onClick={() => onListNft({ nft: token, onUpdate: () => setIsListing(true) })}
                  leftSection={<IconShoppingCartFilled />}
                  radius={theme.radius.md}
                  color={theme.colors.primary[5]}
                  height={48}
                >
                  Đăng bán
                </AppButton>}

              </Card>

              <Stack flex={8} gap={0}>
                {function () {
                  if (!collection) return <Skeleton height={20} width={'100%'} />

                  return <Title c={theme.colors.primary[5]} order={4}>Bộ sưu tập {collection.title}</Title>
                }()}
                <Title c={theme.colors.text[1]} order={3}>{token.title}</Title>

                <Group justify="space-between">
                  <Text fw={500} c={theme.colors.text[1]}>#{token.tokenID}</Text>
                  <Group gap={4}>
                    <IconEye color={theme.colors.text[1]} />
                    <Text fw={500} style={{ textAlign: 'center', lineHeight: '15px' }} c={theme.colors.text[1]}>{token.totalViews || 0} lượt xem</Text>
                  </Group>
                </Group>

                <Group mt={20}>
                  <Stack gap={0}>
                    <Box onClick={handleLike} style={{
                      backgroundColor: theme.colors.primary[0],
                      width: rem(72),
                      height: rem(72),
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      flexWrap: "wrap",
                      borderRadius: '50%'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" color={isLiked ? "#d65076" : theme.colors.primary[5]} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8c36fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className={isLiked ? classes.iconButtonLiked : ''}
                      >
                        <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" fill="currentColor" strokeWidth="0">
                        </path>
                      </svg>
                    </Box>

                    <Text fw={500} c={theme.colors.text[1]} style={{ textAlign: "center" }}>{token.listOfLikedUsers.length || 0}</Text>
                  </Stack>

                  <Stack gap={0}>
                    <Box onClick={handleFavourite} style={{
                      backgroundColor: theme.colors.primary[0],
                      width: rem(72),
                      height: rem(72),
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      flexWrap: "wrap",
                      borderRadius: '50%'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" color={isFavourite ? theme.colors.yellow[6] : theme.colors.primary[5]} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className={isFavourite ? classes.iconButtonLiked : ''}
                      >
                        <path d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z" fill="currentColor" strokeWidth="0"></path>
                      </svg>
                    </Box>

                    <Text fw={500} c={theme.colors.text[1]} style={{ textAlign: "center" }}>{token.listOfFavoriteUsers.length || 0}</Text>
                  </Stack>

                  <Stack gap={0}>
                    <Box style={{
                      backgroundColor: theme.colors.primary[0],
                      width: rem(72),
                      height: rem(72),
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      flexWrap: "wrap",
                      borderRadius: '50%'
                    }}>
                      <IconShare width={42} height={42} color={theme.colors.primary[5]} />
                    </Box>

                    <Text fw={500} c={theme.colors.text[1]} style={{ textAlign: "center" }}>{token.totalShare || 0}</Text>
                  </Stack>

                  <Stack gap={0}>
                    <Box style={{
                      backgroundColor: theme.colors.primary[0],
                      width: rem(72),
                      height: rem(72),
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      flexWrap: "wrap",
                      borderRadius: '50%'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" color={theme.colors.primary[5]} width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5.821 4.91c3.898 -2.765 9.469 -2.539 13.073 .536c3.667 3.127 4.168 8.238 1.152 11.897c-2.842 3.447 -7.965 4.583 -12.231 2.805l-.232 -.101l-4.375 .931l-.075 .013l-.11 .009l-.113 -.004l-.044 -.005l-.11 -.02l-.105 -.034l-.1 -.044l-.076 -.042l-.108 -.077l-.081 -.074l-.073 -.083l-.053 -.075l-.065 -.115l-.042 -.106l-.031 -.113l-.013 -.075l-.009 -.11l.004 -.113l.005 -.044l.02 -.11l.022 -.072l1.15 -3.451l-.022 -.036c-2.21 -3.747 -1.209 -8.392 2.411 -11.118l.23 -.168z" fill="currentColor" strokeWidth="0"></path>
                      </svg>
                    </Box>

                    <Text fw={500} c={theme.colors.text[1]} style={{ textAlign: "center" }}>0</Text>
                  </Stack>
                </Group>

                <Card mt={20} withBorder shadow="sm" radius={theme.radius.md} p={30}>
                  <Card.Section>
                    <Group align="flex-start" justify="space-between">
                      <Group gap={6} align="flex-start">
                        <Avatar w={64} h={64} src={user.data.avatar || '/images/default/avatar.png'} />
                        <Stack gap={0}>
                          <Text fw={500} c={theme.colors.text[1]}>{user.data.username}</Text>

                          <Text size="14px" c="dimmed">Tạo vào {DateTimeUtils.formatToShow(user.data.createdAt)}</Text>
                        </Stack>
                      </Group>

                      <Group gap={0}>
                        <Text size="14px" c="dimmed">{StringUtils.compact(user.data.wallet, 8, 5)}</Text>
                        <ActionIcon
                          c={theme.colors.gray[7]}
                          variant="transparent"
                          onClick={() => clipboard.copy(user.data.wallet)}
                        >
                          {clipboard.copied ? <IconCopyCheck size={20} stroke={1.5} /> : <IconCopy size={20} stroke={1.5} />}
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card.Section>

                  <Card.Section>
                    <Spoiler maxHeight={50} showLabel="Xem thêm" hideLabel="Ẩn" styles={{
                      control: {
                        color: theme.colors.primary[5]
                      },
                      content: {
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }
                    }}>
                      {token.description}
                    </Spoiler>
                  </Card.Section>

                </Card>

                <Card mt={20} withBorder shadow="sm" radius={theme.radius.md} p={30}>
                  <Card.Section>
                    <Title order={5} c={theme.colors.text[1]}>Thông tin</Title>

                    <Divider my={10} />

                    <Stack gap={theme.spacing.sm}>
                      <Group justify="space-between">
                        <Text fw={500} c={theme.colors.text[1]}>Contract Address</Text>
                        <Link href={renderLinkContract(token.contractAddress, token.chainID)} target="_blank" style={{
                          color: theme.colors.blue[6],
                          textDecoration: 'underline'
                        }}>{StringUtils.compact(token.contractAddress, 8, 5)}</Link>
                      </Group>

                      <Group justify="space-between">
                        <Text fw={500} c={theme.colors.text[1]}>Token ID</Text>
                        <Text c={theme.colors.text[1]}>{token.tokenID}</Text>
                      </Group>

                      <Group justify="space-between">
                        <Text fw={500} c={theme.colors.text[1]}>Token Standard</Text>
                        <Text c={theme.colors.text[1]}>ERC-721</Text>
                      </Group>

                      <Group justify="space-between">
                        <Text fw={500} c={theme.colors.text[1]}>Chain</Text>
                        <Text c={theme.colors.text[1]}>{blockchain.getChain(token.chainID).name}</Text>
                      </Group>

                      <Group justify="space-between">
                        <Text fw={500} c={theme.colors.text[1]}>Ngày đăng bán</Text>
                        <Text c={theme.colors.text[1]}>{DateTimeUtils.formatToShow(token.createdAt)}</Text>
                      </Group>

                      <Group justify="space-between">
                        <Text fw={500} c={theme.colors.text[1]}>Cập nhập lần cuối</Text>
                        <Text c={theme.colors.text[1]}>{DateTimeUtils.formatToShow(token.updatedAt)}</Text>
                      </Group>
                    </Stack>
                  </Card.Section>
                </Card>
              </Stack>
            </Group>

            <Card mt={20} withBorder shadow="sm" radius={theme.radius.md} p={30}>
              <Card.Section>
                <Title order={5} c={theme.colors.text[1]}>Lịch sử giao dịch</Title>

                <Divider my={10} />

                <TextInput my={10} placeholder="Tìm kiếm theo tên giao dịch, số tiền" rightSection={<IconSearch />} radius={24} miw='100%' styles={{
                  input: {
                    height: '45px',
                    paddingLeft: `${theme.spacing.md}`,
                  },
                  section: {
                    paddingRight: `${theme.spacing.md}`
                  }
                }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Card.Section>

              <Card.Section>
                <Group justify="space-between">
                  <Title order={5} c={theme.colors.text[1]}>Sự kiện</Title>
                  <Title order={5} c={theme.colors.text[1]}>Số tiền</Title>
                  <Title order={5} c={theme.colors.text[1]}>Nguồn gửi</Title>
                  <Title order={5} c={theme.colors.text[1]}>Nguồn nhận</Title>
                  <Title order={5} c={theme.colors.text[1]}>Ngày thực hiện</Title>
                </Group>

                <Divider my={10} />

                {function () {
                  if (!marketOrders) return <Skeleton h={300} w={'100%'} />

                  if (marketOrders.length === 0) return <Group w={'100%'} justify="center"><EmptyMessage message="Chưa phát sinh giao dịch" /></Group>

                  return <>
                    {marketOrders.map((v, k) => <Box key={k}>
                      <Group justify="space-between">
                        <Text fw={500} c={theme.colors.text[1]}>{MarketOrderModule.getMarketEvent(v.event)}</Text>
                        <Text c={theme.colors.text[1]}>{v.price}</Text>
                        <Link href={renderLinkContract(token.contractAddress, token.chainID)} target="_blank" style={{
                          color: theme.colors.blue[6],
                          textDecoration: 'underline'
                        }}>{StringUtils.compact(v.seller, 5, 5)}</Link>
                        <Link href={renderLinkContract(token.contractAddress, token.chainID)} target="_blank" style={{
                          color: theme.colors.blue[6],
                          textDecoration: 'underline'
                        }}>{StringUtils.compact(v.buyer, 5, 5)}</Link>
                        <Text c={theme.colors.text[1]}>{DateTimeUtils.formatToShow(v.createdAt)}</Text>
                      </Group>
                      <Divider my={10} />
                    </Box>)}
                  </>
                }()}
              </Card.Section>
            </Card>
          </Stack>
        </>
      }()}

      <AppFooter />
    </BoundaryConnectWallet>
  )
}