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
import {
  AspectRatio,
  Box,
  Card,
  Checkbox,
  CheckboxGroup,
  Flex,
  Grid,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Textarea,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconUpload } from "@tabler/icons-react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { AppRoutes } from "../../../../app-router";
import { DataLoadState, ItemMode, ListLoadState } from "../../../../types";
import classes from "../../../styles/nfts/NftCreate.module.scss";

export const CreateCollectionScreen: FC = () => {
  const theme = useMantineTheme();
  const account = useAccount();
  const blockchain = useBlockChain();
  const { isMobile, isDesktop } = useResponsive();
  const router = useRouter();

  const [collections, setCollections] = useState<ListLoadState<any, 'collections'>>({
    isFetching: true,
    data: { collections: [], count: 0 },
  });
  const [collection, setCollection] = useState<DataLoadState<Collection>>({
    isFetching: true,
  });
  const [opened, setOpened] = useState(false);
  const [mode, setMode] = useState<string[]>([]);

  const form = useForm<NftPayload>({
    initialValues: {
      creator: '',
      owner: '',
      title: '',
      description: '',
      collectionID: '',
      chainID: '',
      mode: ItemMode.PUBLIC,
      file: null,
    },
    validate: {
      title: (value) => value.length < 1 && 'Tên bộ sưu tập không hợp lệ',
      description: (value) => value.length < 1 && 'Mô tả không hợp lệ',
    },
  });

  useEffect(() => {
    if (collections.data?.collections && collections.data?.collections.length > 0) {
      setCollection({ isFetching: false, data: collections.data.collections[0] });
    }
  }, [collections]);

  const getWallet = useCallback(async () => {
    if (!!account.information && account.information.wallet) {
      form.setFieldValue('creator', ethers.getAddress(account.information.wallet));
      form.setFieldValue('owner', ethers.getAddress(account.information.wallet));
    }
  }, [account.information, form]);

  const handleSelectMode = useCallback((value: string[]) => {
    if (value.length > 1) value.shift();
    setMode(value);
  }, []);

  const onSubmit = useCallback(
    form.onSubmit(async (values) => {
      try {
        if (mode.length < 1) {
          OnErrorModal({ title: 'Tạo Video', error: 'Vui lòng chọn chế độ cho video tải lên' });
          return;
        }

        let payload = { ...values, mode: Number(mode[0]), source: '' };
        if (collection) {
          payload.chainID = collection.data!.chainID;
          payload.collectionID = collection.data!.collectionID;
        }

        await onCreateNft({ payload, mode: mode[0] });
      } catch (error) {
        onError(error);
      }
    }),
    [mode, collection, form]
  );

  const fetchData = async () => {
    if (account.information?.wallet && collections.isFetching) {
      const res = await CollectionModule.getCollecionsOfUser(account.information.wallet, {
        chainID: blockchain.chainId,
      });
      setCollections((s) => ({
        ...s,
        isFetching: false,
        data: { collections: res.data!.collections, count: res.data!.count },
      }));
    }
  };

  useEffect(() => {
    fetchData();
    getWallet();
  }, [account.information?.wallet]);

  const renderCollectionSelection = useMemo(() => {
    if (collections.isFetching) return <Skeleton h={60} radius={8} />;
    if (collections.error) return <Group><ErrorMessage error={collections.error} /></Group>;
    if (!collection.data) return <Group gap="lg" bg={theme.colors.gray[1]} p={15} style={{ flexWrap: "nowrap", borderRadius: '10px', height: '90px', cursor: "pointer" }} onClick={() => router.push(AppRoutes.collection.create)}><Flex justify="center" align="center" style={{ borderRadius: '10px', backgroundColor: theme.colors.gray[2], width: '60px', height: '60px' }}><IconPlus /></Flex><Text fw="bold">Tạo bộ sưu tập mới</Text></Group>;
    return <SelectInputItem width="48" height="64" fontsize="15px" image={collection.data.bannerURL} label={collection.data.title} />;
  }, [collections, collection, theme, router]);

  const renderCollectionList = useMemo(() => {
    if (collections.isFetching) return <Skeleton h={60} radius={8} />;
    if (collections.error) return <Group><ErrorMessage error={collections.error} /></Group>;
    if (collections.data?.count === 0) return <EmptyMessage />;
    if (!collection.data) return null;

    return collections.data!.collections.map((v, k) => (
      <Box
        bg={v.collectionID === collection.data!.collectionID ? theme.colors.primary[5] : theme.white}
        className={v.collectionID === collection.data!.collectionID ? classes.itemActive : classes.item}
        style={{ borderRadius: '12px', padding: '12px 12px' }}
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
      </Box>
    ));
  }, [collections, collection, theme]);

  return (
    <BoundaryConnectWallet>
      <AppHeader />
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
                {...form.getInputProps('file')}
                onRemove={() => form.setFieldValue('file', null)}
                styles={{ label: { fontWeight: 'bold', marginBottom: '6px' } }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Stack pos="relative" my={isMobile ? 0 : 30} justify="center" style={{ borderRadius: '10px' }}>
                <Stack gap={14}>
                  <Text mt={isMobile ? 40 : 0} style={{ display: 'block', fontWeight: 'bold', fontSize: '15px', lineHeight: '12px' }}>
                    Chọn bộ sưu tập
                    <span style={{ color: 'red' }}>*</span>
                  </Text>
                  <Box onClick={() => setOpened(!opened)}>
                    {renderCollectionSelection}
                  </Box>
                </Stack>

                <Transition mounted={opened} transition='pop-top-right'>
                  {(styles) => (
                    <Box style={{ ...styles, borderRadius: '8px' }} className={classes.box}>
                      {renderCollectionList}
                    </Box>
                  )}
                </Transition>
              </Stack>

              <Stack mt={30}>
                <TextInput
                  placeholder="Tên video"
                  label="Tên video"
                  withAsterisk
                  radius={8}
                  styles={{ input: { padding: 20, fontSize: '15px' } }}
                  {...form.getInputProps('title')}
                />
                <Textarea
                  placeholder="Mô tả"
                  label="Mô tả"
                  withAsterisk
                  radius={8}
                  autosize
                  minRows={4}
                  styles={{ input: { padding: 20, fontSize: '15px' } }}
                  {...form.getInputProps('description')}
                />
                <CheckboxGroup mt={10} value={mode} onChange={handleSelectMode}>
                  <Checkbox value={ItemMode.PUBLIC} label="Công khai" />
                  <Checkbox value={ItemMode.COMMERCIAL} label="Riêng tư" />
                </CheckboxGroup>
              </Stack>
              <Group mt={40} justify="flex-end" gap="xs">
                <AppButton color="gray" onClick={() => router.back()}>
                  Hủy
                </AppButton>
                <AppButton leftSection={<IconUpload size={14} />} type="submit">
                  Tạo video
                </AppButton>
              </Group>
            </Grid.Col>
          </Grid>
        </form>
      </Stack>
    </BoundaryConnectWallet>
  );
};