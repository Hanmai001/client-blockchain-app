import { useResponsive } from "@/modules/app/hooks";
import { useConfig } from "@/modules/configs/context";
import { Text, Container, ActionIcon, Group, rem, useMantineTheme, Image } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import classes from '../../styles/app/AppFooter.module.scss';
import { FC } from "react";


export const AppFooter: FC = () => {
  const theme = useMantineTheme();
  const { isMobile } = useResponsive();
  const { isDarkMode } = useConfig();

  const data = [
    {
      title: 'Về chúng tôi',
      links: [
        { label: 'Tính năng', link: '#' },
        { label: 'Giá cả', link: '#' },
        { label: 'Hỗ trợ khách hàng', link: '#' },
        { label: 'Forums', link: '#' },
      ],
    },
    {
      title: 'Sản phẩm',
      links: [
        { label: 'Đóng góp', link: '#' },
        { label: 'Quảng bá hình ảnh', link: '#' },
        { label: 'Phát hành', link: '#' },
      ],
    },
    {
      title: 'Cộng đồng',
      links: [
        { label: 'Discord', link: '#' },
        { label: 'Twitter', link: '#' },
        { label: 'Facebook', link: '#' },
        { label: 'Email', link: '#' },
      ],
    },
  ];

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<'a'>
        c={theme.colors.text[0]}
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text c={theme.colors.text[0]} className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Image src='/images/logo.png'/>
          <Text c={theme.colors.text[0]} size="sm" className={classes.description}>
            Beyond Entertainment, Building With Trust Every Frame
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      
      <Container className={classes.afterFooter}>
        <Text c={theme.colors.text[0]} size="sm">
          © 2023 BlockClip
        </Text>

        <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color={theme.colors.text[0]} variant="subtle">
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color={theme.colors.text[0]} variant="subtle">
            <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color={theme.colors.text[0]} variant="subtle">
            <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}