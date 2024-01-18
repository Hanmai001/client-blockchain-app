import { useConfig } from '@/modules/configs/context';
import { Stack, Text, useMantineTheme } from '@mantine/core'
import { IconHourglassEmpty } from '@tabler/icons-react';
import { CSSProperties, FC } from 'react'

interface Props {
  message?: string,
  style?: CSSProperties
}

export const EmptyMessage: FC<Props> = (props) => {
  const theme = useMantineTheme();
  const { isDarkMode } = useConfig();

  return (
    <Stack
      align="center"
      justify="center"
      p={20}
      gap={5}
      style={props.style}
    >
      <IconHourglassEmpty style={{
        width: '35px',
        opacity: 0.5,
      }} />
      <Text size="xs" style={{ opacity: 0.5, }}>{props.message || 'Chưa có dữ liệu:('}</Text>
    </Stack>
  )
}