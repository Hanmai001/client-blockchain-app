import { AppHeader } from "@/components/app/app-header";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { useAccount } from "@/modules/account/context";
import { Nft } from "@/modules/nft/types";
import { renderLinkContract, useBlockChain } from "@/share/blockchain/context";
import { AspectRatio, Image, Card, Group, Stack, Text, useMantineTheme, Title, Box, rem, Avatar, Spoiler, ActionIcon, Divider, TextInput, Grid } from "@mantine/core";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { DataLoadState } from "../../../types";
import { AppFooter } from "@/components/app/app-footer";
import { renderPayment } from "@/modules/coins/utils";
import { AppButton } from "@/components/app/app-button";
import { IconBookmarkFilled, IconCopy, IconCopyCheck, IconEye, IconHeart, IconHeartBolt, IconHeartFilled, IconMessageCircle2Filled, IconSearch, IconShare, IconShoppingCart, IconShoppingCartFilled } from "@tabler/icons-react";
import classes from '../../styles/nfts/NftDetail.module.scss';
import { StringUtils } from "@/share/utils";
import { useClipboard } from "@mantine/hooks";
import Link from "next/link";

const collectionTest = {
  _id: 'afdsf',
  tokenId: '1',
  chainId: '97',
  creator: '0vvdsd',
  bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
  title: "Hình nền đẹp",
  totalViews: 12345,
  totalItems: 12,
  averagePrice: 0.56,
  paymentType: "0",
  description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
}

const nftTest = {
  tokenId: '1',
  _id: '1',
  creator: 'dsfdsf',
  tokenUri: 'dsfdsf',
  collectionId: "1",
  contractAddress: "0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5",
  owner: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
  chainId: '97',
  title: 'Cậu học trò chứng minh bài học vật lý',
  description: "The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣",
  source: "https://www.youtube.com/watch?v=g20t_K9dlhU&list=RDzENVcKkqZWg&index=27",
  totalViews: 0,
  totalLikes: 0,
  totalShare: 0,
  totalFavourite: 0,
  createdAt: '21/11/2023',
  updatedAt: '21/11/2023'
}

const userTest = {
  _id: "1",
  wallet: "0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5",
  username: "Helen Han",
  avatar: "https://1.bp.blogspot.com/-6EQnixbfT84/XqZl3mXibuI/AAAAAAAAjPA/_h72_BQ_r8EHCuQmMJMx8_CVSI1CYRlQgCLcBGAsYHQ/s1600/Anh-avatar-dep-cho-con-trai%2B%252825%2529.jpg",
  createdAt: '21/11/2023',
  updatedAt: '21/11/2023'
}

const ordersTest = [
  {
    _id: '1',
    event: "Transfer",
    chainId: '97',
    tokenId: '1',
    paymentAddress: '0xaa25Aa7a19f9c426E07dee59b12f944f4d9f1DD3',
    price: '0.05',
    seller: "0x6aaef57a890743e6322feb3275e4006b3ecb8cb5",
    buyer: "0x6aaef57a890743e6322feb3275e4006b3ecb8cb5",
    status: "ĐÃ BÁN",
    createdAt: '21/01/2024',
    updatedAt: '21/01/2024',
  },
  {
    _id: '2',
    event: "Transfer",
    chainId: '97',
    tokenId: '1',
    paymentAddress: '0xaa25Aa7a19f9c426E07dee59b12f944f4d9f1DD3',
    price: '0.05',
    seller: "0x6aaef57a890743e6322feb3275e4006b3ecb8cb5",
    buyer: "0x6aaef57a890743e6322feb3275e4006b3ecb8cb5",
    status: "ĐÃ BÁN",
    createdAt: '21/01/2024',
    updatedAt: '21/01/2024',
  },
  {
    _id: '3',
    event: "Transfer",
    chainId: '97',
    tokenId: '1',
    paymentAddress: '0xaa25Aa7a19f9c426E07dee59b12f944f4d9f1DD3',
    price: '0.05',
    seller: "0x6aaef57a890743e6322feb3275e4006b3ecb8cb5",
    buyer: "0x6aaef57a890743e6322feb3275e4006b3ecb8cb5",
    status: "ĐÃ BÁN",
    createdAt: '21/01/2024',
    updatedAt: '21/01/2024',
  }
]

