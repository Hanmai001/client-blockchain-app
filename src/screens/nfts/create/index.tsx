import { AppButton } from "@/components/app/app-button";
import { Account } from "@/components/app/app-header";
import { ErrorMessage } from "@/components/error-message";
import { MediaInput } from "@/components/input/media-input";
import { SelectInputItem } from "@/components/input/select-input-item";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { NftPayload } from "@/modules/nft/types";
import { useBlockChain } from "@/share/blockchain/context";
import { Box, Card, Flex, Grid, Group, Image, Skeleton, Stack, Text, TextInput, Textarea, Title, Transition, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { AppRoutes } from "../../../../app-router";
import { ListLoadState } from "../../../../types";
import classes from '../../../styles/nfts/NftCreate.module.scss';
import { ethers } from "ethers";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";

const listcollections = [
  {
    _id: 'afdsf',
    tokenId: '2',
    chainId: '97',
    creator: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    averagePrice: 0.56,
    paymentType: "0",
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '1',
    chainId: '97',
    creator: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    paymentType: "0",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
  {
    _id: 'afdsf',
    tokenId: '3',
    chainId: '97',
    creator: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
    bannerUrl: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-57.jpg',
    title: "Hình nền đẹp",
    totalViews: 12345,
    totalItems: 12,
    paymentType: "0",
    averagePrice: 0.56,
    description: "Chủ đề Hình nền xinh xắn Hình nền xinh xắn là một sự lựa chọn tuyệt vời để trang trí màn hình điện thoại của bạn. Với những hình ảnh đẹp và dễ thương."
  },
]
const scaleY = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
};

export const CreateNftScreen: FC = () => {
  const theme = useMantineTheme();
  const account = useAccount();
  const blockchain = useBlockChain();
  const { isMobile, isDesktop } = useResponsive();
  const params = useParams<{ wallet: string }>();
  const [collections, setCollections] = useState<ListLoadState<any, 'collections'>>({ isFetching: false, data: { collections: listcollections, count: listcollections.length } });
  const [collection, setCollection] = useState(listcollections[0]);
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const fetchCollections = async () => {
    try {

    } catch (error) {

    }
  }

  const form = useForm<NftPayload>({
    initialValues: {
      creator: '',
      owner: '',
      title: '',
      description: '',
      sourceFile: null,
      collection: null
    },
    validate: {
      title: (value) => (value.length < 1 && 'Tên bộ sưu tập không hợp lệ'),
      description: (value) => (value.length < 1 && 'Mô tả không hợp lệ'),
    },
  })

  const getWallet = async () => {
    if (!!account.information && account.information.wallet) {
      form.setFieldValue('creator', ethers.getAddress(account.information.wallet));
      form.setFieldValue('owner', ethers.getAddress(account.information.wallet));
    }

    else {
      const wallet = (await blockchain.connectWallet("metamask")).wallet;
      form.setFieldValue('creator', ethers.getAddress(wallet));
      form.setFieldValue('owner', ethers.getAddress(wallet));
    }
  }

  const onSubmit = form.onSubmit(async (values) => {
    try {
      let payload = { ...values }
      payload.collection = {
        chainId: collection.chainId,
        tokenId: collection.tokenId,
        paymentType: collection.paymentType
      }
      console.log("payload: ", payload)
    } catch (error) {

    }
  })

  useEffect(() => {
    fetchCollections();
    getWallet();
  }, [])

  return (
    <BoundaryConnectWallet>
      <Stack px={40} mt={20}>
        <form onSubmit={onSubmit}>
          <Group justify="space-between">
            <Group>
              <AppButton async radius="50%" color={theme.colors.gray[3]} height={48}>
                <IconArrowLeft color={theme.colors.dark[5]} size={18} />
              </AppButton>

              <Title c={theme.colors.text[1]} order={4}>Trang chủ</Title>

              {/* <Image src='/images/logo.png' w={128} /> */}
            </Group>

            <Account />
          </Group>

          <Grid mt={20} gutter={isDesktop ? 40 : 0}>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <MediaInput
                label="Video"
                withAsterisk
                width={"95%"}
                height={500}
                radius={10}
                acceptance="video"
                onChange={(file) => form.setFieldValue('sourceFile', file)}
                onRemove={() => form.setFieldValue('sourceFile', null)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Stack pos="relative" my={isMobile ? 0 : 30} justify="center"
                style={{
                  borderRadius: '10px'
                }}
              >
                <Stack gap={14}>
                  <Text mt={isMobile ? 40 : 0} style={{ display: 'block', fontWeight: 500, fontSize: '15px', lineHeight: '12px' }}>
                    Chọn bộ sưu tập
                    <span style={{ color: 'red' }}>*</span>
                  </Text>
                  <Box onClick={() => setOpened(!opened)}>
                    {function () {
                      if (collections.isFetching) return <Skeleton />

                      if (collections.error) return <Group><ErrorMessage error={collections.error} /></Group>

                      if (!collection) return <Group gap="lg" bg={theme.colors.gray[1]} p={15} style={{
                        flexWrap: "nowrap",
                        borderRadius: '10px',
                        height: '90px',
                        cursor: "pointer"
                      }}
                        onClick={() => router.push(AppRoutes.collection.create)}
                      >
                        <Flex justify="center" align="center" style={{
                          borderRadius: '10px',
                          backgroundColor: theme.colors.gray[2],
                          width: '60px',
                          height: '60px'
                        }}><IconPlus /></Flex>
                        <Text fw="bold">Tạo bộ sưu tập mới</Text>
                      </Group>
                      return <SelectInputItem width="48" height="64" fontsize="15px" image={collection.bannerUrl} label={collection.title} />
                    }()}
                  </Box>
                </Stack>

                <Transition mounted={opened}
                  transition={scaleY}
                  duration={200}
                  timingFunction="ease"
                  keepMounted
                >
                  {(styles) => <Card w={'100%'} shadow="sm" radius={10} bg={theme.white} pos="absolute"
                    style={{
                      margin: "auto",
                      zIndex: 1,
                      top: isMobile ? '162px' : '120px',
                      ...styles
                    }}
                  >
                    {collections.data?.collections.map((v, k) => <Box
                      bg={v.tokenId === collection.tokenId ? theme.colors.primary[5] : theme.white}
                      className={v.tokenId === collection.tokenId ? classes.itemActive : classes.item}
                      style={{
                        borderRadius: '12px',
                        padding: '12px 12px',
                      }}
                      key={k}
                      onClick={() => setCollection(v)}
                    >
                      <Group>
                        <Image width="48" height="64" radius={12} src={v.bannerUrl} />
                        <Text c={v.tokenId === collection.tokenId ? theme.colors.text[0] : theme.colors.text[1]}>{v.title}</Text>
                      </Group>
                    </Box>)}
                  </Card>}
                </Transition>

                <TextInput
                  label="Tiêu đề"
                  placeholder="My title"
                  withAsterisk
                  styles={{
                    root: {
                      width: '100%',
                    },
                    input: {
                      height: '45px',
                      borderRadius: '10px',
                      marginTop: "6px"
                    },
                  }}
                  {...form.getInputProps('title')}
                />

                <Textarea
                  label="Mô tả"
                  withAsterisk
                  placeholder="Mô tả video"
                  autosize
                  minRows={6}
                  styles={{
                    root: {
                      width: '100%',
                      borderRadius: '10px'
                    },
                    input: {
                      marginTop: '6px',
                      borderRadius: '10px'
                    }
                  }}
                  {...form.getInputProps('description')}
                />
              </Stack>
            </Grid.Col>
          </Grid>

          <Group my={30} justify="flex-end">
            <AppButton async type='submit' width={150} height={54} radius={10} color={theme.colors.primary[5]}>
              Tạo ngay
            </AppButton>
          </Group>
        </form>
      </Stack>
    </BoundaryConnectWallet>
  )
}