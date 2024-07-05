import { renderPayment } from "@/modules/coins/utils";
import { useConfig } from "@/modules/configs/context";
import { MarketOrderModule } from "@/modules/marketorder/modules";
import { MarketOrder, TransactionEvent } from "@/modules/marketorder/types";
import { Nft } from "@/modules/nft/types";
import { ActionIcon, Anchor, Avatar, Checkbox, CheckboxGroup, Group, Modal, NumberInput, Stack, Text, Title, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { AppPayment } from "../../../types";
import { AppButton } from "../app/app-button";
import { onSuccess } from "./modal-success";

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
  const [selectedToken, setSelectedToken] = useState<string | undefined>();
  const [price, setPrice] = useState<number | string>();
  const { image, symbol } = renderPayment(state?.order.paymentType || AppPayment.ETH);
  const [agreedPolicy, setAgreedPolicy] = useState(false);

  onBuyNft = (state) => {
    setState(state);
    open();
  }

  const onClose = () => {
    close();
  }

  const handleSubmit = async () => {
    try {
      const priceUpdate = TransactionEvent.FULL_BENEFITS ? priceWithBenefits : price
      await MarketOrderModule.purchaseItem(state?.order!, {
        event: event[0],
        price: priceUpdate,
        collectionId: '0'
      });

      onClose();
      onSuccess({ title: 'Mua thành công', message: "Bạn có thể kiểm tra" });
      state?.onUpdate();
    } catch (error) {
      onClose();
      throw error
    }
  }

  const handleSelectEvent = async (value: string[]) => {
    if (value.length > 1)
      value.shift();
    setEvent(value);
  }

  useEffect(() => {
    if (state?.order && state?.nft) {
      setPrice(state.order.price);
      setPriceWithBenefits(state.order.price + MarketOrderModule.getPercentageListToken(state?.nft.totalViews) * state.order.price / 100);
      setSelectedToken(state.order.paymentType);
    }
  }, [state])

  return <Modal closeOnClickOutside={false} size="lg" centered opened={opened} onClose={onClose} withCloseButton={false} styles={{
    overlay: {
      zIndex: 100
    }
  }}>
    {function () {
      if (state?.order) return <Stack gap={0}>
        <Group mb={20} justify="space-between">
          <Title fw={500} c={theme.colors.text[1]} order={3} style={{ textAlign: "center" }}>Mua NFT</Title>

          <ActionIcon onClick={onClose} c={theme.colors.text[1]} variant="transparent">
            <IconX />
          </ActionIcon>
        </Group>

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
          <Group>
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
          disabled={!agreedPolicy}
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

