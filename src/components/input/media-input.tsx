import { AppModule } from "@/modules/app/modules";
import { AspectRatio, Box, Card, Center, Image, Input, InputBaseProps, Stack, Text, UnstyledButton, rem, useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconX } from "@tabler/icons-react";
import { FC, useCallback, useMemo } from "react";
import { OnErrorModal } from "../modals/modal-error";

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

  // Memoize the file URL creation to avoid re-generating it on every render
  const fileUrl = useMemo(() => {
    if (props.value instanceof File) {
      return URL.createObjectURL(props.value);
    }
    return props.value;
  }, [props.value]);

  // Clean up the object URL when the component unmounts or when the file changes
  useMemo(() => {
    if ((props.value as any) instanceof File) {
      return () => URL.revokeObjectURL(fileUrl as string);
    }
  }, [fileUrl, props.value]);

  // Memoize event handlers to avoid re-creating them on every render
  const handleDrop = useCallback((files: File[]) => {
    const file = files[0];
    const allowedSize = props.acceptance === 'image' ? 20 * 1024 ** 2 : 50 * 1024 ** 2;
    if (file.size > allowedSize) {
      OnErrorModal({ title: '', error: 'Kích thước file không hợp lệ' });
      return;
    }

    if (props.acceptance === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 120) { // Check if the duration exceeds 2 minutes
          OnErrorModal({ title: '', error: 'Độ dài video không được vượt quá 2 phút' });
        } else {
          props.onChange(file);
        }
        URL.revokeObjectURL(video.src); // Clean up URL after use
      };
      video.src = URL.createObjectURL(file);
    } else {
      props.onChange(file);
    }
  }, [props.acceptance, props.onChange]);

  const removeFile = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    props.onRemove();
    e.stopPropagation();
  }, [props.onRemove]);

  return (
    <Input.Wrapper
      {...props as any}
    >
      <Card withBorder radius={8} shadow="none" style={{ position: 'relative' }}>
        <Dropzone
          maxFiles={1}
          onDrop={handleDrop}
          accept={props.acceptance === 'image' ? IMAGE_MIME_TYPE : ['video/mp4']}
          onReject={(files) => OnErrorModal({ title: '', error: 'File không hợp lệ' })}
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
          {fileUrl ? (
            props.acceptance === 'video' ? (
              <video
                src={fileUrl}
                controls
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
              />
            ) : (
              <AspectRatio ratio={props.ratio ? props.ratio : 1}>
                <Image
                  src={fileUrl}
                  radius={8}
                />
              </AspectRatio>
            )
          ) : (
            <Center h={'100%'}>
              <Stack gap={0} align="center">
                <Text size="xl" inline>
                  Kéo hoặc thả file
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Kích thước không quá {props.acceptance === 'video' ? '50MB' : '5MB'}
                </Text>
              </Stack>
            </Center>
          )}
        </Dropzone>

        {props.value && (
          <UnstyledButton
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
              alignItems: 'center'
            }}
            onClick={removeFile}
          >
            <IconX color={theme.colors.dark[4]} stroke={1.5} />
          </UnstyledButton>
        )}
      </Card>
    </Input.Wrapper>
  );
}