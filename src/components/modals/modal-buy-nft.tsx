import { renderPayment } from "@/modules/coins/utils";
import { useConfig } from "@/modules/configs/context";
import { MarketOrderModule } from "@/modules/marketorder/modules";
import { MarketOrder, TransactionEvent } from "@/modules/marketorder/types";
import { ActionIcon, Anchor, Avatar, Box, Card, Checkbox, Group, Modal, NumberInput, Stack, Text, TextInput, Title, Transition, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { AppPayment } from "../../../types";
import { AppButton } from "../app/app-button";
import { onSuccess } from "./modal-success";
import { DatePicker } from "@mantine/dates";
import { DateTimeUtils } from "@/share/utils";

interface State {
  order: MarketOrder,
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
  const [selectedToken, setSelectedToken] = useState<string | undefined>();
  const [price, setPrice] = useState<number | string>();
  const { image, symbol } = renderPayment(state?.order.paymentType || AppPayment.ETH);
  const [dates, setDates] = useState<[Date | null, Date | null]>([currentDate, maxDate]);
  const [value, setValue] = useState(`${DateTimeUtils.formatToShow(currentDate, false)} - ${DateTimeUtils.formatToShow(maxDate, false)}`);
  const [openedCalendar, setOpenedCalendar] = useState(false);
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const isTransferEvent = state?.order.event === TransactionEvent.TRANSFER;

  onBuyNft = (state) => {
    setState(state);
    open();
  }

  const onClose = () => {
    close();
  }

  const handleSubmit = async () => {
    try {
      if (isTransferEvent) {
        await MarketOrderModule.purchaseItem(state?.order!);
      }
      else {
        await MarketOrderModule.purchaseItem(state?.order!, {
          startAt: dates[0]!,
          endAt: dates[1]!,
          price
        });
      }

      onClose();
      onSuccess({ title: 'Mua thành công', message: "Bạn có thể kiểm tra" });
      state?.onUpdate();
    } catch (error) {
      onClose();
      throw error
    }
  }

  useEffect(() => {
    if (isTransferEvent) setPrice(state?.order?.price);
    else setPrice(state?.order?.price! * (DateTimeUtils.countDays(currentDate, maxDate)));

    setSelectedToken(state?.order?.paymentType);
  }, [state])

  return <Modal closeOnClickOutside={false} size="lg" centered opened={opened} onClose={onClose} withCloseButton={false} styles={{
    overlay: {
      zIndex: 100
    }
  }}>
    {function () {
      if (state?.order) return <Stack gap={0}>
        <Group mb={20} justify="space-between">
          <Title fw={500} c={theme.colors.text[1]} order={3} style={{ textAlign: "center" }}>{isTransferEvent ? 'Mua' : 'Thuê'}</Title>

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

        {!isTransferEvent && <>
          <TextInput
            onFocus={() => setOpenedCalendar(!openedCalendar)}
            my={10}
            withAsterisk
            label="Thời gian sử dụng"
            readOnly
            value={value}
            leftSection={<IconCalendar />}
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

          <Transition
            mounted={openedCalendar}
            transition="scale-y"
            duration={200}
            timingFunction="ease"
          >
            {(styles) => <Card
              shadow="md"
              style={{
                ...styles,
              }}
              radius={8}
            >
              <DatePicker
                type="range"
                color={theme.colors.primary[5]}
                defaultChecked
                defaultValue={dates}
                value={dates}
                onChange={(e) => {
                  setDates(e);
                  setValue(`${DateTimeUtils.formatToShow(e[0], false)} - ${DateTimeUtils.formatToShow(e[1], false)}`);
                  setPrice(state.order.price * (DateTimeUtils.countDays(e[0], e[1])));
                }}
                minDate={new Date()}
                maxDate={maxDate}
                styles={{
                  levelsGroup: {
                    justifyContent: 'center'
                  },
                }}
              />
            </Card>}
          </Transition>
        </>}

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

