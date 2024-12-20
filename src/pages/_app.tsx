import "@/styles/app.css";
import "@/styles/normalize.css";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";

import OnchainProviders from '@/component/OnchainProviders'

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function ExampleApp({
  Component,
  pageProps,
}: AppProps): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <OnchainProviders>
        <CssBaseline />
        <Component {...pageProps} />
      </OnchainProviders>
    </ThemeProvider>
  );
}
