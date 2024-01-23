import { useAccount } from "@/modules/account/context";
import { Avatar, AvatarProps, Indicator, useMantineTheme } from "@mantine/core"
import { FC } from "react"
import classes from '../styles/app/AppHeader.module.scss';

interface AppAvatarProps extends AvatarProps {
  ref?: any
}
export const AccountAvatar: FC<AppAvatarProps> = (props) => {
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
  >
    {props.children}
  </Avatar>

}