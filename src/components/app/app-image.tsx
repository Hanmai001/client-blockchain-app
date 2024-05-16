import { CSSProperties, Image, ImageProps } from "@mantine/core";
import { FC } from "react";

interface AppImageProps extends ImageProps {
  src: string,
  alt?: string,
  style?: CSSProperties,
  className?: any
}
export const AppImage: FC<AppImageProps> = (props) => {
  return <>
    {function () {
      return <Image
        alt={props.alt}
        src={props.src}
        style={{
          ...props.style
        }}
        className={props.className}
      ></Image>
    }()}
  </>
}