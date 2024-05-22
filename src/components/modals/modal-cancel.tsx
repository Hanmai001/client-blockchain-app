import { useConfig } from '@/modules/configs/context'
import { Button, Group, Modal, Stack, Text, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBarrierBlock } from '@tabler/icons-react'
import { FC, useState } from 'react'

interface State {
  title?: string
  message?: string
  onAction?: () => any
  onClose?: () => any
}

export let onCancel = (state: State) => { };

export const ModalCancel: FC = () => {
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const [opened, { open, close }] = useDisclosure(false)
  const [state, setState] = useState<State>()

  onCancel = (s) => {
    setState(s)
    open()
  }

  const onClose = () => {
    if (!state) return;
    if (state.onClose) state.onClose();
    close();
  }

  const onAction = () => {
    if (!state) return;
    if (state.onAction) state.onAction();
    close();
  }

  return (
    <Modal opened={opened} onClose={onClose} withCloseButton={false} styles={{
      overlay: {
        zIndex: 100
      }
    }}>
      {function () {
        if (state) {
          return <Stack align='center' pt={20}>
            <IconBarrierBlock size={50} color={theme.colors.yellow[6]} />
            <Stack gap={10} align='center'>
              <Text size="20px">{state.title || 'Có lỗi xảy ra'}</Text>
              <Text opacity={0.8}>{state.message}</Text>
            </Stack>
            <Group>
              <Button onClick={onAction} variant={isDarkMode ? 'outline' : 'default'}>
                Xác nhận
              </Button>
              <Button color={theme.colors.primary[5]} onClick={close}>
                Đóng
              </Button>
            </Group>
          </Stack>
        }
      }()}
    </Modal>
  )
}
