import { renderPayment } from "@/modules/coins/utils";
import { useConfig } from "@/modules/configs/context";
import { MarketOrderModule } from "@/modules/marketorder/modules";
import { MarketOrder } from "@/modules/marketorder/types";
import { Nft } from "@/modules/nft/types";
import { ActionIcon, Anchor, AspectRatio, Avatar, Box, Card, Checkbox, CheckboxGroup, Flex, Group, Image, Modal, NumberInput, Skeleton, Stack, Text, Title, Transition, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconX } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { AppPayment, DataLoadState, ListLoadState } from "../../../types";
import { AppButton } from "../app/app-button";
import { onSuccess } from "./modal-success";
import { CollectionModule } from "@/modules/collection/modules";
import { useAccount } from "@/modules/account/context";
import { useBlockChain } from "@/share/blockchain/context";
import { ErrorMessage } from "../error-message";
import { Collection } from "@/modules/collection/types";
import { AppRoutes } from "../../../app-router";
import { SelectInputItem } from "../input/select-input-item";
import { useRouter } from "next/router";
import { EmptyMessage } from "../empty-message";
import classes from '../../styles/nfts/NftCreate.module.scss';
import { OnErrorModal } from "./modal-error";

interface State {
  order: MarketOrder,
  nft: Nft,
  onUpdate: () => void
}

