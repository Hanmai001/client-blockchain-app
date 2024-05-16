import { Stack, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { AppRoutes } from "../../../app-router";


export const AppCreateButton: FC = () => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [clicked, setClicked] = useState(false);

  return (
    <>
      <UnstyledButton onClick={() => setClicked(!clicked)} style={{
        margin: theme.spacing.md,
        borderRadius: '50%',
        width: "74px",
        height: "74px",
        backgroundColor: theme.colors.primary[5],
        color: theme.colors.text[0],
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }} className="app-create-button">
        <IconUpload size={36} stroke={2} />
      </UnstyledButton>

      {<Stack style={{
        position: "fixed",
        zIndex: clicked ? 101 : -1,
        right: 130,
        bottom: 0,
        opacity: clicked ? 1 : 0,
        //backgroundColor: `rgba(0, 0, 0, 0.6)`,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        transition: `0.5s ease`
      }}>
        <Link href={`${AppRoutes.collection.create}`}>
          <UnstyledButton className={`create-buttons ${clicked ? 'app-button-clicked' : 'app-button-unclicked'}`} style={{
            width: "250px",
            height: "70px",
            borderRadius: "10px",
            backgroundColor: theme.colors.primary[0],
            textAlign: "end",
          }}>
            <Text mr={10} c={theme.colors.primary[5]} fw="bold" size="sm">Tạo bộ sưu tập mới</Text>
          </UnstyledButton>
        </Link>

        <Link href={`${AppRoutes.nft.create}`}>
          <UnstyledButton className={`create-buttons ${clicked ? 'app-button-clicked' : 'app-button-unclicked'}`} style={{
            width: "250px",
            height: "70px",
            borderRadius: "10px",
            backgroundColor: theme.colors.primary[0],
            textAlign: "end",
            marginBottom: "10px"
          }}>

            <Text mr={10} c={theme.colors.primary[5]} fw="bold" size="sm">Tạo Video</Text>
          </UnstyledButton>
        </Link>

      </Stack>}
    </>
  )
}