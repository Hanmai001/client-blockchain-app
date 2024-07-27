import { AppButton } from "@/components/app/app-button";
import { AppHeader } from "@/components/app/app-header";
import { AppLoading } from "@/components/app/app-loading";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { MediaInput } from "@/components/input/media-input";
import { onError } from "@/components/modals/modal-error";
import { onSuccess } from "@/components/modals/modal-success";
import { useResponsive } from "@/modules/app/hooks";
import { NftModule } from "@/modules/nft/modules";
import { Nft, NftUpdatePayload } from "@/modules/nft/types";
import { RequestModule } from "@/modules/request/request";
import { AspectRatio, Center, Grid, Group, Image, Stack, Switch, TextInput, Textarea, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEyeClosed, IconEyeFilled } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { ItemMode } from "../../../../types";
import { LicenseModule } from "@/modules/license/modules";
import { useAccount } from "@/modules/account/context";

export const NftEditScreen: FC<{ token: Nft }> = ({ token }) => {
  const theme = useMantineTheme();
  const { isMobile, isDesktop } = useResponsive();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | string | null>(null);
  const [checked, setChecked] = useState(token?.active);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const account = useAccount();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [oldMetadata, setOldMetadata] = useState({
    title: token?.title,
    source: token?.source,
    description: token?.description,
  })


  const form = useForm<NftUpdatePayload>({
    initialValues: {
      title: token?.title,
      description: token?.description,
      collectionID: token?.collectionID,
      chainID: token?.chainID,
      contractAddress: token?.contractAddress,
      tokenID: token?.tokenID,
      source: token?.source,
      active: token?.active
    },
    validate: {
      title: (value) => (value.length < 1 && 'Tên bộ sưu tập không hợp lệ'),
      description: (value) => (value.length < 1 && 'Mô tả không hợp lệ'),
    },
  })

  const isMetadataChanged = () => {
    return (
      form.getInputProps('source').value !== oldMetadata?.source ||
      form.getInputProps('description').value !== oldMetadata?.description ||
      form.getInputProps('title').value !== oldMetadata?.title
    );
  };

  const onSubmit = form.onSubmit(async (values) => {
    try {
      let payload = { ...values, active: checked }
      setIsUploading(true);

      if (file instanceof File) {
        payload.source = await RequestModule.uploadMedia(`/api/v1/tokens/source`, file as File, 400, "source");
        form.setFieldValue('source', payload?.source);
      }

      const checkMetadataChanged = isMetadataChanged();

      const res = await NftModule.updateToken(payload, checkMetadataChanged);
      token = res;

      onSuccess({ title: 'Cập nhật thành công', message: '' });
    } catch (error) {
      onError("Cập nhật thất bại");
    } finally {
      setIsUploading(false);
    }
  });

  const decryptVideo = async () => {
    try {
      if (token.mode.toString() === ItemMode.COMMERCIAL) {
        const license = await LicenseModule.getLicense({ tokenID: token?.tokenID });
        if (license) {
          const videoData = await LicenseModule.decrypt(license, token?.source);
          if (videoData) {
            const blob = new Blob([videoData], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);

            return () => URL.revokeObjectURL(url);
          }
        }
      }
    } catch (error) {

    }
  }

  const handlePlayButtonClick = () => {
    setIsVideoPlaying(true);
  };

  const handleContextMenu = (event: any) => {
    event.preventDefault();
  };

  useEffect(() => {
    setOldMetadata({
      title: token?.title,
      source: token?.source,
      description: token?.description,
    })
    setFile(token.source)
  }, [token])

  useEffect(() => {
    decryptVideo();
  }, [account.information])

  return (
    <BoundaryConnectWallet>
      <AppHeader />

      {isUploading && <AppLoading visible={isUploading} />}

      <Stack px={40} mt={70}>
        <form onSubmit={onSubmit}>
          <Grid mt={20} gutter={isDesktop ? 40 : 0}>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <AspectRatio
                ratio={100 / 140}
                p={10}
                style={{
                  overflow: 'hidden',
                  borderRadius: theme.radius.md,
                  position: 'relative',
                }}
              >
                {isVideoPlaying ? (
                  <video
                    controls
                    controlsList="nodownload"
                    src={videoUrl || token.source}
                    onContextMenu={handleContextMenu}
                    style={{ display: 'block', objectFit: 'contain' }}
                  />
                ) : (
                  <div
                    className="nft-card"
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: `rgba(0, 0, 0, 0.8)`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundImage: `url("${token?.avatar}")`
                    }}
                    onClick={handlePlayButtonClick}
                  >
                    <Center>
                      <Image className="nft-card-image" src="/images/icons/play-video.png" w={64} h={64} />
                    </Center>
                  </div>
                )}
              </AspectRatio>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
              <Stack pos="relative" my={isMobile ? 20 : 30} justify="center"
                style={{
                  borderRadius: '10px'
                }}
              >
                <Switch
                  checked={checked}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                  onLabel={<IconEyeFilled size={18} />}
                  offLabel={<IconEyeClosed size={18} />}
                  size="lg"
                  label={checked ? "Ẩn" : "Hiện"}
                  color={theme.colors.primary[5]}
                  styles={{
                    label: {
                      fontSize: '14px',
                      fontWeight: 500
                    },
                    root: {
                      display: "inline-flex"
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