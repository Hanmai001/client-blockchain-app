import { FC, useState } from "react";
import { DataLoadState } from "../../../types";
import { CSSProperties, ImageProps, Skeleton } from "@mantine/core";
import { ClassNames } from "@/share/utils";

interface AppImageProps extends ImageProps {
  src: string,
  alt?: string,
  style?: CSSProperties,
  className?: any
}
export const AppImage: FC<AppImageProps> = (props) => {
  return <>
    {function() {
      return <img
        alt={props.alt}
        src={props.src}
        style={{
          ...props.style
        }}
        className={props.className}
      ></img>
    }()}
  </>
}