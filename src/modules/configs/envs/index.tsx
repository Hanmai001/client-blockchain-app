import { FC, PropsWithChildren, createContext, useContext } from "react";
import { DefaultMantineColor, useMantineColorScheme } from '@mantine/core';

export const PRIMARY_COLOR: DefaultMantineColor = 'dark'
export const PRIMARY_DARK_COLOR: DefaultMantineColor = 'primary'

export const ConfigsContext = createContext<any>({} as any);

export const ConfigsProvider: FC<PropsWithChildren> = (props) => {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();

  return (
    <ConfigsContext.Provider
      value={{
        colorScheme,
        isDarkMode: colorScheme === 'dark',
        toggleColorScheme
      }}
    >
      {props.children}
    </ConfigsContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigsContext);