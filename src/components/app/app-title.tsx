import { PUBLIC_URL } from "@/modules/configs/context";
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
    webURL: `${PUBLIC_URL}${router.asPath}`,
    thumbnailURL: props.thumbnailURL || `${PUBLIC_URL}/images/thumbnail.jpg`,
    siteName: props.siteName || 'BlockClip',
    type: props.type || 'website',
  }

  return (
    <Head>
      <title>{configs.title}</title>

      <link rel='canonical' href={configs.webURL} />
      {/* <meta name='description' content={configs.description} /> */}

      {/* Facebook */}
      <meta property='og:title' content={configs.title} />
      <meta property='og:image' content={configs.thumbnailURL} />
      <meta property='og:image:url' content={configs.thumbnailURL} />
      <meta property='og:url' content={configs.webURL} />
      <meta property='og:site_name' content={configs.siteName} />
      <meta property='og:type' content={configs.type} />
    </Head>
  )
}