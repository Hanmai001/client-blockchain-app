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
  const [loadImageState, setLoadImageState] = useState<DataLoadState>({ isFetching: true, error: '' });

  return <>
    {function() {
      //if (loadImageState.isFetching) return <Skeleton width="100%" height="100%" />

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