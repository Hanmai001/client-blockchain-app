import { Button, Image, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  const theme = useMantineTheme();

  return <Stack m='auto' w={400} align="center" mt={100}>
    <Image src="/images/icons/error.png" w={128} />
    <Title c={theme.colors.text[1]}>404</Title>
    <Text c={theme.colors.gray[7]}>Trang bạn đang truy cập không tồn tại</Text>
    <Button
      radius={4}
      onClick={() => router.push('/')}
      color={theme.colors.primary[5]}
      size="md"
    >Trang chủ</Button>
  </Stack>
}