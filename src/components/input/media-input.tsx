import { AppModule } from "@/modules/app/modules";
import { AspectRatio, Box, Center, Group, Input, InputBaseProps, Stack, Text, UnstyledButton, rem, useMantineTheme } from "@mantine/core";
import { FC, useCallback, useState } from "react";
import { AppImage } from "../app/app-image";
import { IconPhoto, IconX } from "@tabler/icons-react";
import Dropzone, { useDropzone, FileWithPath } from "react-dropzone";

interface MediaInputProps extends InputBaseProps {
  onChange: (file: File) => any,
  onRemove: () => any,
  width?: number | string,
  value?: any,
  initialValue?: string
}

export const MediaInput: FC<MediaInputProps> = (props) => {
  const theme = useMantineTheme();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (!file) {
        setFileError('File không hợp lệ');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFileError('Kích thước file không được vượt quá 5MB');
        return;
      }

      setFileError(null);
      setFileName(file.name);
      props.onChange(file);

      // Tạo một đường dẫn URL cho hình ảnh và đặt nó trong state để hiển thị trước
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [props.onChange]);

  const removeImage = (e: any) => {
    setPreviewImage(null);
    setFileName(null);
    props.onRemove();
    e.stopPropagation();
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
    onDrop,
  });

  return <Box>
    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '15px' }}>
      {props.label}
      {props.withAsterisk && <span style={{ color: 'red' }}>*</span>}
    </label>

    <Box style={{
      borderRadius: props.radius,
      overflow: 'hidden',
      border: `1px solid ${theme.colors.gray[3]}`,
    }}>
      <div
        {...getRootProps({
          className: 'dropzone',
        })}
      >
        <input {...getInputProps()} />
        {previewImage && <Group pos="relative">
          <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          <UnstyledButton
            style={{
              position: 'absolute',
              top: rem(8),
              right: rem(8),
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
            onClick={removeImage}
          >
            <IconX color={theme.colors.dark[5]}/>
          </UnstyledButton>
        </Group>}
        {!previewImage && <Group>
          <IconPhoto
            style={{ width: rem(52), height: rem(52) }}
            stroke={1.5}
          />
          <Stack gap={2}>
            <Text size="xl" c={theme.colors.text[1]} inline>
              Kéo hoặc thả ảnh
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Kích thước ảnh không quá 5MB
            </Text>
          </Stack>
        </Group>}
      </div>
    </Box>
    
    {fileName && <Text mt={8} fw={500} size="14px">{fileName}</Text>}
    {fileError && !previewImage && <Text size="sm" c="red">{fileError}</Text>}
  </Box>
}


{/* <Input.Wrapper {...props as any}>
  <Box
    maxSize={5 * 1024 ** 2}
    onDrop={(files) => props.onChange(files[0])}
    accept={[MIME_TYPES.jpeg, MIME_TYPES.png]}
    onReject={(files) => AppModule.onError('This file type is not supported.')}
    styles={{
      root: {
        padding: 5,
        maxWidth: '100%',
        width: props.width,
        borderRadius: props.radius,
        overflow: 'hidden',
        border: `1px solid ${theme.colors.gray[3]}`,
      },
      inner: {
        border: `1px dashed ${theme.colors.gray[3]}`,
        margin: rem(10),
        borderRadius: props.radius,
      }
    }}
  >
    <Group justify="center" gap="xl" mih={props.h} style={{ pointerEvents: 'none' }}>
      {function () {

        //image is dragged
        if (!!props.value && props.value instanceof File) return <img
          src={URL.createObjectURL(props.value)}
          onLoad={() => URL.revokeObjectURL(props.value)}
        />

        return <>
          {function () {
            if (!!props.initialValue && typeof props.initialValue === 'string') {
              //Video
              if (props.initialValue.indexOf('video') !== -1) return <AspectRatio ratio={ratio}>
                <iframe
                  width={props.width}
                  title="video"
                  src={props.initialValue} />
              </AspectRatio>

              //Image
              return <AppImage src={props.initialValue} />
            }

            return <Dropzone.Idle>
              <IconPhoto
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                stroke={1.5}
              />
            </Dropzone.Idle>
          }()}
        </>
      }()}

      <Stack gap={2}>
        <Text size="xl" c={theme.colors.text[1]} inline>
          Kéo hoặc thả ảnh
        </Text>
        <Text size="sm" c="dimmed" inline mt={7}>
          Kích thước ảnh không quá 5MB
        </Text>
      </Stack>
    </Group>
  </Box>
</Input.Wrapper> */}