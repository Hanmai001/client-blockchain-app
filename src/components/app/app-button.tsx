import { Button, ButtonProps, useMantineTheme } from "@mantine/core";
import React, { FC, useState } from "react";

interface IButtonProps extends ButtonProps {
  onClick?: (e: any) => any
  async?: boolean
  height?: string | number
  width?: string | number
  type?: string
}

export const AppButton: FC<IButtonProps> = (props) => {
  const theme = useMantineTheme();
  const [isLoading, setIsLoading] = useState(props.loading || false);

  const onClick = async (event: any) => {
    if (!props.onClick) return;
    if (!props.async) return props.onClick(event);
    setIsLoading(true);
    try {
      await props.onClick(event);
    } catch (error) {
      throw error
    }
    setIsLoading(false);
  }

  return (
    <Button
      {...props}
      loading={isLoading}
      disabled={isLoading || props.disabled}
      onClick={onClick}
      styles={{
        ...props.style,
        root: {
          height: props.height,
          width: props.width,
        },
        inner: {
          ...(props.style as any)?.inner
        }
      }}
    >
      {props.children}
    </Button>
  )
}

AppButton.defaultProps = {
  variant: 'filled'
}

