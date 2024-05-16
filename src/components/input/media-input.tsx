import { AppModule } from "@/modules/app/modules";
import { AspectRatio, Box, Card, Center, Image, Input, InputBaseProps, Text, UnstyledButton, rem, useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconX } from "@tabler/icons-react";
import { FC } from "react";

interface MediaInputsProps extends InputBaseProps {
  value?: (string | File),
  onChange: (file: (string | File)) => any,
  onRemove: () => any,
  width?: number | string,
  height?: number | string,
  ratio?: number,
  initialValue?: string,
  acceptance: 'image' | 'video',
}
export const MediaInput: FC<MediaInputsProps> = (props) => {
  const theme = useMantineTheme();
  const handleDrop = (files: File[]) => {
    props.onChange(files[0]);
  }

  const removeFile = (e: any) => {
    e.preventDefault();
    props.onRemove();
    e.stopPropagation();
  };

  return <Input.Wrapper
    {...props as any}
  >
    <Card withBorder radius={8} shadow="none">
      <Dropzone
        maxFiles={1}
        onDrop={handleDrop}
        accept={props.acceptance === 'image' ? IMAGE_MIME_TYPE : ['video/mp4']}
        onReject={(files) => AppModule.onError('File không hợp lệ!')}
        maxSize={props.acceptance === 'image' ? 20 * 1024 ** 2 : 5 * 1024 ** 2}
        styles={{
          root: {
            maxWidth: '100%',
            width: props.width,
          },
          inner: {
            width: '100%',
            height: props.height,
            overflow: 'hidden',
            borderRadius: '8px',
          }
        }}
      >
        {function () {
          if (props.value && props.value instanceof File) {
            const fileUrl = URL.createObjectURL(props.value);
            return props.acceptance === 'video' ? (
              <video
                src={fileUrl}
                controls
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                onLoad={() => URL.revokeObjectURL(fileUrl)}
              />
            ) : (
              <AspectRatio ratio={props.ratio ? props.ratio : 1}>
                <Image
                  src={fileUrl}
                  radius={8}
                  onLoad={() => URL.revokeObjectURL(fileUrl)}
                />
              </AspectRatio>
            );
          }

          else if (props.value) return props.acceptance === 'video' ? (
            <video
              src={props.value}
              controls
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
            />
          ) : (
            <AspectRatio ratio={props.ratio ? props.ratio : 1}>
              <Image
                src={props.value}
                radius={8}
              />
            </AspectRatio>
          );

          return <Center h={'100%'}>
            <div>
              <Text size="xl" inline>
                Kéo hoặc thả file
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Kích thước không quá {props.acceptance === 'image' ? '20MB' : '5MB'}
              </Text>
            </div>
          </Center>
        }()}
      </Dropzone>

      {props.value && <UnstyledButton
        style={{
          position: 'absolute',
          top: rem(40),
          right: rem(40),
          zIndex: 10,
          background: theme.colors.gray[0],
          opacity: 0.6,
          borderRadius: '50%',
          padding: rem(4),
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          flexWrap: 'wrap'
        }}
        onClick={removeFile}
      >
        <IconX color={theme.colors.dark[4]} stroke={1.5} />
      </UnstyledButton>}
    </Card>
  </Input.Wrapper>
}