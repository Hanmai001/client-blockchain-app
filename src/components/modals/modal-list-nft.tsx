import { useConfig } from "@/modules/configs/context";
import { Nft } from "@/modules/nft/types";
import { Avatar, Text, Group, Menu, Modal, Stack, Title, UnstyledButton, useMantineTheme, Box, TextInput, NumberInput, ActionIcon, Divider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, useState } from "react";
import { AppPayment } from "../../../types";
import { renderPayment } from "@/modules/coins/utils";
import { IconSelector, IconX } from "@tabler/icons-react";
import { AppButton } from "../app/app-button";

export let onListNft = (nft: Nft) => undefined;
export const ModalListNft: FC = () => {
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const [nft, setNft] = useState<Nft>();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedToken, setSelectedToken] = useState<AppPayment>(AppPayment.ETH);
  const { image, symbol } = renderPayment(selectedToken);

  const payments = [
    { ...renderPayment(AppPayment.ETH), paymentType: AppPayment.ETH },
    { ...renderPayment(AppPayment.BCT), paymentType: AppPayment.BCT },
  ]

  onListNft = (nft) => {
    setNft(nft);
    open();
  }

  const onClose = () => {
    close();
  }

  const handleSubmit = async () => {
    try {
      
    } catch (error) {
      
    }
  }

  return <Modal centered opened={opened} onClose={onClose} withCloseButton={false} styles={{
    overlay: {
      zIndex: 100
    }
  }}>
    {function () {
      if (nft) return <Stack gap={0}>
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
        />

        <AppButton
          mt={10}
          async
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