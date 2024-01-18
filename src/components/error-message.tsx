import { Center, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconBug, IconReload } from '@tabler/icons-react';
import { CSSProperties, FC } from 'react';
import { AppButton } from './app/app-button';

interface Props {
  message?: string,
  error?: any,
  onRetry?: (e: any) => any,
  icon?: React.ReactNode,
  style?: CSSProperties
}

export const ErrorMessage: FC<Props> = (props) => {
  const theme = useMantineTheme();

  return (
    <Center maw={"100%"} style={props.style}>
      <Stack
        gap={0} py={15} px={20} align="center" justify="center"
        style={{
          background: theme.colors.warning[6] + '20',
          borderRadius: theme.radius.md,
        }}
        m={10}
      >
        {!!props.icon ? props.icon : <IconBug color={theme.colors.warning[6]} size={30} />}
        {function () {
          if (props.message) return <Text c="warning" style={{textAlign: 'center'}}>{props.message}</Text>
          if (props.error) {
            let message = ''
            if (typeof props.error === 'string') message = props.error
            if (typeof props.error === 'object') message = props.error.message

            return <Stack gap={0}>
              <Text style={{ textAlign: 'center' }} c="warning" fw="bold">{message.replaceAll("_", " ")}</Text>
              {Object.keys(props.error.errors).map((key, index) => <Text
                key={index}
                size="sm"
                style={{ textAlign: 'center' }}
                c='warning'
                fw='bold'
              >
                {props.error.errors[key].replaceAll("_", " ")}
              </Text>)}
            </Stack>
          }
          return <Text style={{ textAlign: 'center' }} c="warning">Không nhận diện được lỗi:(</Text>
        }()}

        {!!props.onRetry && <Group justify='center' mt={20}>
          <AppButton async leftSection={<IconReload />} radius="lg" color='warning' onClick={(e: any) => props.onRetry && props.onRetry(e)}>
            Vui lòng thử lại
          </AppButton>
        </Group>}
      </Stack>
    </Center >
  )
}