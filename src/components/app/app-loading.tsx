import { Box, LoadingOverlay, useMantineTheme, Text, Stack, Card } from "@mantine/core";
import { FC } from "react";

export const AppLoading: FC<{ visible: boolean }> = (props) => {
  const theme = useMantineTheme();

  return (
    <Box style={{
      position: 'fixed',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: 999
    }}>
      <LoadingOverlay
        visible={props.visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", backgroundOpacity: 0.3, color: theme.black }}
        loaderProps={{ color: theme.colors.primary[5], type: 'dots', children: <AppLoader /> }}
      />
    </Box>
  )
}

export const AppLoader: FC = () => {
  const theme = useMantineTheme();

  return (
    <Card radius={10} p={theme.spacing.lg} w={300}>
      <Stack gap={0} justify="center" align="center">
        <Text fw={500} c={theme.colors.text[1]}>Hệ thống đang xử lý</Text>
        <Text mb={20} fw={500} c={theme.colors.text[1]}>Bạn chờ chút nhé</Text>
        <div className="loader" ></div >
      </Stack>
    </Card>
  )
}