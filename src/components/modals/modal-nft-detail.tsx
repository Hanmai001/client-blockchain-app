import { Nft } from "@/modules/nft/types";
import { DateTimeUtils } from "@/share/utils";
import { AspectRatio, Group, Modal, Spoiler, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, useEffect, useState } from "react";
import { ItemMode } from "../../../types";
import { LicenseModule } from "@/modules/license/modules";
import { onError } from "./modal-error";

interface State {
  token: Nft,
}

export let onViewNft = (state: State) => undefined;
export const ModalNftDetail: FC = () => {
  const theme = useMantineTheme();
  const [state, setState] = useState<State>();
  const [opened, { open, close }] = useDisclosure(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  onViewNft = (state) => {
    setState(state);
    open();
  }


  const decryptVideo = async () => {
    try {
      if (state && state.token.mode.toString() === ItemMode.COMMERCIAL) {
        const license = await LicenseModule.getLicense({ tokenID: state.token.tokenID });
        // console.log(license)
        if (license) {
          const videoData = await LicenseModule.decrypt(license, state.token.source);
          if (videoData) {
            const blob = new Blob([videoData], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);

            // Giải phóng URL khi component unmounts hoặc khi decryptedVideo thay đổi
            return () => URL.revokeObjectURL(url);
          }
        }
      }
    } catch (error) {
      onError(error)
    }
  }

  const onClose = () => {
    close();
  }

  useEffect(() => {
    decryptVideo();
  }, [state?.token])

  return <Modal title="Chi tiết" size="lg" centered opened={opened} onClose={onClose} styles={{
    overlay: {
      zIndex: 101
    },
    title: {
      fontWeight: 500,
      fontSize: '24px',
      color: theme.colors.text[1]
    }
  }}>
    {function () {
      if (state?.token) return <Stack gap={4}>
        <AspectRatio
          my={10}
          ratio={100 / 120}
          style={{
            overflow: 'hidden',
            borderRadius: theme.radius.md,
            position: 'relative'
          }}>
          <video
            controls
            src={videoUrl || state.token.source}
            style={{ display: 'block', objectFit: 'contain' }}
          />
        </AspectRatio>

        <Title c={theme.colors.text[1]} order={4}>{state.token.title}</Title>

        <Spoiler c={theme.colors.text[1]} maxHeight={50} showLabel="Xem thêm" hideLabel="Ẩn" styles={{
          control: {
            color: theme.colors.primary[5]
          },
          content: {
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }
        }}>
          Mô tả: {state.token.description}
        </Spoiler>

        <Group justify="space-between">
          <Text size="14px" c="dimmed">Tạo vào {DateTimeUtils.formatToShow(state.token.createdAt)}</Text>
          <Text size="14px" c="dimmed">Cập nhật lần cuối {DateTimeUtils.formatToShow(state.token.updatedAt)}</Text>
        </Group>
      </Stack>
    }()}
  </Modal>
}