export const NftDetailScreen: FC = () => {
  const theme = useMantineTheme();
  const params = useParams<{ id: string }>();
  const account = useAccount();
  const blockchain = useBlockChain();
  const [nft, setNft] = useState<DataLoadState<any>>({ isFetching: false, data: nftTest })
  const [collection, setCollection] = useState<DataLoadState<any>>({ isFetching: false, data: collectionTest })
  const { image, symbol } = renderPayment(collection.data.paymentType);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [comments, setComments] = useState();
  const [marketOrders, setMarketOrders] = useState(ordersTest);
  const [user, setUser] = useState<DataLoadState<any>>({ isFetching: false, data: userTest });
  const clipboard = useClipboard({ timeout: 500 });

  const fetchNft = async () => {

  }
  const fetchCollection = async () => {

  }
  const fetchComments = async () => {

  }

  const fetchMarketOrders = async () => {

  }

  const handleLike = async () => {

    setIsLiked(!isLiked);
  }

  const handleFavourite = async () => {

    setIsFavourite(!isFavourite);
  }

  const handleContextMenu = (event: any) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchNft();
    fetchCollection();
    fetchComments();
    fetchMarketOrders();
  }, [])

  return (
    <BoundaryConnectWallet>
      <AppHeader />

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
                  src={nft.data.source}
                  onContextMenu={handleContextMenu}
                />
              </AspectRatio>
            </Card.Section>

            <Group my={10} justify="space-between">
              <Text c={theme.colors.text[1]}>Giá hiện tại</Text>
              <Group gap={6}>
                <Image width={28} height={28} src={image} />
                <Text size="20px" c={theme.colors.text[1]} fw="bold">0.0025 {symbol}</Text>
              </Group>
            </Group>

            <AppButton
              async
              leftSection={<IconShoppingCartFilled />}
              radius={theme.radius.md}
              color={theme.colors.primary[5]}
              height={48}
            >
              Mua ngay
            </AppButton>
          </Card>

          <Stack flex={8} gap={0}>
            <Title c={theme.colors.primary[5]} order={4}>Bộ sưu tập {collection.data.title}</Title>
            <Title c={theme.colors.text[1]} order={3}>{nft.data.title}</Title>

            <Group justify="space-between">
              <Text fw={500} c={theme.colors.text[1]}>#{nft.data.tokenId}</Text>
              <Group gap={4}>
                <IconEye color={theme.colors.text[1]} />
                <Text fw={500} style={{ textAlign: 'center', lineHeight: '15px' }} c={theme.colors.text[1]}>{nft.data.totalViews} lượt xem</Text>
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
                  <svg xmlns="http://www.w3.org/2000/svg" color={isLiked ? "#d65076" : theme.colors.primary[5]} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8c36fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    className={isLiked ? classes.iconButtonLiked : ''}
                  >
                    <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" fill="currentColor" stroke-width="0">
                    </path>
                  </svg>
                </Box>

                <Text fw={500} c={theme.colors.text[1]} style={{ textAlign: "center" }}>{nft.data.totalLikes}</Text>
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
                  <svg xmlns="http://www.w3.org/2000/svg" color={isFavourite ? theme.colors.yellow[6] : theme.colors.primary[5]} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    className={isFavourite ? classes.iconButtonLiked : ''}
                  >
                    <path d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z" fill="currentColor" stroke-width="0"></path>
                  </svg>
                </Box>

                <Text fw={500} c={theme.colors.text[1]} style={{ textAlign: "center" }}>{nft.data.totalFavourite}</Text>
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

                <Text fw={500} c={theme.colors.text[1]} style={{ textAlign: "center" }}>{nft.data.totalShare}</Text>
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
                  <svg xmlns="http://www.w3.org/2000/svg" color={theme.colors.primary[5]} width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5.821 4.91c3.898 -2.765 9.469 -2.539 13.073 .536c3.667 3.127 4.168 8.238 1.152 11.897c-2.842 3.447 -7.965 4.583 -12.231 2.805l-.232 -.101l-4.375 .931l-.075 .013l-.11 .009l-.113 -.004l-.044 -.005l-.11 -.02l-.105 -.034l-.1 -.044l-.076 -.042l-.108 -.077l-.081 -.074l-.073 -.083l-.053 -.075l-.065 -.115l-.042 -.106l-.031 -.113l-.013 -.075l-.009 -.11l.004 -.113l.005 -.044l.02 -.11l.022 -.072l1.15 -3.451l-.022 -.036c-2.21 -3.747 -1.209 -8.392 2.411 -11.118l.23 -.168z" fill="currentColor" stroke-width="0"></path>
                  </svg>
                </Box>

                <Text fw={500} c={theme.colors.text[1]} style={{ textAlign: "center" }}>0</Text>
              </Stack>
            </Group>

            <Card mt={20} withBorder shadow="sm" radius={theme.radius.md} p={30}>
              <Card.Section>
                <Group align="flex-start" justify="space-between">
                  <Group align="flex-start">
                    <Avatar w={64} h={64} src={user.data.avatar} />
                    <Stack gap={0}>
                      <Text fw={500} c={theme.colors.text[1]}>{user.data.username}</Text>

                      <Text size="14px" c="dimmed">Tạo vào {user.data.createdAt}</Text>
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
                  {nft.data.description}
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
                    <Link href={renderLinkContract(nft.data.contractAddress, nft.data.chainId)} target="_blank" style={{
                      color: theme.colors.blue[6],
                      textDecoration: 'underline'
                    }}>{StringUtils.compact(nft.data.contractAddress, 8, 5)}</Link>
                  </Group>

                  <Group justify="space-between">
                    <Text fw={500} c={theme.colors.text[1]}>Token ID</Text>
                    <Text c={theme.colors.text[1]}>{nft.data.tokenId}</Text>
                  </Group>

                  <Group justify="space-between">
                    <Text fw={500} c={theme.colors.text[1]}>Token Standard</Text>
                    <Text c={theme.colors.text[1]}>ERC-721</Text>
                  </Group>

                  <Group justify="space-between">
                    <Text fw={500} c={theme.colors.text[1]}>Chain</Text>
                    <Text c={theme.colors.text[1]}>{blockchain.getChain(nft.data.chainId).name}</Text>
                  </Group>

                  <Group justify="space-between">
                    <Text fw={500} c={theme.colors.text[1]}>Ngày đăng bán</Text>
                    <Text c={theme.colors.text[1]}>{nft.data.createdAt}</Text>
                  </Group>

                  <Group justify="space-between">
                    <Text fw={500} c={theme.colors.text[1]}>Cập nhập lần cuối</Text>
                    <Text c={theme.colors.text[1]}>{nft.data.updatedAt}</Text>
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
            }} />
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

              return <>
                {marketOrders.map((v, k) => <>
                  <Group key={k} justify="space-between">
                    <Text fw={500} c={theme.colors.text[1]}>{v.event}</Text>
                    <Text c={theme.colors.text[1]}>{v.price}</Text>
                    <Link href={renderLinkContract(nft.data.contractAddress, nft.data.chainId)} target="_blank" style={{
                      color: theme.colors.blue[6],
                      textDecoration: 'underline'
                    }}>{StringUtils.compact(v.seller, 5, 5)}</Link>
                    <Link href={renderLinkContract(nft.data.contractAddress, nft.data.chainId)} target="_blank" style={{
                      color: theme.colors.blue[6],
                      textDecoration: 'underline'
                    }}>{StringUtils.compact(v.buyer, 5, 5)}</Link>
                    <Text c={theme.colors.text[1]}>{v.createdAt}</Text>
                  </Group>
                  <Divider my={10} />
                </>)}
              </>
            }()}
          </Card.Section>
        </Card>
      </Stack>

      <AppFooter />
    </BoundaryConnectWallet>
  )
}