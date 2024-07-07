import { AppButton } from "@/components/app/app-button";
import { AppHeader } from "@/components/app/app-header";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { EmptyMessage } from "@/components/empty-message";
import { ErrorMessage } from "@/components/error-message";
import { MediaInput } from "@/components/input/media-input";
import { SelectInputItem } from "@/components/input/select-input-item";
import { onCreateNft } from "@/components/modals/modal-create-nft";
import { OnErrorModal, onError } from "@/components/modals/modal-error";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection } from "@/modules/collection/types";
import { NftPayload } from "@/modules/nft/types";
import { useBlockChain } from "@/share/blockchain/context";
import { AspectRatio, Box, Card, Checkbox, CheckboxGroup, Flex, Grid, Group, Image, Skeleton, Stack, Text, TextInput, Textarea, Transition, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconUpload } from "@tabler/icons-react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { AppRoutes } from "../../../../app-router";
import { DataLoadState, ItemMode, ListLoadState } from "../../../../types";
import classes from '../../../styles/nfts/NftCreate.module.scss';

export const CreateNftScreen: FC = () => {
  const theme = useMantineTheme();
  const account = useAccount();
  const blockchain = useBlockChain();
  const { isMobile, isDesktop } = useResponsive();
  const [collections, setCollections] = useState<ListLoadState<any, 'collections'>>({ isFetching: true, data: { collections: [], count: 0 } });
  const [collection, setCollection] = useState<DataLoadState<Collection>>({ isFetching: true });
  const [opened, setOpened] = useState(false);
  const router = useRouter()
  const [file, setFile] = useState<File | string | null>(null);
  const [mode, setMode] = useState<string[]>([]);

  const form = useForm<NftPayload>({
    initialValues: {
      creator: '',
      owner: '',
      title: '',
      description: '',
      collectionID: '',
      chainID: '',
      mode: ItemMode.PUBLIC
    },
    validate: {
      title: (value) => (value.length < 1 && 'Tên bộ sưu tập không hợp lệ'),
      description: (value) => (value.length < 1 && 'Mô tả không hợp lệ'),
    },
  })

  useEffect(() => {
    if (collections.data?.collections && collections.data?.collections.length > 0) {
      setCollection({ isFetching: false, data: collections.data.collections[0] });
    }
  }, [collections]);

  const getWallet = async () => {
    if (!!account.information && account.information.wallet) {
      form.setFieldValue('creator', ethers.getAddress(account.information.wallet));
      form.setFieldValue('owner', ethers.getAddress(account.information.wallet));
    }
  }

  const handleSelectMode = async (value: string[]) => {
    if (value.length > 1)
      value.shift();
    // console.log(value)
    setMode(value);
  }

  const onSubmit = form.onSubmit(async (values) => {
    try {
      if (!file) {
        OnErrorModal({ title: 'Tạo Video', error: "Vui lòng chọn video để tải lên" });
        return;
      }

      if (mode.length < 1) {
        OnErrorModal({ title: 'Tạo Video', error: "Vui lòng chọn chế độ cho video tải lên" });
        return;
      }

      let payload = { ...values, mode: Number(mode[0]), source: '' }
      if (collection) {
        payload.chainID = collection.data!.chainID;
        payload.collectionID = collection.data!.collectionID;
      }

      onCreateNft({ payload, mode: mode[0], file });
    } catch (error) {
      onError(error);
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      if (account.information?.wallet) {
        const res = await CollectionModule.getCollecionsOfUser(account.information.wallet, { chainID: blockchain.chainId });
        setCollections(s => ({ ...s, isFetching: false, data: { collections: res.data!.collections, count: res.data!.count } }));
      }
    };

    fetchData();
    getWallet();
  }, [account.information?.wallet]);

  return (
    <BoundaryConnectWallet>
      <AppHeader />

      {/* {isUploading && <AppLoading visible={isUploading} />} */}
      <Stack px={isMobile ? 15 : 40} mt={70} mb={100}>
        <form onSubmit={onSubmit}>
          <Grid mt={20} gutter={isDesktop ? 40 : 0}>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <MediaInput
                label="Video"
                withAsterisk
                width={"100%"}
                height={500}
                ratio={260 / 150}
                radius={10}
                acceptance="video"
                value={file || undefined}
                onChange={(file) => setFile(file)}
                onRemove={() => setFile(null)}
                styles={{
                  label: {
                    fontWeight: 'bold',
                    marginBottom: '6px'
                  }
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Stack pos="relative" my={isMobile ? 0 : 30} justify="center"
                style={{
                  borderRadius: '10px'
                }}
              >
                <Stack gap={14}>
                  <Text mt={isMobile ? 40 : 0} style={{ display: 'block', fontWeight: 'bold', fontSize: '15px', lineHeight: '12px' }}>
                    Chọn bộ sưu tập
                    <span style={{ color: 'red' }}>*</span>
                  </Text>
                  <Box onClick={() => setOpened(!opened)}>
                    {function () {
                      if (collections.isFetching) return <Skeleton h={60} radius={8} />

                      if (collections.error) return <Group><ErrorMessage error={collections.error} /></Group>

                      if (!collection.data) return <Group gap="lg" bg={theme.colors.gray[1]} p={15} style={{
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
                      return <SelectInputItem width="48" height="64" fontsize="15px" image={collection.data.bannerURL} label={collection.data.title} />
                    }()}
                  </Box>
                </Stack>

                <Transition mounted={opened}
                  transition='scale-y'
                  duration={100}
                  timingFunction="ease"
                  keepMounted
                >
                  {(styles) => <Card w={'100%'} mah={300} shadow="sm" radius={10} bg={theme.white} pos="absolute"
                    style={{
                      margin: "auto",
                      zIndex: 1,
                      top: isMobile ? '162px' : '120px',
                      overflowY: 'auto',
                      ...styles
                    }}
                  >
                    {function () {
                      if (collections.isFetching) return <Skeleton h={60} radius={8} />

                      if (collections.error) return <Group><ErrorMessage error={collections.error} /></Group>

                      if (collections.data?.count === 0) return <EmptyMessage />

                      if (!collection.data) return null;

                      return <>
                        {collections.data!.collections.map((v, k) => <Box
                          bg={v.collectionID === collection.data!.collectionID ? theme.colors.primary[5] : theme.white}
                          className={v.collectionID === collection.data!.collectionID ? classes.itemActive : classes.item}
                          style={{
                            borderRadius: '12px',
                            padding: '12px 12px',
                          }}
                          key={k}
                          onClick={() => {
                            setCollection(s => ({ ...s, data: v }));
                            setOpened(false);
                          }}
                        >
                          <Group>
                            <AspectRatio flex={1}>
                              <Image radius={12} src={v.bannerURL} alt={v.name} />
                            </AspectRatio>
                            <Text flex={11} c={v.collectionID === collection.data!.collectionID ? theme.colors.text[0] : theme.colors.text[1]}>{v.title}</Text>
                          </Group>
                        </Box>)}
                      </>
                    }()}
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
                    label: {
                      fontWeight: 'bold'
                    }
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
                    },
                    label: {
                      fontWeight: 'bold'
                    }
                  }}
                  {...form.getInputProps('description')}
                />

                <CheckboxGroup
                  label="Chế độ"
                  required
                  withAsterisk
                  value={mode}
                  onChange={handleSelectMode}
                  styles={{
                    label: {
                      fontWeight: 'bold',
                      marginBottom: '6px'
                    }
                  }}
                >
                  <Group>
                    {Object.values(ItemMode).map((v, k) => <Checkbox
                      color={theme.colors.primary[5]}
                      key={k}
                      value={v}
                      label={CollectionModule.getModeName(v)}
                    />)}
                  </Group>
                </CheckboxGroup>
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
  )
}