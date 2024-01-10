import { IconBuildingStore, IconCameraBolt, IconFriends, IconLogout, IconSwitchHorizontal } from "@tabler/icons-react";
import { FC, useState } from "react";
import classes from "../../styles/app/AppNavBar.module.scss";
import { Group, Text, Tooltip } from "@mantine/core";
import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";

const navLinks = [
  { link: '', label: 'Cửa hàng', icon: IconBuildingStore },
  { link: '', label: 'Bộ sưu tập của bạn', icon: IconCameraBolt },
  { link: '', label: 'Bạn bè', icon: IconFriends },
]

export const AppNavBar: FC = () => {
  const [active, setActive] = useState("Cửa hàng");
  const account = useAccount();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const links = navLinks.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <Tooltip label={item.label} disabled={isDesktop ? true : false} position="right">
        <item.icon className={classes.linkIcon} />
      </Tooltip>
      {isDesktop && <span>{item.label}</span>}
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => account.signOut()}>
          <Tooltip label="Đăng xuất" disabled={isDesktop ? true : false} position="right">
            <IconLogout className={classes.linkIcon} />
          </Tooltip>
          {isDesktop && <span>Đăng xuất</span>}
        </a>
      </div>
    </nav>
  )
} 