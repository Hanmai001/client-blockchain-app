import { AppButton } from "@/components/app/app-button";
import { Account } from "@/components/app/app-header";
import { AppLoading } from "@/components/app/app-loading";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { MediaInput } from "@/components/input/media-input";
import { onError } from "@/components/modals/modal-error";
import { onSuccess } from "@/components/modals/modal-success";
import { useResponsive } from "@/modules/app/hooks";
import { Collection, CollectionUpdatePayload } from "@/modules/collection/types";
import { RequestModule } from "@/modules/request/request";
import { chains } from "@/share/blockchain/chain";
import { Group, Select, Stack, Switch, TextInput, Textarea, Title, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconEyeClosed, IconEyeFilled } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { CollectionModule } from "@/modules/collection/modules";
import classes from '../../../styles/components/combobox.module.scss';
import { MyCombobox } from "@/components/combobox/my-combobox";

export const CollectionEditScreen: FC<{ collection: Collection }> = ({ collection }) => {
  const theme = useMantineTheme();
  const { isMobile } = useResponsive();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [checked, setChecked] = useState(collection.active);
  const [oldMetadata, setOldMetadata] = useState({
    title: collection.title,
    bannerURL: collection.bannerURL,
    description: collection.description,
    category: collection.category,
  })

  enum CollectionType {
    TOURISM = 'Du lịch',
    GAME = 'Trò chơi',
    LIFE = 'Đời sống',
    EDUCATION = 'Giáo dục',
    FAMILY = 'Gia đình',
    FILM = 'Phim ảnh',
    COOK = 'Nấu ăn'
  }

  const form = useForm<CollectionUpdatePayload>({
    initialValues: {
      collectionID: collection.collectionID,
      chainID: collection.chainID,
      title: collection.title,
      bannerURL: collection.bannerURL,
      description: collection.description,
      contractAddress: collection.contractAddress,
      category: collection.category,
      active: collection.active,
    },
    validate: {
      title: (value) => (value.length < 1 && 'Tên bộ sưu tập không hợp lệ'),
      description: (value) => (value.length < 1 && 'Mô tả không hợp lệ'),
    },
  })

  const isMetadataChanged = () => {
    return (
      form.getInputProps('bannerURL').value !== oldMetadata.bannerURL ||
      form.getInputProps('description').value !== oldMetadata.description ||
      form.getInputProps('category').value !== oldMetadata.category ||
      form.getInputProps('title').value !== oldMetadata.title
    );
  };

  const onSubmit = form.onSubmit(async (values) => {
    try {
      setIsUploading(true);

      let payload = { ...values, active: checked };

      if (bannerFile instanceof File) {
        payload.bannerURL = await RequestModule.uploadMedia(`/api/v1/collections/image`, bannerFile as File, 400, "collectionImage");
        form.setFieldValue('bannerURL', payload.bannerURL);
      }

      const checkMetadataChanged = isMetadataChanged();
      const res = await CollectionModule.updateCollection(payload, checkMetadataChanged);
      collection = res;

      onSuccess({ title: 'Cập nhật thành công', message: '' });
    } catch (error) {
      onError("Cập nhật thất bại");
    } finally {
      setIsUploading(false);
    }
  })

  useEffect(() => {
    setOldMetadata({
      title: collection.title,
      bannerURL: collection.bannerURL,
      description: collection.description,
      category: collection.category,
    })
  }, [collection])

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

          <Group mt={20} maw={800} style={{
            margin: 'auto'
          }}>
            <Stack>
              <Switch
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
                onLabel={<IconEyeFilled size={20} />}
                offLabel={<IconEyeClosed size={20} />}
                size="lg"
                label="Ẩn/Hiện bộ sưu tập"
                color={theme.colors.primary[5]}
                styles={{
                  label: {
                    fontSize: '14px',
                    fontWeight: 500
                  }
                }}
              />

              <MediaInput
                label="Hình nền"
                value={collection.bannerURL}
                withAsterisk
                width={"100%"}
                height={300}
                radius={10}
                acceptance="image"
                onChange={(file) => setBannerFile(file)}
                onRemove={() => setBannerFile(null)}
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
                  disabled
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
              </Group>

              <Group my={30} justify="flex-end">
                <AppButton async loading={isUploading} type='submit' width={150} height={54} radius={10} color={theme.colors.primary[5]}>
                  Cập nhật
                </AppButton>
              </Group>
            </Stack>
          </Group>
        </form>
      </Stack>
    </BoundaryConnectWallet>
  )
}