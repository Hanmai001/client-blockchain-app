import { AdminWrapper } from "@/components/admin/admin-wrapper";
import { AppButton } from "@/components/app/app-button";
import { useAccount } from "@/modules/account/context";
import { SystemModule } from "@/modules/system/modules";
import { Box, Card, Divider, Group, TextInput, Title, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";

export const AdminSystemScreen: FC = () => {
  const theme = useMantineTheme();
  const account = useAccount();
  const [mintAddress, setMintAddress] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [feeRate, setFeeRate] = useState('');
  const [feeMint, setFeeMint] = useState('');

  const updateMintAddress = async () => {
    try {
      await SystemModule.updateMintAddress(mintAddress);
    } catch (error) {

    }
  }

  const updateReceiverAddress = async () => {
    try {
      await SystemModule.updateReceiverAddress(receiverAddress);
    } catch (error) {

    }
  }

  const updateFeeMint = async () => {
    try {
      await SystemModule.updateFeeMint(feeMint);
    } catch (error) {

    }
  }

  const updateFeeRate = async () => {
    try {
      await SystemModule.updateFeeRate(feeRate);
    } catch (error) {

    }
  }

  useEffect(() => {
    if (account.information) {
      (async () => {
        const res = await SystemModule.getInfoSystem();
        setMintAddress(res.mintAddress);
        setReceiverAddress(res.receiverAddress);
        setFeeMint(res.feeMint);
        setFeeRate(res.feeRate);
      })()
    }
  }, [account.information])

  return <Box bg="#f8f9fe">
    <AdminWrapper>
      <Box p={20}>
        <Card radius="md" shadow="sm" withBorder>
          <Title order={4} c={theme.colors.text[1]}>Thiết lập hệ thống</Title>

          <Divider my={10} />

          <Group>
            <TextInput
              flex={8}
              label="Smart Contract BlockClip NFT"
              radius="md"
              mb={30}
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
              styles={{
                input: {
                  height: '40px',
                },
                label: {
                  marginBottom: '6px',
                  fontWeight: 'bold',
                  color: theme.colors.text[1]
                }
              }} />
            <AppButton
              onClick={updateMintAddress}
              async
              color={theme.colors.primary[5]}
              height={40}
              radius={8}
              style={{
                float: 'right'
              }}
            >
              Cập nhật
            </AppButton>
          </Group>

          <Group>
            <TextInput
              flex={8}
              label="Người nhận"
              radius="md"
              mb={30}
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              styles={{
                input: {
                  height: '40px',
                },
                label: {
                  marginBottom: '6px',
                  fontWeight: 'bold',
                  color: theme.colors.text[1]
                }
              }} />
            <AppButton
              onClick={updateReceiverAddress}
              async
              color={theme.colors.primary[5]}
              height={40}
              radius={8}
              style={{
                float: 'right'
              }}
            >
              Cập nhật
            </AppButton>
          </Group>

          <Group>
            <TextInput
              label="Phí Mint NFT/Collection"
              radius="md"
              mb={30}
              value={feeMint}
              onChange={(e) => setFeeMint(e.target.value)}
              styles={{
                input: {
                  height: '40px',
                },
                label: {
                  marginBottom: '6px',
                  fontWeight: 'bold',
                  color: theme.colors.text[1]
                }
              }} />
            <AppButton
              onClick={updateFeeMint}
              async
              color={theme.colors.primary[5]}
              height={40}
              radius={8}
              style={{
                float: 'right'
              }}
            >
              Cập nhật
            </AppButton>
          </Group>

          <Group>
            <TextInput
              label="Phần trăm hoa hồng (%)"
              radius="md"
              mb={30}
              value={feeRate}
              onChange={(e) => setFeeRate(e.target.value)}
              styles={{
                input: {
                  height: '40px',
                },
                label: {
                  marginBottom: '6px',
                  fontWeight: 'bold',
                  color: theme.colors.text[1]
                }
              }} />
            <AppButton
              onClick={updateFeeRate}
              async
              color={theme.colors.primary[5]}
              height={40}
              radius={8}
            >
              Cập nhật
            </AppButton>
          </Group>
        </Card>
      </Box>
    </AdminWrapper>
  </Box>
}