import { getConfig } from "@/modules/configs/context";
import { StringUtils } from "@/share/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC } from "react";

interface AppTitleProps {
  title?: string
  thumbnailURL?: string
  siteName?: string
  type?: string
}

export const AppTitle: FC<AppTitleProps> = (props) => {
  const router = useRouter();

  const configs = {
    title: props.title ? `${props.title}` : 'BlockClip',
    webURL: `${getConfig("PUBLIC_URL")}${router.asPath}`,
    thumbnailURL: props.thumbnailURL || `${getConfig("PUBLIC_URL")}/images/thumbnail.png`,
    siteName: props.siteName || 'BlockClip',
    type: props.type || 'website',
  }

  return (
    <Head>
      <title>{configs.title}</title>
      <link rel="icon" type="image/x-icon" href={configs.thumbnailURL} />
      <link rel='canonical' href={configs.webURL} />
      {/* <meta name='description' content={configs.description} /> */}
      <meta property='og:title' content={configs.title} />
      <meta property="og:image" content={configs.thumbnailURL} />
      <meta property="og:image:url" content={configs.thumbnailURL} />
      <meta property='og:url' content={configs.webURL} />
      <meta property='og:site_name' content={configs.siteName} />
      <meta property='og:type' content={configs.type} />
    </Head>
  )
}