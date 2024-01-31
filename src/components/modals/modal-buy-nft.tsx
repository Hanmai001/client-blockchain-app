import { renderPayment } from "@/modules/coins/utils";
import { useConfig } from "@/modules/configs/context";
import { MarketOrderModule } from "@/modules/marketorder/modules";
import { MarketOrder } from "@/modules/marketorder/types";
import { ActionIcon, Avatar, Group, Modal, NumberInput, Stack, Text, Title, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { AppPayment } from "../../../types";
import { AppButton } from "../app/app-button";
import { onSuccess } from "./modal-success";

interface State {
  order: MarketOrder,
  onUpdate: () => void
}

export let onBuyNft = (state: State) => undefined;
export const ModalBuyNft: FC = () => {
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const [state, setState] = useState<State>();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedToken, setSelectedToken] = useState<string | undefined>();
  const [price, setPrice] = useState<number | string>();
  const { image, symbol } = renderPayment(state?.order.paymentType || AppPayment.ETH);

  onBuyNft = (state) => {
    setState(state);
    open();
  }

  const onClose = () => {
    close();
  }

  const handleSubmit = async () => {
    try { 
      await MarketOrderModule.purchaseItem(state?.order!);

      onClose();
      onSuccess({title: 'Mua thành công', message: "Bạn có thể kiểm tra"});
      state?.onUpdate();
    } catch (error) {
      onClose();
      throw error
    }
  }

  useEffect(() => {
    setPrice(state?.order?.price);
    setSelectedToken(state?.order?.paymentType);
  }, [state])

  return <Modal closeOnClickOutside={false} centered opened={opened} onClose={onClose} withCloseButton={false} styles={{
    overlay: {
      zIndex: 100
    }
  }}>
    {function () {
      if (state?.order) return <Stack gap={0}>
        <Group mb={20} justify="space-between">
          <Title fw={500} c={theme.colors.text[1]} order={3} style={{ textAlign: "center" }}>Mua</Title>

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

        <NumberInput
          my={10}
          value={price}
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

        <AppButton
          mt={10}
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

