import { AppButton } from "@/components/app/app-button";
import { AppHeader } from "@/components/app/app-header";
import { AppLoading } from "@/components/app/app-loading";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { MyCombobox } from "@/components/combobox/my-combobox";
import { MediaInput } from "@/components/input/media-input";
import { onError } from "@/components/modals/modal-error";
import { onSuccess } from "@/components/modals/modal-success";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { CoinsModule } from "@/modules/coins/modules";
import { CollectionModule } from "@/modules/collection/modules";
import { CollectionPayload, PackageType } from "@/modules/collection/types";
import { getChainId } from "@/modules/configs/context";
import { RequestModule } from "@/modules/request/request";
import { chains } from "@/share/blockchain/chain";
import { useBlockChain } from "@/share/blockchain/context";
import { Grid, Group, Select, Stack, Text, TextInput, Textarea, ThemeIcon, Title, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEye, IconNotebook, IconPhotoVideo } from "@tabler/icons-react";
import { ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import { AppPayment } from "../../../../types";
import classes from '../../../styles/collections/CollectionCreate.module.scss';

export const CollectionCreateScreen: FC = () => {
  const theme = useMantineTheme();
  const account = useAccount();
  const blockchain = useBlockChain();
  const { isMobile } = useResponsive();
  const [paymentType, setPaymentType] = useState<AppPayment | ''>('');
  const [bannerFile, setBannerFile] = useState<File | string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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
      chainID: getChainId(),
      creatorCollection: '',
      title: '',
      bannerURL: '',
      description: '',
      category: CollectionType.TOURISM,
      paymentType: AppPayment.ETH,
      package: [
        {
          type: PackageType.DAYS_30,
          price: 0
        },
        {
          type: PackageType.DAYS_90,
          price: 0
        },
        {
          type: PackageType.A_YEAR,
          price: 0
        }
      ]
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
      form.setFieldValue('creatorCollection', ethers.getAddress(account.information.wallet));
    else {
      const wallet = (await blockchain.connectWallet("metamask")).wallet;
      form.setFieldValue('creatorCollection', ethers.getAddress(wallet));
    }
  }
  useEffect(() => {
    getPaymenType();
    getWallet();
  }, [blockchain.wallet])

  const onSubmit = form.onSubmit(async (values) => {
    try {
      setIsUploading(true);
      let payload = { ...values };

      if (bannerFile instanceof File)
        payload.bannerURL = await RequestModule.uploadMedia(`/api/v1/collections/image`, bannerFile as File, 400, "collectionImage");

      await CollectionModule.mintCollection(payload);
      onSuccess({ title: 'Tạo thành công', message: '' });
    } catch (error) {
      onError("Tạo Bộ sưu tập không thành công!");
    } finally {
      setIsUploading(false);
    }
  })

  return (
    <BoundaryConnectWallet>
      <AppHeader />

      {isUploading && <AppLoading visible={isUploading} />}
      <Stack px={isMobile ? 15 : 40} mt={70}>
        <form onSubmit={onSubmit}>
          <Grid mt={20} gutter='md'>
            <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
              <Stack>
                <MediaInput
                  label="Hình nền"
                  withAsterisk
                  width={"100%"}
                  height={400}
                  ratio={260 / 150}
                  radius={10}
                  acceptance="image"
                  value={bannerFile || undefined}
                  onChange={(file) => setBannerFile(file)}
                  onRemove={() => setBannerFile(null)}
                  styles={{
                    label: {
                      marginBottom: "6px"
                    }
                  }}
                />

                <Group mt={20} grow>
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
                    initialvalue={CollectionType.TOURISM}
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
                    classnamesinput={classes.comboboxInput}
                    classnamesroot={classes.comboboxRootInput}
                    onChange={(value: CollectionType) => form.setFieldValue("category", value)}
                  />
                </Group>
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
                      marginTop: '6px',
                      borderRadius: '10px'
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
                  {...form.getInputProps('chainID')}
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5, lg: 5 }}>
              <Stack mt={isMobile ? 0 : 30} px={30} py={30} justify="center" bg={theme.colors.gray[1]}
                style={{
                  borderRadius: '10px'
                }}
              >
                <Title order={4} fw={500} c={theme.colors.text[1]}>Sau khi tạo Bộ sưu tập thành công:</Title>
                <Group>
                  <ThemeIcon flex={1} variant="transparent" color={theme.colors.gray[8]}>
                    <IconNotebook />
                  </ThemeIcon>
                  <Stack flex={11} gap={2}>
                    <Text fw={500} c={theme.colors.gray[8]}>Quản lý bộ sưu tập</Text>
                    <Text c={theme.colors.gray[7]}>Chỉnh sửa thông tin bộ sưu tập</Text>
                  </Stack>
                </Group>

                <Group>
                  <ThemeIcon flex={1} variant="transparent" color={theme.colors.gray[8]}>
                    <IconPhotoVideo />
                  </ThemeIcon>
                  <Stack flex={11} gap={2}>
                    <Text fw={500} c={theme.colors.gray[8]}>Quản lý Video dễ dàng</Text>
                    <Text c={theme.colors.gray[7]}>Xem thông tin các Video của bạn, truy cập nhanh chóng</Text>
                  </Stack>
                </Group>

                <Group>
                  <ThemeIcon flex={1} variant="transparent" color={theme.colors.gray[8]}>
                    <IconEye />
                  </ThemeIcon>
                  <Stack flex={11} gap={2}>
                    <Text fw={500} c={theme.colors.gray[8]}>Chế độ</Text>
                    <Text c={theme.colors.gray[7]}>Mọi người có thể xem được các video trong BST của bạn nếu chế độ là "công khai"</Text>
                    <Text c={theme.colors.gray[7]}>Các video nằm trong BST "thương mại" sẽ được bảo vệ khỏi quyền truy cập bất hợp pháp và mọi người chỉ được xem sau khi đã thanh toán</Text>
                  </Stack>
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>

          <Group my={30} justify="flex-end">
            <AppButton async loading={isUploading} type='submit' width={150} height={54} radius={10} color={theme.colors.primary[5]}>
              Tạo ngay
            </AppButton>
          </Group>
        </form>
      </Stack>
    </BoundaryConnectWallet>
  )
}