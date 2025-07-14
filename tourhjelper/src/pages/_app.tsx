import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { theme } from "@/utils/themeUtils";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <SpeedInsights />
      <Head>
        <title>Tourhjelper</title>
        <meta name="description" content="Tourmanager helper app" />
      </Head>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
