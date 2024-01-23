import { useConfig } from "@/modules/configs/context";
import { Button, Group, Modal, Stack, Text, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBarrierBlock } from "@tabler/icons-react";
import { FC, useState } from "react";

interface State {
  title?: string
  message?: string,
  onClose?: () => any
}

export let onSuccess = (state: State) => { };

export const ModalSuccess: FC = () => {
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const [opened, { open, close }] = useDisclosure(false)
  const [state, setState] = useState<State>()

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
          <IconBarrierBlock size={50} color={theme.colors.yellow[6]} />
          <Stack gap={10} align='center'>
            <Text size="20px">{state.title || 'Thành công'}</Text>
            <Text opacity={0.8}>{state?.message}</Text>
          </Stack>
          <Group>
            <Button color='gray' onClick={close} variant={isDarkMode ? 'outline' : 'default'}>
              Đóng
            </Button>
          </Group>
        </Stack>
      }()}
    </Modal>
  )
}
