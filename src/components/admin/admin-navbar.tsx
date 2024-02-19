import React, { FC, useState } from "react";
import { AppRoutes } from "../../../app-router";
import { IconChevronRight, IconDashboard, IconGauge, IconNotes, IconUsersGroup } from "@tabler/icons-react";
import { useAccount } from "@/modules/account/context";
import { useBlockChain } from "@/share/blockchain/context";
import { useResponsive } from "@/modules/app/hooks";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { Box, Button, Collapse, Group, Text, ThemeIcon, Tooltip, UnstyledButton, rem } from "@mantine/core";
import classes from '../../styles/admin/AdminNavBar.module.scss';

export const AdminNavbar: FC = () => {
  const navLinks = [
    { label: 'Dashboard', icon: IconGauge, link: '/admin' },
    {
      label: 'Quản lý',
      icon: IconNotes,
      initiallyOpened: true,
      links: [
        { label: 'Người dùng', icon: IconUsersGroup, link: '#' },
      ],
    },
  ]

  // const links = navLinks.map((item) => (
  //   <a
  //     // className={classes.link}
  //     data-active={pathname === item.link || undefined}
  //     // href={item.link}
  //     key={item.label}
  //     onClick={(event) => {
  //       router.push(item.link);
  //     }}
  //   >
  //     <Tooltip label={item.label} disabled={isDesktop ? true : false} position="right">
  //       <item.icon
  //       // className={classes.linkIcon} 
  //       />
  //     </Tooltip>
  //     {isDesktop && <span>{item.label}</span>}
  //   </a>
  // ));

  return <nav>
    {navLinks.map((v, k) => <LinksGroup key={k} {...v} />)}
  </nav>
}

interface LinksGroupProps {
  icon: FC<any>;
  label: string;
  link?: string;
  initiallyOpened?: boolean;
  links?: { label: string, icon: FC<any>, link: string }[];
}

export const LinksGroup: FC<LinksGroupProps> = (props) => {
  const hasLinks = Array.isArray(props.links);
  const [opened, setOpened] = useState(props.initiallyOpened || false);
  const router = useRouter();
  const pathname = usePathname();

  const items = (Array.isArray(props.links) ? props.links : []).map((link) => (
    <Button<'a'>
      component="a"
      className={classes.linkGroup}
      href={link.link}
      leftSection={<link.icon />}
      key={link.label}
      variant="transparent"
      onClick={(e) => router.push(link.link)}
    >
      {link.label}
    </Button>
  ));

  return <>
    <UnstyledButton onClick={() => setOpened((o) => !o)} h={70} className={classes.control}>
      <Group w={'100%'} h={'100%'} justify="space-between" gap={0}>
        <Button<'a'>
          data-active={pathname === props.link || undefined}
          component="a"
          className={classes.link}
          rightSection={hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(90deg)' : 'none',
              }}
            />
          )}
          key={props.label}
          variant="transparent"
          onClick={(e) => router.push(props.link || '')}
          styles={{
            inner: {
              display: "flex",
              justifyContent: "space-between"
            }
          }}
        >
          <ThemeIcon mr='md' variant="light" size={30}>
            <props.icon style={{ width: rem(18), height: rem(18) }} />
          </ThemeIcon>
          {props.label}
        </Button>
      </Group>
    </UnstyledButton>

    {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
  </>
}