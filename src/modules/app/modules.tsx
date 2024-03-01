import { notifications, showNotification } from '@mantine/notifications';
import themeColors from './theme-colors.json';
import { IconBellRinging2, IconCheck } from '@tabler/icons-react';
// import { OnModalError } from '@/modals/modal-error';

export class AppModule {
  static onInfo = (msg: string) => {
    return showNotification({
      title: 'Information',
      message: msg,
      color: 'info',
      icon: <IconBellRinging2 />,
    });
  }

  static onError = (error: any) => OnModalError({ error: error })

  static onSuccess = (msg: string) => {
    return showNotification({
      title: 'Successful!',
      message: msg,
      color: 'success',
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

function OnModalError(arg0: { error: any; }) {
  throw new Error('Function not implemented.');
}
