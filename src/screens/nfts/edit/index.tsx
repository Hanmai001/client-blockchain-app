import { AppButton } from "@/components/app/app-button";
import { Account } from "@/components/app/app-header";
import { AppLoading } from "@/components/app/app-loading";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { EmptyMessage } from "@/components/empty-message";
import { ErrorMessage } from "@/components/error-message";
import { MediaInput } from "@/components/input/media-input";
import { SelectInputItem } from "@/components/input/select-input-item";
import { onError } from "@/components/modals/modal-error";
import { onSuccess } from "@/components/modals/modal-success";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection } from "@/modules/collection/types";
import { getContracts } from "@/modules/configs/context";
import { Nft, NftUpdatePayload } from "@/modules/nft/types";
import { RequestModule } from "@/modules/request/request";
import { useBlockChain } from "@/share/blockchain/context";
import { Box, Card, Flex, Grid, Group, Image, Skeleton, Stack, Text, TextInput, Textarea, Title, Transition, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { AppRoutes } from "../../../../app-router";
import { DataLoadState, ListLoadState } from "../../../../types";
import classes from '../../../styles/nfts/NftCreate.module.scss';
import { NftModule } from "@/modules/nft/modules";

export const NftEditScreen: FC<{token: Nft}> = ({token}) => {
  const theme = useMantineTheme();
  const { isMobile, isDesktop } = useResponsive();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<NftUpdatePayload>({
    initialValues: {
      title: token.title,
      description: token.description,
      collectionID: token.collectionID,
      chainID: token.chainID,
      contractAddress: token.contractAddress,
      tokenID: token.tokenID,
      source: token.source,
      active: token.active
    },
    validate: {
      title: (value) => (value.length < 1 && 'Tên bộ sưu tập không hợp lệ'),
      description: (value) => (value.length < 1 && 'Mô tả không hợp lệ'),
    },
  })

  const onSubmit = form.onSubmit(async (values) => {
    try {
      let payload = { ...values }
      setIsUploading(true);

      if (file instanceof File)
        payload.source = await RequestModule.uploadMedia(`/api/v1/tokens/source`, file as File, 400, "source");
      
      await NftModule.updateToken(payload);
      
      onSuccess({ title: 'Cập nhật thành công', message: '' });
    } catch (error) {
      onError(error);
    } finally {
      setIsUploading(false);
    }
  })

  return (
    <BoundaryConnectWallet>
      {isUploading && <AppLoading visible={isUploading} />}
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
                value={token.source}
                withAsterisk
                width={"95%"}
                height={500}
                radius={10}
                acceptance="video"
                onChange={(file) => setFile(file)}
                onRemove={() => setFile(null)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Stack pos="relative" my={isMobile ? 0 : 30} justify="center"
                style={{
                  borderRadius: '10px'
                }}
              >
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
              Cập nhật
            </AppButton>
          </Group>
        </form>
      </Stack>
    </BoundaryConnectWallet>
  )
}