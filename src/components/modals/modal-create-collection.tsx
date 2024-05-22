import { CoinsModule } from '@/modules/coins/modules'
import { CollectionModule } from '@/modules/collection/modules'
import { getContracts, useConfig } from '@/modules/configs/context'
import { Modal, Stepper, Title, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FC, useState } from 'react'
import { onSuccess } from './modal-success'
import { onError } from './modal-error'

interface State {
  title?: string
  message?: string
  payload: any
  onClose?: () => any
}

export let onCreateCollection = (state: State) => { };
export let onSetStep = (step: number) => { };

export const ModalCreateCollection: FC = () => {
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const [opened, { open, close }] = useDisclosure(false);
  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState<State>()

  onCreateCollection = async (s) => {
    setState(s)
    open()
    if (s.payload) {
      try {
        const contractMarket = getContracts().ercs.MARKETPLACE;
        const res = await CollectionModule.create(s.payload);
        let txReceipt = await contractMarket.send({
          method: 'createCollection',
          args: [s.payload.creatorCollection, res.data.collectionURI]
        });
        if (txReceipt) setActiveStep(1);

        const payloadUpdate = { ...s.payload, collectionID: txReceipt.logs[0].args['0'].toString(), contractAddress: getContracts().erc721s.BLOCKCLIP_NFT.address };
        await CollectionModule.updateAfterMint(res.data.collection.id, payloadUpdate);
        await CoinsModule.fetchUserBalance();
        setActiveStep(2);
        onClose();
        onSuccess({ title: 'Tạo thành công', message: '' });
      } catch (error) {
        onClose();
        onError("Tạo Bộ sưu tập không thành công!");
      }
    }
  }

  const onClose = () => {
    close();
  }

  return (
    <Modal size='lg' radius={8} title={<Title order={3} fw={500}>Tạo bộ sưu tập</Title>} centered opened={opened} onClose={onClose} withCloseButton={false} styles={{
      overlay: {
        zIndex: 100
      },
    }}>
      <Stepper
        color={theme.colors.primary[5]}
        active={activeStep}
        orientation="vertical"
        size='lg'
        allowNextStepsSelect={false}
        styles={{
          step: {
            margin: '10px'
          },
          stepDescription: {
            fontSize: '14px',
            lineHeight: '18px'
          }
        }}
      >
        <Stepper.Step label="Xác nhận khởi tạo trên blockchain" description="Bạn sẽ được yêu cầu trả phí gas và ký xác nhận để tiến hành tạo và lưu BST của bạn trên blockchain." loading={activeStep === 0} />
        <Stepper.Step label="Tạo Bộ sưu tập" description="Sẽ tốn một chút thời gian để giao dịch trên blockchain được tạo." loading={activeStep === 1} />
      </Stepper>
    </Modal>
  )
}
