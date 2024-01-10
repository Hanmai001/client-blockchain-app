import { useAccount } from "@/modules/account/context"
import { Avatar, AvatarProps, Indicator, useMantineTheme } from "@mantine/core"
import { FC } from "react"

export const AccountAvatar: FC<AvatarProps> = (props) => {
  const theme = useMantineTheme();

  return <Indicator
    color={theme.colors.primary[5]}
    withBorder
  >
    <Avatar
      radius={30}
      src={props.src}
      size={props.size}
      style={{
        ...(props.style),
        border: `1.5px solid ${theme.colors.primary[5]}30`,
        background: `${theme.colors.primary[5]}30`,
      }}
    />
  </Indicator>

}