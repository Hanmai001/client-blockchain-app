import { useAccount } from "@/modules/account/context";
import { Avatar, AvatarProps, Indicator, useMantineTheme } from "@mantine/core"
import { FC } from "react"
import classes from '../styles/app/AppHeader.module.scss';

export const AccountAvatar: FC<AvatarProps> = (props) => {
  const theme = useMantineTheme();

  return <Avatar
    radius={30}
    src={props.src ? props.src : '/images/default/avatar.png'}
    size={props.size}
    style={{
      ...(props.style),
      background: `${theme.colors.primary[5]}30`,
    }}
    className={classes.avatar}
  />

}