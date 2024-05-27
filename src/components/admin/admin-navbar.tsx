import { Box, Button, Collapse, Divider, Group, Image, Stack, ThemeIcon, UnstyledButton, rem, useMantineTheme } from "@mantine/core";
import { IconBrandStorytel, IconBuilding, IconChevronRight, IconFlag, IconGauge, IconMenu2, IconNotes, IconUsersGroup, IconVideo } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { AppRoutes } from "../../../app-router";
import classes from '../../styles/admin/AdminNavBar.module.scss';

export const AdminNavbar: FC = () => {
  const theme = useMantineTheme();

  const navLinks = [
    { label: 'Dashboard', icon: IconGauge, link: '/admin' },
    {
      label: 'Quản lý',
      icon: IconNotes,
      initiallyOpened: true,
      links: [
        { label: 'Người dùng', icon: IconUsersGroup, link: AppRoutes.admin.users },
        { label: 'NFT', icon: IconVideo, link: AppRoutes.admin.nfts },
        { label: 'Bộ sưu tập', icon: IconBrandStorytel, link: AppRoutes.admin.collections },
        { label: 'Báo cáo', icon: IconFlag, link: AppRoutes.admin.reports },
      ],
    },
    { label: 'Hệ thống', icon: IconBuilding, link: AppRoutes.admin.system },
  ]

  return <nav>
    <Stack p={10} gap="xs">
      <Group justify="space-between">
        <Link href={'/'}>
          <Image className={classes.logo} src='/images/logo.png' />
        </Link>

        <IconMenu2 color={theme.colors.text[1]} stroke={1.5} />
      </Group>

      <Divider color="none" my={5} />

      {navLinks.map((v, k) => <LinksGroup key={k} {...v} />)}
    </Stack>
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
  const theme = useMantineTheme();
  const isActive = hasLinks && props.links?.some(link => pathname === link.link);

  const items = (Array.isArray(props.links) ? props.links : []).map((link) => (
    <Button<'a'>
      component="a"
      className={classes.linkGroup}
      color={theme.colors.text[1]}
      leftSection={<link.icon style={{ width: rem(18), height: rem(18) }} />}
      key={link.label}
      onClick={() => router.push(link.link)}
      variant="transparent"
      styles={{
        inner: {
          justifyContent: 'flex-start'
        }
      }}
    >
      {link.label}
    </Button>
  ));

  return <Box>
    <UnstyledButton onClick={() => setOpened((o) => !o)} h={70} className={classes.control}>
      <Group w={'100%'} h={'100%'} justify="space-between" gap={0}>
        <Button<'a'>
          color={theme.colors.text[1]}
          data-active={pathname === props.link || isActive || undefined}
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
          <ThemeIcon mr='md' variant="transparent" size={30}>
            <props.icon style={{ width: rem(18), height: rem(18) }} />
          </ThemeIcon>
          {props.label}
        </Button>
      </Group>
    </UnstyledButton>

    {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
  </Box>
}