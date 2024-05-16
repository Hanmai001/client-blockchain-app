import { ActionIcon, Stack, useMantineTheme } from "@mantine/core";
import { IconChevronsUp } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { AppCreateButton } from "./app-create-button";

export const AppConnectedButtons: FC = () => {
  const theme = useMantineTheme();
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return <Stack id="app-connected-btns" gap={4}>
    <ActionIcon
      onClick={scrollToTop}
      color={theme.colors.primary[4]}
      id="btn-scroll-top"
      className={showScrollButton ? 'show' : ''}
    >
      <IconChevronsUp />
    </ActionIcon>
    <AppCreateButton />
  </Stack>
}