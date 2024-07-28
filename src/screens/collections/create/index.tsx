import { useEffect, useState, FC } from "react";
import { useForm } from "@mantine/form";
import {
  Box,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { IconEye, IconNotebook, IconPhotoVideo, IconUpload } from "@tabler/icons-react";
import { ethers } from "ethers";

import { AppButton } from "@/components/app/app-button";
import { AppHeader } from "@/components/app/app-header";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { MyCombobox } from "@/components/combobox/my-combobox";
import { MediaInput } from "@/components/input/media-input";
import { onCreateCollection } from "@/components/modals/modal-create-collection";
import { OnErrorModal, onError } from "@/components/modals/modal-error";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { CoinsModule } from "@/modules/coins/modules";
import { CollectionPayload, PackageType } from "@/modules/collection/types";
import { getChainId } from "@/modules/configs/context";
import { RequestModule } from "@/modules/request/request";
import { chains } from "@/share/blockchain/chain";
import { useBlockChain } from "@/share/blockchain/context";
import { AppPayment } from "../../../../types";
import classes from "../../../styles/collections/CollectionCreate.module.scss";

enum CollectionType {
  TOURISM = "Du lịch",
  GAME = "Trò chơi",
  LIFE = "Đời sống",
  EDUCATION = "Giáo dục",
  FAMILY = "Gia đình",
  FILM = "Phim ảnh",
  COOK = "Nấu ăn",
}

export const CreateCollectionScreen: FC = () => {
  const theme = useMantineTheme();
  const account = useAccount();
  const blockchain = useBlockChain();
  const { isMobile } = useResponsive();
  const [bannerFile, setBannerFile] = useState<File | string | null>(null);

  const form = useForm<CollectionPayload>({
    initialValues: {
      chainID: getChainId(),
      creatorCollection: "",
      title: "",
      bannerURL: "",
      description: "",
      category: CollectionType.TOURISM,
      paymentType: AppPayment.ETH,
      package: [
        { type: PackageType.DAYS_30, price: 0 },
        { type: PackageType.DAYS_90, price: 0 },
        { type: PackageType.A_YEAR, price: 0 },
      ],
    },
    validate: {
      title: (value) => (value.length < 1 ? "Tên bộ sưu tập không hợp lệ" : null),
      description: (value) => (value.length < 1 ? "Mô tả không hợp lệ" : null),
    },
  });

  const getPaymentType = async () => {
    const paymentType = await CoinsModule.getPaymentType(getChainId());
    form.setFieldValue("paymentType", paymentType);
  };

  const getWallet = async () => {
    if (account.information?.wallet) {
      form.setFieldValue("creatorCollection", ethers.getAddress(account.information.wallet));
    } else {
      const wallet = (await blockchain.connectWallet("metamask")).wallet;
      form.setFieldValue("creatorCollection", ethers.getAddress(wallet));
    }
  };

  useEffect(() => {
    getPaymentType();
    getWallet();
  }, [blockchain.wallet]);

  const onSubmit = form.onSubmit(async (values) => {
    try {
      if (!bannerFile) {
        OnErrorModal({ title: "Tạo BST", error: "Vui lòng chọn ảnh cho BST" });
        return;
      }

      const payload = { ...values };
      if (bannerFile instanceof File) {
        payload.bannerURL = await RequestModule.uploadMedia("/api/v1/collections/image", bannerFile, 400, "collectionImage");
      }
      onCreateCollection({ payload });
    } catch {
      onError("Tạo Bộ sưu tập không thành công!");
    }
  });

  return (
    <BoundaryConnectWallet>
      <AppHeader />
      <Stack px={isMobile ? 15 : 40} mt={70} mb={100}>
        <form onSubmit={onSubmit}>
          <Grid mt={20} gutter="md">
            <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
              <Stack>
                <MediaInput
                  label="Hình nền"
                  withAsterisk
                  width="100%"
                  height={400}
                  ratio={260 / 150}
                  radius={10}
                  acceptance="image"
                  value={bannerFile || undefined}
                  onChange={setBannerFile}
                  onRemove={() => setBannerFile(null)}
                  styles={{ label: { marginBottom: "6px", fontWeight: "bold" } }}
                />
                <Group mt={20} grow>
                  <TextInput
                    label="Tên bộ sưu tập"
                    placeholder="My Collection"
                    withAsterisk
                    styles={{
                      root: { width: "45%" },
                      input: { height: "45px", borderRadius: "10px", marginTop: "6px" },
                      label: { fontWeight: "bold" },
                    }}
                    {...form.getInputProps("title")}
                  />
                  <MyCombobox
                    initialvalue={CollectionType.TOURISM}
                    options={Object.values(CollectionType)}
                    label="Thể loại"
                    styles={{ dropdown: { maxHeight: "200px", overflowY: "auto" } }}
                    classNames={{ dropdown: "hidden-scroll-bar" }}
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
                    root: { width: "100%", borderRadius: "10px" },
                    input: { marginTop: "6px", borderRadius: "10px" },
                    label: { fontWeight: "bold" },
                  }}
                  {...form.getInputProps("description")}
                />
                <Select
                  label="Blockchain"
                  placeholder="Chọn chain"
                  data={chains.map((v) => ({ label: v.name, value: v.chainId }))}
                  styles={{
                    dropdown: { maxHeight: "200px", overflowY: "auto" },
                    root: { width: "100%" },
                    input: { height: "45px", borderRadius: "10px", marginTop: "6px" },
                    label: { fontWeight: "bold" },
                  }}
                  classNames={{ dropdown: "hidden-scroll-bar" }}
                  {...form.getInputProps("chainID")}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5, lg: 5 }}>
              <Stack
                mt={isMobile ? 0 : 30}
                px={30}
                py={30}
                justify="center"
                bg={theme.colors.gray[1]}
                style={{ borderRadius: "10px" }}
              >
                <Title order={4} fw={500} c={theme.colors.text[1]}>
                  Sau khi tạo Bộ sưu tập thành công:
                </Title>
                {[
                  { icon: <IconNotebook />, title: "Quản lý bộ sưu tập", description: "Chỉnh sửa thông tin bộ sưu tập" },
                  {
                    icon: <IconPhotoVideo />,
                    title: "Quản lý Video dễ dàng",
                    description: "Xem thông tin các Video của bạn, truy cập nhanh chóng",
                  },
                  {
                    icon: <IconEye />,
                    title: "Chế độ",
                    description:
                      "Mọi người có thể xem được các video trong BST của bạn nếu chế độ là công khai. " +
                      "Các video nằm trong BST có chế độ thương mại sẽ được bảo vệ khỏi quyền truy cập bất hợp pháp và mọi người chỉ được xem sau khi đã thanh toán",
                  },
                ].map(({ icon, title, description }) => (
                  <Group key={title}>
                    <ThemeIcon flex={1} variant="transparent" color={theme.colors.gray[8]}>
                      {icon}
                    </ThemeIcon>
                    <Stack flex={11} gap={2}>
                      <Text fw={500} c={theme.colors.gray[8]}>
                        {title}
                      </Text>
                      <Text c={theme.colors.gray[7]}>{description}</Text>
                    </Stack>
                  </Group>
                ))}
              </Stack>
            </Grid.Col>
          </Grid>
          <Box my={20}>
            <Transition
              mounted={true}
              transition='slide-up'
              duration={300}
              timingFunction="ease"
              keepMounted
            >
              {(transitionStyle) => (
                <Card p={20}
                  style={{
                    position: 'fixed',
                    zIndex: 10,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    boxShadow: '0px -4px 6px rgba(0, 0, 0, 0.1), 2px 0px 4px rgba(0, 0, 0, 0.1)',
                    ...transitionStyle
                  }}
                >
                  <Group justify="flex-end">
                    <AppButton
                      type="submit"
                      async
                      width={160}
                      height={50}
                      radius={8}
                      color={theme.colors.primary[5]}
                      leftSection={<IconUpload />}
                    >
                      Tạo ngay
                    </AppButton>
                  </Group>
                </Card>
              )}
            </Transition>
          </Box>
        </form>
      </Stack>
    </BoundaryConnectWallet>
  );
};