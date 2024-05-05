import { renderPayment } from "@/modules/coins/utils";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection, PackageType } from "@/modules/collection/types";
import { Anchor, Avatar, Box, Card, Checkbox, Divider, Grid, Group, Modal, Skeleton, Stack, Text, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, useState } from "react";
import { AppPayment } from "../../../types";
import { AppButton } from "../app/app-button";
import { IconCheck } from "@tabler/icons-react";

interface State {
  collection: Collection,
  onUpdate?: () => void
}

export let onSubscribeCollection = (state: State) => undefined;
export const ModalSubscribeCollection: FC = () => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [state, setState] = useState<State>();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const payment = { ...renderPayment(AppPayment.ETH) };
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const marketTest = [
    {
      type: PackageType.DAYS_30,
      price: 1.5
    },
    {
      type: PackageType.DAYS_90,
      price: 3.5
    },
    {
      type: PackageType.A_YEAR,
      price: 10.5
    }
  ]
  const [marketPackages, setMarketPackages] = useState(marketTest);

  const gridColumns = {
    lg: 4,
    sm: 12,
    xs: 12
  }

  onSubscribeCollection = (state) => {
    setState(state);
    open();
  }

  const onClose = () => {
    close();
  }

  return <Modal closeOnClickOutside={false} title="Chọn gói đăng kí" radius={8} size={1000} centered opened={opened} onClose={onClose} styles={{
    overlay: {
      zIndex: 100
    },
    title: {
      fontWeight: 500,
      fontSize: "18px",
      color: theme.colors.text[1]
    }
  }}>
    {function () {
      //if (!state) return <Skeleton h={400}/>

      return <Stack>
        <Grid>
          {marketPackages.map((v, k) => <Grid.Col key={k} span={{ ...gridColumns }}>
            <Box
              className={`gradient-box ${selectedPackage?.type === v.type ? 'selected' : ''}`}
              onClick={() => setSelectedPackage(v)}
            >
              <Card radius={6}>
                <Stack>
                  <Group justify="center" style={{
                    background: 'black',
                    padding: '15px 0',
                    color: theme.colors.text[0],
                    borderRadius: '8px',
                    backgroundColor: '#4125a9',
                    backgroundImage: 'linear-gradient(19deg, #481078 0%, #070e46 100%)'
                  }}>
                    <Text fw={500} size="20px">{CollectionModule.getPackageName(v.type)}</Text>
                  </Group>

                  <Stack>
                    <Text size="14px" c={theme.colors.gray[7]}>Giá</Text>
                    <Stack gap='xs'>
                      <Text size="16px" fw={500} c={theme.colors.text[1]}>{v.price}</Text>
                      <Divider />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Text size="14px" c={theme.colors.gray[7]}>Phương thức thanh toán</Text>
                    <Stack gap='xs'>
                      <Group>
                        <Avatar src={payment.image} />
                        <Text size="16px" fw={500} c={theme.colors.text[1]}>{payment.symbol}</Text>
                      </Group>
                      <Divider />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Text size="14px" c={theme.colors.gray[7]}>Thiết bị hỗ trợ</Text>
                    <Stack gap='xs'>
                      <Text size="16px" fw={500} c={theme.colors.text[1]}>Điện thoại, Máy tính, Máy tính bảng</Text>
                      <Divider />
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            </Box>
          </Grid.Col>)}
        </Grid>

        <Stack my={10}>
          <Group gap='xs'>
            <IconCheck color="teal" size={18}/>
            <Text size="14px" c={theme.colors.text[1]}>Bạn có thể truy cập mọi video của nhà sáng tạo trên Blockclip</Text>
          </Group>
          <Group gap='xs'>
            <IconCheck color="teal" size={18} />
            <Text size="14px" c={theme.colors.text[1]}>Bạn có thể truy cập mọi video bị ẩn sau khi đăng kí thành công</Text>
          </Group>
        </Stack>
        
        <Checkbox
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
          color={theme.colors.primary[5]}
          radius={8}
          height={45}
          disabled={selectedPackage && agreedPolicy ? false : true}
          size="lg"
        >
          Đăng kí
        </AppButton>
      </Stack>
    }()}
  </Modal>
}