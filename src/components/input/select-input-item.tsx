import { Group, Image, Text, useMantineTheme } from "@mantine/core";
import { forwardRef } from "react";

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  width?: string;
  height?: string;
  fontsize?: string
}

export const SelectInputItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, width, height, fontsize, ...others }: ItemProps, ref) => {
    const theme = useMantineTheme();

    return (
      <div ref={ref} {...others}>
        <Group gap="lg" bg={theme.colors.gray[1]} p={15} style={{
          flexWrap: "nowrap",
          borderRadius: '10px',
          cursor: "pointer"
        }}>
          <Image src={image} width={width} height={height} radius={12} />
          <Text fw={500} size={fontsize} c={theme.colors.text[1]}>{label}</Text>
        </Group>
      </div>
    )
  }
);