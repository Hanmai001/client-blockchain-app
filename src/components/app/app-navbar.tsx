import { useAccount } from "@/modules/account/context";
import { useResponsive } from "@/modules/app/hooks";
import { Tooltip } from "@mantine/core";
import { IconBuildingStore, IconCameraBolt, IconFriends, IconLogout, IconUser } from "@tabler/icons-react";
import { FC, useState } from "react";
import { AppRoutes } from "../../../app-router";
import classes from "../../styles/app/AppNavBar.module.scss";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { useBlockChain } from "@/share/blockchain/context";

export const AppNavBar: FC = () => {
  const account = useAccount();
  const blockchain = useBlockChain();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { link: AppRoutes.root, label: 'Cửa hàng', icon: IconBuildingStore },
    { link: `${AppRoutes.user.profile}/${blockchain.wallet}`, label: 'Hồ sơ của bạn', icon: IconUser },
    { link: AppRoutes.friends, label: 'Bạn bè có gì mới', icon: IconFriends },
  ]

  const links = navLinks.map((item) => (
    <a
      className={classes.link}
      data-active={pathname === item.link || undefined}
      // href={item.link}
      key={item.label}
      onClick={(event) => {
        router.push(item.link);
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