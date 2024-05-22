import { CoinsModule } from '@/modules/coins/modules'
import { CollectionModule } from '@/modules/collection/modules'
import { getContracts, useConfig } from '@/modules/configs/context'
import { Modal, Stepper, Title, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FC, useState } from 'react'
import { onSuccess } from './modal-success'
import { onError } from './modal-error'
import { NftModule } from '@/modules/nft/modules'
import { RequestModule } from '@/modules/request/request'

interface State {
  title?: string
  message?: string
  payload: any
  file: File | null | string
  mode: any
  onClose?: () => any
}

export let onCreateNft = (state: State) => { };
export const ModalCreateNft: FC = () => {
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();
  const [opened, { open, close }] = useDisclosure(false);
  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState<State>()

  onCreateNft = async (s) => {
    setState(s)
    open()
    if (s.payload) {
      try {
        if (s.file instanceof File)
          s.payload.source = await RequestModule.uploadMedia(`/api/v1/tokens/source`, s.file as File, 400, "source", { mode: s.mode });
        const res = await NftModule.create(s.payload);
        if (res) setActiveStep(1);

        const contractMarket = getContracts().ercs.MARKETPLACE;
        const feeMint = await contractMarket.call({ method: 'getFeeMint' })
        let txReceipt = await contractMarket.send({
          method: 'mintNft',
          args: [s.payload.creator, res.data.tokenURI, s.payload.collectionID],
          params: {
            value: feeMint
          }
        });

        if (txReceipt) setActiveStep(2);

        const payloadUpdate = { tokenID: txReceipt.logs[2].args['0'].toString(), contractAddress: getContracts().erc721s.BLOCKCLIP_NFT.address };
        await NftModule.updateAfterMint(res.data.token.id, payloadUpdate);
        await CoinsModule.fetchUserBalance();
        setActiveStep(3);
        onClose();
        onSuccess({ title: 'Tạo Video - NFT thành công', message: '' });
      } catch (error) {
        onClose();
        onError("Upload Video không thành công!");
      }
    }
  }

  const onClose = () => {
    close();
  }

  return (
    <Modal size='lg' radius={8} title={<Title order={3} fw={500}>Tạo NFT Video</Title>} centered opened={opened} onClose={onClose} withCloseButton={false} styles={{
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
        <Stepper.Step label="Upload video" description="Sẽ tốn một chút thời gian để hệ thống xử lý video." loading={activeStep === 0} />
        <Stepper.Step label="Xác nhận khởi tạo trên blockchain" description="Bạn sẽ được yêu cầu trả phí gas và ký xác nhận để tiến hành tạo và lưu Video dưới dạng NFT của bạn trên blockchain." loading={activeStep === 1} />
        <Stepper.Step label="Tạo Video" description="Sẽ tốn một chút thời gian để giao dịch trên blockchain được tạo." loading={activeStep === 2} />
      </Stepper>
    </Modal>
  )
}
