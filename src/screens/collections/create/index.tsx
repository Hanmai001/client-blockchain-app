import { AppButton } from "@/components/app/app-button";
import { Account } from "@/components/app/app-header";
import { MediaInput } from "@/components/input/media-input";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { CoinsModule } from "@/modules/coins/modules";
import { CollectionPayload } from "@/modules/collection/types";
import { getChainId, getContracts } from "@/modules/configs/context";
import { MyCombobox } from "@/screens/marketplace";
import { chains } from "@/share/blockchain/chain";
import { useBlockChain } from "@/share/blockchain/context";
import { Grid, Group, Select, Stack, Text, TextInput, Textarea, Title, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconNotebook, IconPhotoVideo, IconUsersGroup } from "@tabler/icons-react";
import { ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import { AppPayment } from "../../../../types";
import classes from '../../../styles/CollectionCreate.module.scss';

export const CollectionCreateScreen: FC = () => {
  const theme = useMantineTheme();
  const account = useAccount();
  const blockchain = useBlockChain();
  const { isMobile } = useResponsive();
  const [paymentType, setPaymentType] = useState<AppPayment | ''>('');

  enum CollectionType {
    TOURISM = 'Du lịch',
    GAME = 'Trò chơi',
    LIFE = 'Đời sống',
    EDUCATION = 'Giáo dục',
    FAMILY = 'Gia đình',
    FILM = 'Phim ảnh',
    COOK = 'Nấu ăn'
  }

  const form = useForm<CollectionPayload>({
    initialValues: {
      chainId: getChainId(),
      creator: '',
      title: '',
      description: '',
      bannerFile: null,
      contractAddress: getContracts().erc721s.BLOCKCLIP_NFT.address,
      type: CollectionType.TOURISM,
      paymentType: ''
    },
    validate: {
      title: (value) => (value.length < 1 && 'Tên bộ sưu tập không hợp lệ'),
      description: (value) => (value.length < 1 && 'Mô tả không hợp lệ'),
    },
  })

  const getPaymenType = async () => {
    const paymentType = await CoinsModule.getPaymentType(getChainId());
    form.setFieldValue('paymentType', paymentType)
  }

  const getWallet = async () => {
    if (!!account.information && account.information.wallet)
      form.setFieldValue('creator', ethers.getAddress(account.information.wallet));
    else {
      const wallet = (await blockchain.connectWallet("metamask")).wallet;
      form.setFieldValue('creator', ethers.getAddress(wallet));
    }
  }
  useEffect(() => {
    getPaymenType();
    getWallet();
  }, [blockchain.wallet])

  const onSubmit = form.onSubmit(async (values) => {
    try {
      let payload = { ...values }
      console.log("payload: ", payload)
    } catch (error) {

    }
  })

  return (
    <Stack px={40} mt={20}>
      <form onSubmit={onSubmit}>
        <Group justify="space-between">
          <Group>
            <AppButton radius="50%" color={theme.colors.gray[3]} height={48}>
              <IconArrowLeft color={theme.colors.dark[5]} size={18} />
            </AppButton>

            <Title c={theme.colors.text[1]} order={4}>Trang chủ</Title>

            {/* <Image src='/images/logo.png' w={128} /> */}
          </Group>

          <Account />
        </Group>

        <Grid mt={20} gutter={80}>
          <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
            <Stack>
              <MediaInput
                label="Hình nền"
                withAsterisk
                width={"100%"}
                h={300}
                radius={10}
                onChange={(file) => form.setFieldValue('bannerFile', file)}
                onRemove={() => form.setFieldValue('bannerFile', null)}
              />

              <Group mt={20} justify="space-between">
                <TextInput
                  label="Tên bộ sưu tập"
                  placeholder="My Collection"
                  withAsterisk
                  styles={{
                    root: {
                      width: '45%',
                    },
                    input: {
                      height: '45px',
                      borderRadius: '10px',
                      marginTop: "6px"
                    },
                  }}
                  {...form.getInputProps('title')}
                />

                <MyCombobox
                  initialValue={CollectionType.TOURISM}
                  options={CollectionType}
                  label="Thể loại"
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
                  classNamesInput={classes.comboboxInput}
                  classNamesRoot={classes.comboboxRootInput}
                  onChange={(value: CollectionType) => form.setFieldValue("type", value)}
                />

                <Textarea
                  label="Mô tả"
                  withAsterisk
                  placeholder="Mô tả bộ sưu tập"
                  autosize
                  minRows={3}
                  styles={{
                    root: {
                      width: '100%',
                      borderRadius: '10px'
                    },
                    input: {
                      marginTop: '6px'
                    }
                  }}
                  {...form.getInputProps('description')}
                />

                <Select
                  label="Blockchain"
                  placeholder="Chọn chain"
                  data={chains!.map((v) => ({ label: v.name, value: v.chainId }))}
                  styles={{
                    dropdown: {
                      maxHeight: '200px',
                      overflow: 'hidden',
                      overflowY: 'auto',
                    },
                    option: {

                    },
                    root: {
                      width: '100%'
                    },
                    input: {
                      height: '45px',
                      borderRadius: '10px',
                      marginTop: '6px'
                    }
                  }}
                  classNames={{
                    dropdown: 'hidden-scroll-bar'
                  }}
                  {...form.getInputProps('chainId')}
                />
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5, lg: 5 }}>
            <Stack mt={isMobile ? 0 : 30} px={30} py={30} justify="center" bg={theme.colors.gray[1]}
              style={{
                borderRadius: '10px'
              }}
            >
              <Title order={4} c={theme.colors.text[1]}>Sau khi tạo Bộ sưu tập thành công:</Title>
              <Group>
                <IconNotebook color={theme.colors.gray[8]} />
                <Stack gap={2}>
                  <Text fw="bold" c={theme.colors.gray[8]}>Quản lý bộ sưu tập</Text>
                  <Text c={theme.colors.gray[7]}>Chỉnh sửa thông tin bộ sưu tập, xem tiền kiếm được,...</Text>
                </Stack>
              </Group>

              <Group>
                <IconPhotoVideo color={theme.colors.gray[8]} />
                <Stack gap={2}>
                  <Text fw="bold" c={theme.colors.gray[8]}>Quản lý Video dễ dàng</Text>
                  <Text c={theme.colors.gray[7]}>Xem thông tin các Video của bạn, truy cập nhanh chóng</Text>
                </Stack>
              </Group>

              <Group>
                <IconUsersGroup color={theme.colors.gray[8]} />
                <Stack gap={2}>
                  <Text fw="bold" c={theme.colors.gray[8]}>Cộng đồng</Text>
                  <Text c={theme.colors.gray[7]}>Mọi người có thể xem bộ sưu tập của bạn</Text>
                </Stack>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        <Group my={30} justify="flex-end">
          <AppButton type='submit' width={150} height={54} radius={10} color={theme.colors.primary[5]}>
            Tạo ngay
          </AppButton>
        </Group>
      </form>
    </Stack>
  )
}