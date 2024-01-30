import { AppButton } from "@/components/app/app-button";
import { Account } from "@/components/app/app-header";
import { AppLoading } from "@/components/app/app-loading";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { MediaInput } from "@/components/input/media-input";
import { onError } from "@/components/modals/modal-error";
import { onSuccess } from "@/components/modals/modal-success";
import { useResponsive } from "@/modules/app/hooks";
import { NftModule } from "@/modules/nft/modules";
import { Nft, NftUpdatePayload } from "@/modules/nft/types";
import { RequestModule } from "@/modules/request/request";
import { Grid, Group, Stack, Switch, TextInput, Textarea, Title, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconEyeClosed, IconEyeFilled } from "@tabler/icons-react";
import { FC, useState } from "react";

export const NftEditScreen: FC<{ token: Nft }> = ({ token }) => {
  const theme = useMantineTheme();
  const { isMobile, isDesktop } = useResponsive();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [checked, setChecked] = useState(token.active);

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
      let payload = { ...values, active: checked }
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
                <Switch 
                  checked={checked}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                  onLabel={<IconEyeFilled size={20} />}
                  offLabel={<IconEyeClosed size={20}/>}
                  size="lg"
                  label="Ẩn/Hiện video để người khác có thể xem video của bạn"
                  color={theme.colors.primary[5]}
                  styles={{
                    label: {
                      fontSize: '14px',
                      fontWeight: 500
                    }
                  }}
                />

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