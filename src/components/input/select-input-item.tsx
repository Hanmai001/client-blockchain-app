import { Group, Image, Text } from "@mantine/core";
import { forwardRef } from "react";

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
}

export const SelectInputItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group gap={5} style={{flexWrap: "nowrap"}}>
        <Image src={image} width={20} height={20} />
        <Text fw="bold" size="sm">{label}</Text>
      </Group>
    </div>
  )
);