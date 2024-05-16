import { useConfig } from "@/modules/configs/context";
import { Button, Group, Modal, Stack, Text, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBarrierBlock, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { AppButton } from "../app/app-button";

interface State {
  title?: string
  message?: string,
  onClose?: () => any
}

export let onSuccess = (state: State) => { };

export const ModalSuccess: FC = () => {
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const [opened, { open, close }] = useDisclosure(false);
  const [state, setState] = useState<State>();
  const router = useRouter();

  onSuccess = (state) => {
    setState(state);
    open();
  }

  const onClose = () => {
    if (!state) return;
    if (state.onClose) state.onClose();
    close();
  }

  return (
    <Modal opened={opened} onClose={onClose} withCloseButton={false} styles={{
      overlay: {
        zIndex: 100
      }
    }}>
      {function () {
        if (state) return <Stack align='center' pt={20}>
          {/* <IconCheck size={50} color={theme.colors.green[5]} /> */}
          <div className="dummy-positioning">
            <div className="success-icon">
              <div className="success-icon__tip"></div>
              <div className="success-icon__long"></div>
            </div>

          </div>
          <Stack gap={10} align='center'>
            <Text size="20px">{state.title || 'Thành công'}</Text>
            <Text opacity={0.8}>{state?.message}</Text>
          </Stack>
          <Group gap='xs'>
            <AppButton color={theme.colors.primary[5]} onClick={() => { router.push('/'); close() }}>
              Trang chủ
            </AppButton>
            <AppButton color='gray' onClick={close} variant={isDarkMode ? 'outline' : 'default'}>
              Đóng
            </AppButton>
          </Group>
        </Stack>
      }()}
    </Modal>
  )
}
