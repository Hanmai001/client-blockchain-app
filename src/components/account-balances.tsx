import { useAccount } from "@/modules/account/context";
import { useSelector } from "@/redux/store";
import { getChainId, useBlockChain } from "@/share/blockchain/context";
import { FC, useState } from "react";
import { AppPayment } from "../../types";
import { Avatar, Group, Menu, Skeleton, Stack, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useConfig } from "@/modules/configs/context";
import { renderPayment } from "@/modules/coins/utils";
import { IconSelector } from "@tabler/icons-react";
import { NumberUtils } from "@/share/utils";

export const Balances: FC = () => {
  const account = useAccount();
  const blockchain = useBlockChain();
  const balances = useSelector(s => s.coinBalances);
  const [selectedToken, setSelectedToken] = useState<AppPayment>(AppPayment.ETH);
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const { image, symbol } = renderPayment(selectedToken);

  if (!account.information) return;

  if (getChainId() !== blockchain.chainId) return;

  return (
    <>
      {function () {
        if (balances.isFetching) return <Skeleton height={35} width={100} />
        if (!balances.data) return null;

        return (
          <Group gap={10}>
            <Menu shadow="md" openDelay={100} closeDelay={200}>
              <Menu.Target>
                <UnstyledButton w={150} style={(theme) => ({
                  borderRadius: "24px",
                  backgroundColor: theme.colors.primary[0]
                })}>
                  <Group gap={4} justify="space-between">
                    <Avatar size={38} src={image} />
                    <Text c={isDarkMode ? 'white' : 'dark'} size="sm" style={{ lineHeight: 1 }}>{NumberUtils.round(balances.data[selectedToken], 3)}</Text>
                    <IconSelector color={theme.colors.primary[5]} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>


              <Menu.Dropdown miw={150}>
                <Menu.Label>
                  Số dư ví
                </Menu.Label>
                {Object.keys(balances.data).map((key) => {
                  return <Menu.Item
                    key={key}
                    onClick={() => (setSelectedToken(key as AppPayment))}
                  >
                    <Group gap={8}>
                      <Avatar size={30} src={renderPayment(key as any).image} />
                      <Stack gap={0}>
                        <Text c={isDarkMode ? 'white' : 'dark'} opacity={0.7} size={'xs'}>{renderPayment(key as any).symbol}</Text>
                        <Text c={isDarkMode ? 'white' : 'dark'} size={"sm"} style={{ lineHeight: 1 }}>{NumberUtils.round(balances.data[key], 3) || 0}</Text>
                      </Stack>
                    </Group>
                  </Menu.Item>
                })}
              </Menu.Dropdown>
            </Menu>
          </Group>
        )
      }()}
    </>
  )
}