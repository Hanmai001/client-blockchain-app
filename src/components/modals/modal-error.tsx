import { getChainId, useConfig } from '@/modules/configs/context'
import { renderLinkTransaction } from '@/share/blockchain/context'
import { BlockchainError, BlockchainErrorCode } from '@/share/blockchain/types'
import { Button, Group, Modal, Stack, Text, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBarrierBlock } from '@tabler/icons-react'
import { FC, useState } from 'react'

interface State {
  title?: string
  error: any
  onClose?: () => any
}

export let OnErrorModal: (state: State) => void = () => {}
export let onError = (error: any) => OnErrorModal({ error })

export const ErrorModal: FC = () => {
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const [opened, { open, close }] = useDisclosure(false)
  const [state, setState] = useState<State>()

  OnErrorModal = (s) => {
    setState(s)
    open()
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
        if (state) {

          if (state.error instanceof BlockchainError) {
            const { message: pureMessage, transactionHash, code } = state.error;
            let message = pureMessage;
            if (code === BlockchainErrorCode.USER_REJECTED) message = 'You have declined the transaction';
            if (code === BlockchainErrorCode.INVALID_JSON_RPC_ERROR) message = 'MetaMask is having trouble connecting to the network';

            return <Stack align='center' pt={20}>
              <IconBarrierBlock size={50} color={theme.colors.yellow[6]} />
              <Stack gap={10} align='center'>
                <Text size="20px">{message || state.title || 'Action failed.'}</Text>
                <Text size="sm" opacity={0.8}>Code: {1000 + Object.values(BlockchainErrorCode).indexOf(code)}</Text>
              </Stack>

              <Group gap='xs' mt={20}>
                {!!transactionHash && <Button onClick={() => window.open(renderLinkTransaction(state.error.transactionHash, getChainId()))}>
                  Xem giao dịch
                </Button>}

                <Button
                  color='gray'
                  onClick={onClose}
                  variant="outline"
                >
                  Đóng
                </Button>
              </Group>
            </Stack>
          }

          let message = `Something went wrong.`;
          if (typeof state.error === 'object') message = state.error.message;
          if (typeof state.error === 'string') message = state.error;

          const msgObj: any = {
            'EXIST_EMAIL': 'Email existed!',
            'INSUFFICIENT_FOUND': 'The system is under maintenance, please come back later'
          }

          if (msgObj[message]) message = msgObj[message];

          return <Stack align='center' pt={20}>
            <IconBarrierBlock size={50} color={theme.colors.yellow[6]} />
            <Stack gap={10} align='center'>
              <Text size="20px">{state.title || 'Action failed.'}</Text>
              <Text opacity={0.8}>{message}</Text>
            </Stack>
            <Group>
              <Button color='gray' onClick={close} variant={isDarkMode ? 'outline' : 'default'}>
                Đóng
              </Button>
            </Group>
          </Stack>
        }
      }()}
    </Modal>
  )
}
