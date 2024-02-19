import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, PropsWithChildren } from "react";
import { AppTitle } from "../app/app-title";
import { AdminHeader } from "./admin-header";
import { AdminNavbar } from "./admin-navbar";

export const AdminWrapper: FC<PropsWithChildren> = (props) => {
  const [opened, { toggle }] = useDisclosure();
  
  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: { sm: 70, md: 240, lg: 240 }, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      styles={{
        navbar: {
          // [`@media (min-width: ${theme.breakpoints.md})`]: {
          //   width: '240px',
          // },
          // [`@media (max-width: ${theme.breakpoints.md})`]: {
          //   width: '70px',
          // },
        },
        header: {
          // border: 'none'
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
        <AdminHeader />
      </AppShell.Header>

      <AppShell.Navbar style={{ zIndex: 99 }}>
        <AdminNavbar />
      </AppShell.Navbar>

      <AppShell.Main style={{ zIndex: 99 }}>
        {props.children}
      </AppShell.Main>

      <AppShell.Footer>
      </AppShell.Footer>
    </AppShell>
  )
}