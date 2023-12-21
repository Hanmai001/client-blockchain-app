import { useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks";

export const useResponsive = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`, false);
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`, false);

  return {
    isMobile, 
    isTablet,
    isDesktop: !isMobile && !isTablet
  }
}