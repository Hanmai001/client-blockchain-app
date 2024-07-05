import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, PropsWithChildren } from "react";
import { AppTitle } from "../app/app-title";
import { AdminHeader } from "./admin-header";
import { AdminNavbar } from "./admin-navbar";
import { AdminBoundaryWallet } from "./admin-boudary-wallet";

export const AdminWrapper: FC<PropsWithChildren> = (props) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AdminBoundaryWallet>
      <AppShell
        // header={{ height: 70 }}
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
          footer: {
            display: "block",
            position: "relative",
            marginTop: "200px",
          },
        }}
      >
        <AppTitle />
        <AppShell.Header zIndex={98}>
          <AdminHeader />
        </AppShell.Header>

        <AppShell.Navbar zIndex={99}>
          <AdminNavbar />
        </AppShell.Navbar>

        <AppShell.Main mt={70} bg="#f8f9fe">
          {props.children}
        </AppShell.Main>
      </AppShell>
    </AdminBoundaryWallet>
  )
}