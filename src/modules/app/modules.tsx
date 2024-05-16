import { notifications } from '@mantine/notifications';
import { IconBellRinging2, IconCheck, IconX } from '@tabler/icons-react';
import themeColors from './theme-colors.json';

export class AppModule {
  static onInfo = (msg: string) => {
    return notifications.show({
      title: 'Information',
      message: msg,
      color: 'info',
      autoClose: 5000,
      icon: <IconBellRinging2 />,
    });
  }

  static onError = (msg?: string) => {
    return notifications.show({
      title: "Thất bại",
      message: msg || "Đã xảy ra lỗi, vui lòng thử lại sau!",
      color: 'red',
      autoClose: 2000,
      icon: <IconX />
    });
  }
  static onSuccess = (msg: string) => {
    return notifications.show({
      title: 'Successful!',
      message: msg,
      color: 'success',
      autoClose: 2000,
      icon: <IconCheck />,
    });
  }

  static getThemeColors() {
    let colors = {
      dark: [] as string[],
      gray: [] as string[],
      red: [] as string[],
      pink: [] as string[],
      grape: [] as string[],
      violet: [] as string[],
      indigo: [] as string[],
      blue: [] as string[],
      cyan: [] as string[],
      teal: [] as string[],
      green: [] as string[],
      lime: [] as string[],
      yellow: [] as string[],
      orange: [] as string[],
      primary: [] as string[],
      success: [] as string[],
      info: [] as string[],
      warning: [] as string[],
      danger: [] as string[],
    }

    Object.keys(themeColors).map((tKey: string) => {
      const themeColorKey = tKey as keyof typeof themeColors
      Object.keys(colors).map((cKey: string) => {
        const colorKey = cKey as keyof typeof colors
        if (themeColorKey.indexOf(colorKey) !== -1) {
          if (!colors[colorKey].length)
            colors[colorKey].push(themeColors[themeColorKey])
          colors[colorKey].push(themeColors[themeColorKey])
        }
      })
    })

    return colors as any
  }
}