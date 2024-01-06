import { FC, PropsWithChildren, createContext, useContext } from "react";
import { DefaultMantineColor, useMantineColorScheme } from '@mantine/core';
import { Configs, GetConfig } from "./type";
import { configs } from "./envs";
import { AppEnv } from "../../../types";

export const PRIMARY_COLOR: DefaultMantineColor = 'dark';
export const PRIMARY_DARK_COLOR: DefaultMantineColor = 'primary';

export const ENV = `${AppEnv.PRODUCTION}`.toUpperCase() as AppEnv;
export const appConfigs = configs[ENV];
export const getConfig: GetConfig = (key: keyof Configs) => appConfigs[key];

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