import "@mantine/core/styles.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { LoadingProvider } from "@/providers/LoadingProvider";
import { theme } from "@/utils/themeUtils";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      {/* <SpeedInsights /> */}
      <LoadingProvider>
        <Component {...pageProps} />
      </LoadingProvider>
    </MantineProvider>
  );
}
