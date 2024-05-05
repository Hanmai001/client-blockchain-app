import { useResponsive } from "@/modules/app/hooks";
import { useConfig } from "@/modules/configs/context";
import { Text, Container, ActionIcon, Group, rem, useMantineTheme, Image, Divider, AspectRatio, Stack } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import classes from '../../styles/app/AppFooter.module.scss';
import { FC } from "react";


export const AppFooter: FC = () => {
  const theme = useMantineTheme();
  const { isMobile } = useResponsive();
  const { isDarkMode } = useConfig();

  const linksFooter = [
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

  const groups = linksFooter.map((group) => {
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
      <Stack key={group.title} mt={isMobile ? 30 : ''}>
        <Text c={theme.colors.text[0]} fw="bold" style={{
          fontSize: '18px'
        }}>{group.title}</Text>

        <Stack gap={0}>
          {links}
        </Stack>
      </Stack>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner} px={isMobile ? 20 :  200}>
        <div className={classes.logo}>
          <Image src='/images/logo.png' />
          <Text c={theme.colors.text[0]} size="sm" className={classes.description}>
            Beyond Entertainment, Building With Trust Every Frame
          </Text>
        </div>
        {groups}
      </Container>

      <Container className={classes.afterFooter} px={isMobile ? 20 : 100}>
        <Text c={theme.colors.text[0]} size="sm">
          © 2023 - Copyright - BlockClip
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