import { useAccount } from "@/modules/account/context";
import { renderPayment } from "@/modules/coins/utils";
import { getContracts, useConfig } from "@/modules/configs/context";
import { MarketOrderPayload, MarketStatus, TransactionEvent } from "@/modules/marketorder/types";
import { Nft } from "@/modules/nft/types";
import { useBlockChain } from "@/share/blockchain/context";
import { ActionIcon, Avatar, Group, Menu, Modal, NumberInput, Stack, Text, Title, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSelector, IconX } from "@tabler/icons-react";
import { FC, useState } from "react";
import { AppPayment } from "../../../types";
import { AppButton } from "../app/app-button";
import { onError } from "./modal-error";
import { MarketOrderModule } from "@/modules/marketorder/modules";
import { onSuccess } from "./modal-success";

interface State {
  nft: Nft,
  onUpdate: () => void
}

export let onListNft = (state: State) => undefined;
export const ModalListNft: FC = () => {
  const theme = useMantineTheme();
  const blockchain = useBlockChain();
  const account = useAccount();
  const { isDarkMode } = useConfig();
  const [state, setState] = useState<State>();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedToken, setSelectedToken] = useState<AppPayment>(AppPayment.ETH);
  const [price, setPrice] = useState<number>();
  const { image, symbol } = renderPayment(selectedToken);

  const payments = [
    { ...renderPayment(AppPayment.ETH), paymentType: AppPayment.ETH },
    { ...renderPayment(AppPayment.BCT), paymentType: AppPayment.BCT },
  ]

  onListNft = (state) => {
    setState(state);
    open();
  }

  const onClose = () => {
    close();
  }

  const handleSubmit = async () => {
    try {
      const payload: MarketOrderPayload = {
        event: TransactionEvent.TRANSFER,
        chainID: blockchain.chainId as string,
        tokenID: state!.nft!.tokenID,
        tokenAddress: state!.nft!.contractAddress,
        paymentType: selectedToken,
        price: price!,
        seller: account.information?.wallet || '',
        status: MarketStatus.ISLISTING
      }
      
      console.log("payload: ", payload);

      const res = await MarketOrderModule.create(payload);

      console.log("res: ", res)
      onClose();
      onSuccess({title: "Đăng bán thành công"});
      
      state?.onUpdate();
    } catch (error) {
      onClose();
      onError("Đăng bán thất bại")
    }
  }

  return <Modal closeOnClickOutside={false} centered opened={opened} onClose={onClose} withCloseButton={false} styles={{
    overlay: {
      zIndex: 100
    }
  }}>
    {function () {
      if (state?.nft) return <Stack gap={0}>
        <Group mb={20} justify="space-between">
          <Title fw={500} c={theme.colors.text[1]} order={3} style={{ textAlign: "center" }}>Đăng bán</Title>

          <ActionIcon onClick={onClose} c={theme.colors.text[1]} variant="transparent">
            <IconX />
          </ActionIcon>
        </Group>

        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '15px' }}>
          Phương thức thanh toán
          <span style={{ color: 'red' }}>*</span>
        </label>
        <Menu shadow="md" openDelay={100} closeDelay={200}>
          <Menu.Target>
            <UnstyledButton w='100%' p={10} style={(theme) => ({
              borderRadius: "10px",
              border: `1px solid ${theme.colors.gray[4]}`
            })}>
              <Group gap={4} justify="space-between">
                <Avatar size={38} src={image} />
                <Text c={isDarkMode ? 'white' : 'dark'} size="sm" style={{ lineHeight: 1 }}>{symbol}</Text>
                <IconSelector color={theme.colors.primary[5]} />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown miw={400}>
            {payments.map((v, k) => {
              return <Menu.Item
                key={k}
                onClick={() => (setSelectedToken(v.paymentType))}
                mih={60}
              >
                <Group gap={8}>
                  <Avatar size={30} src={v.image} />
                  <Text>{v.symbol}</Text>
                </Group>
              </Menu.Item>
            })}
          </Menu.Dropdown>
        </Menu>

        <NumberInput
          my={10}
          value={price}
          label="Giá bán"
          placeholder="0.001"
          withAsterisk
          decimalScale={5}
          allowNegative={false}
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
          onChange={setPrice}
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
          Đăng bán
        </AppButton>
      </Stack>
    }()}
  </Modal>
}

