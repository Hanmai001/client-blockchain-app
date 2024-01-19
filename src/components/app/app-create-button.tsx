import { Text, Stack, UnstyledButton, useMantineTheme, Group } from "@mantine/core";
import { useClickOutside, useHover } from "@mantine/hooks";
import { IconCategory, IconUpload } from "@tabler/icons-react";
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
        position: "fixed",
        zIndex: 100,
        width: "84px",
        height: "84px",
        bottom: 0,
        right: 12,
        backgroundColor: theme.colors.primary[5],
        color: theme.colors.text[0],
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        alignContent: "center"
      }} className="app-create-button">
        <IconUpload size={36} stroke={2} />
      </UnstyledButton>

      {<Stack style={{
        position: "fixed",
        zIndex: clicked ? 99 : -1,
        right: 0,
        top: 0,
        bottom: 0,
        left: 0,
        opacity: clicked ? 1 : 0,
        //backgroundColor: `rgba(0, 0, 0, 0.6)`,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        transition: `0.5s ease`
      }}>
        <UnstyledButton onClick={() => router.push(AppRoutes.collection.create)} className={`create-buttons ${clicked ? 'app-button-clicked' : 'app-button-unclicked'}`} style={{
          width: "250px",
          height: "70px",
          borderRadius: "10px",
          backgroundColor: theme.colors.primary[0],
          textAlign: "end",
        }}>
          <Text mr={10} c={theme.colors.primary[5]} fw="bold" size="sm">Tạo bộ sưu tập mới</Text>
        </UnstyledButton>

        <UnstyledButton onClick={() => router.push(AppRoutes.nft.create)} className={`create-buttons ${clicked ? 'app-button-clicked' : 'app-button-unclicked'}`} style={{
          width: "250px",
          height: "70px",
          borderRadius: "10px",
          backgroundColor: theme.colors.primary[0],
          textAlign: "end",
          marginBottom: "10px"
        }}>
          
          <Text mr={10} c={theme.colors.primary[5]} fw="bold" size="sm">Tạo Video</Text>
        </UnstyledButton>
      </Stack>}
    </>
  )
}