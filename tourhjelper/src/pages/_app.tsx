import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { theme } from "@/utils/themeUtils";
import UpdatingPage from "./updating";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App({ Component, pageProps }: AppProps) {
  const isUpdating = process.env.NEXT_PUBLIC_UPDATING === "true";

  return (
    <MantineProvider theme={theme}>
      <SpeedInsights />
      <Head>
        {/* Standard SEO */}
        <title>Tourhjelper - Optimaliser ditt TV 2 Tourmanager-lag</title>
        <meta
          name="description"
          content="Verktøyet som hjelper deg å velge riktige ryttere og knuse vennegjengen i TV 2 Tourmanager."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook / Discord / Slack */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tourhjelper.no" />
        <meta
          property="og:title"
          content="Tourhjelper - TV 2 Tourmanager Tips"
        />
        <meta
          property="og:description"
          content="Verktøyet som hjelper deg å velge riktige ryttere og knuse vennegjengen i TV 2 Tourmanager."
        />
        {/* Hvis du har en logo/skjermbilde i public-mappen din, f.eks. public/og-image.png */}
        <meta
          property="og:image"
          content="https://tourhjelper.no/og-image.png"
        />

        {/* Twitter / X */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://tourhjelper.no" />
        <meta
          property="twitter:title"
          content="Tourhjelper - TV 2 Tourmanager Tips"
        />
        <meta
          property="twitter:description"
          content="Verktøyet som hjelper deg å velge riktige ryttere og knuse vennegjengen i TV 2 Tourmanager."
        />
        <meta
          property="twitter:image"
          content="https://tourhjelper.no/og-image.png"
        />
      </Head>
      {isUpdating ? <UpdatingPage /> : <Component {...pageProps} />}
    </MantineProvider>
  );
}