export let onBuyNft = (state: State) => undefined;
export const ModalBuyNft: FC = () => {
  const currentDate = new Date();
  const maxDate = new Date(currentDate);
  maxDate.setDate(maxDate.getDate() + 14);
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const [state, setState] = useState<State>();
  const [opened, { open, close }] = useDisclosure(false);
  const [priceWithBenefits, setPriceWithBenefits] = useState<number>();
  const [event, setEvent] = useState<string[]>([]);
  const [_, setSelectedToken] = useState<string | undefined>();
  const [price, setPrice] = useState<number | string>();
  const { image, symbol } = renderPayment(state?.order.paymentType || AppPayment.ETH);
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [collection, setCollection] = useState<DataLoadState<Collection>>({ isFetching: true });
  const [collections, setCollections] = useState<ListLoadState<Collection, 'collections'>>({ isFetching: true, data: { collections: [], count: 0 } });
  const [openedCard, setOpenedCard] = useState(false);
  const account = useAccount();
  const blockchain = useBlockChain();
  const router = useRouter();

  enum TransactionEvent {
    WITHOUT_BENEFITS = '1',
    FULL_BENEFITS = '2'
  }


  onBuyNft = (state) => {
    setState(state);
    open();
  }

  const onClose = () => {
    close();
  }

  const handleSubmit = async () => {
    try {
      if (!collection.data) return;
      if (event.length < 1) {
        OnErrorModal({ error: "Vui lòng chọn phúc lợi muốn sở hữu" });
        return;
      }

      const priceUpdate = event[0] === TransactionEvent.FULL_BENEFITS ? priceWithBenefits : price
      await MarketOrderModule.purchaseItem(state?.order!, {
        event: Number(event[0]),
        price: priceUpdate,
        collectionID: collection.data?.collectionID
      });

      onClose();
      onSuccess({ title: 'Mua thành công', message: "Bạn có thể kiểm tra" });
      state?.onUpdate();
    } catch (error) {
      onClose();
      OnErrorModal({ error })
    }
  }

  const handleSelectEvent = async (value: string[]) => {
    if (value.length > 1)
      value.shift();
    setEvent(value);
  }

  const fetchData = async () => {
    if (account.information?.wallet) {
      const res = await CollectionModule.getCollecionsOfUser(account.information.wallet, { chainID: blockchain.chainId });
      setCollections(s => ({ ...s, isFetching: false, data: { collections: res.data!.collections, count: res.data!.count } }));
    }
  };

  useEffect(() => {
    if (state?.order && state?.nft) {
      fetchData();
      setPrice(state.order.price);
      setPriceWithBenefits(state.order.price + MarketOrderModule.getPercentageListToken(state?.nft.totalViews) * state.order.price / 100);
      setSelectedToken(state.order.paymentType);
    }
  }, [state])

  useEffect(() => {
    if (collections.data?.collections && collections.data?.collections.length > 0) {
      setCollection({ isFetching: false, data: collections.data.collections[0] });
    }
  }, [collections]);

  return <Modal closeOnClickOutside={false} size="lg" centered opened={opened} onClose={onClose} withCloseButton={false} styles={{
    overlay: {
      zIndex: 100
    },
    content: {
      overflow: 'visible'
    }
  }}>
    {function () {
      if (state?.order) return <Stack gap={6}>
        <Group mb={20} justify="space-between">
          <Title fw={500} c={theme.colors.text[1]} order={3} style={{ textAlign: "center" }}>Mua NFT</Title>

          <ActionIcon onClick={onClose} c={theme.colors.text[1]} variant="transparent">
            <IconX />
          </ActionIcon>
        </Group>

        <Box>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '15px' }}>
            Phương thức thanh toán
          </label>

          <UnstyledButton w='100%' p={10} style={(theme) => ({
            borderRadius: "10px",
            border: `1px solid ${theme.colors.gray[4]}`
          })}>
            <Group>
              <Avatar size={38} src={image} />
              <Text c={isDarkMode ? 'white' : 'dark'} size="sm" style={{ lineHeight: 1 }}>{symbol}</Text>
            </Group>
          </UnstyledButton>
        </Box>

        <Box pos="relative">
          <Stack gap={2}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
              Chọn bộ sưu tập
            </label>
            <Box onClick={() => setOpenedCard(!openedCard)}>
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

          <Transition mounted={openedCard}
            transition='scale-y'
            duration={100}
            timingFunction="ease"
            keepMounted
          >
            {(styles) => <Card w={'100%'} mah={300} shadow="sm" radius={10} bg={theme.white} pos="absolute"
              style={{
                margin: "auto",
                zIndex: 1,
                top: '120px',
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
                      setOpenedCard(false);
                    }}
                  >
                    <Group>
                      <AspectRatio flex={1}>
                        <Image radius={12} src={v.bannerURL} alt={v.title} />
                      </AspectRatio>
                      <Text flex={11} c={v.collectionID === collection.data!.collectionID ? theme.colors.text[0] : theme.colors.text[1]}>{v.title}</Text>
                    </Group>
                  </Box>)}
                </>
              }()}
            </Card>}
          </Transition>
        </Box>

        <CheckboxGroup
          label="Loại mua"
          required
          withAsterisk
          value={event}
          onChange={handleSelectEvent}
          styles={{
            label: {
              fontWeight: 'bold',
              marginBottom: '6px'
            }
          }}
        >
          <Group justify="space-between">
            {Object.values(TransactionEvent).map((v, k) => <Checkbox
              color={theme.colors.primary[5]}
              key={k}
              value={v}
              label={MarketOrderModule.getMarketEvent(v)}
            />)}
          </Group>
        </CheckboxGroup>

        <NumberInput
          my={10}
          value={event[0] === TransactionEvent.FULL_BENEFITS.toString() ? priceWithBenefits : price}
          label="Giá bán"
          disabled
          decimalScale={5}
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
        />

        <Checkbox
          my={10}
          label={
            <>
              Tôi đồng ý <Anchor href="/policy" target="_blank" inherit
                style={{
                  textDecoration: 'underline',
                  color: 'blue'
                }}
              >Chính sách và điều khoản
              </Anchor> của BlockClip
            </>
          }
          checked={agreedPolicy}
          color={theme.colors.primary[5]}
          onChange={(event) => setAgreedPolicy(event.currentTarget.checked)}
          styles={{
            label: {
              fontStyle: 'italic'
            }
          }}
        />

        <AppButton
          mt={10}
          disabled={!agreedPolicy || !collection.data}
          async
          onClick={handleSubmit}
          radius={10}
          color={theme.colors.primary[5]}
          height={50}
          width='100%'
        >
          Mua
        </AppButton>
      </Stack>
    }()}
  </Modal>
}

