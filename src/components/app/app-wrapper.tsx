import { AppShell, Box, useMantineTheme } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import { AppHeader } from "./app-header";
import { AppNavBar } from "./app-navbar";
import { useDisclosure } from "@mantine/hooks";
import { AppTitle } from "./app-title";
import { AppFooter } from "./app-footer";

export const AppWrapper: FC<PropsWithChildren> = (props) => {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      // header={{ height: 70 }}
      navbar={{ width: { sm: 70, md: 240, lg: 240 }, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      styles={{
      navbar: {
        marginTop: '74px'
        // [`@media (min-width: ${theme.breakpoints.md})`]: {
        //   width: '240px',
        // },
        // [`@media (max-width: ${theme.breakpoints.md})`]: {
        //   width: '70px',
        // },
      },
      footer: {
        display: "block",
        position: "relative",
        marginTop: "200px",
      },
    }}
    >
      <AppTitle />
      <AppShell.Header style={{ zIndex: 99 }}>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Navbar style={{ zIndex: 99 }}>
        <AppNavBar />
      </AppShell.Navbar>

      <AppShell.Main style={{ zIndex: 99 }}>
        {props.children}
        {/* <AppFooter /> */}
      </AppShell.Main>

      <AppShell.Footer>
        <AppFooter />
      </AppShell.Footer>
    </AppShell>
  )
}