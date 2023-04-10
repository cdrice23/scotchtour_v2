import React from "react";
import { RecoilRoot } from "recoil";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../styles/theme";
import { StyledEngineProvider } from "@mui/material";
// tested from MUI/next.js tutorial
import PropTypes from "prop-types";
import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../styles/createEmotionCache";

import { surveyResultsState, whiskyListState } from "../components/atoms";

// tested from MUI/next.js tutorial
const clientSideEmotionCache = createEmotionCache();

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
  initialRecoilState = {
    whiskyList: {},
    surveyResultsData: {},
  },
}) {
  const all_atoms = {
    whiskyList: whiskyListState,
    surveyResultsData: surveyResultsState,
  };
  const initializeRecoilState =
    (initialRecoilState) =>
    ({ set }) =>
      Object.keys(initialRecoilState).map((key) => {
        const value = initialRecoilState[key];
        const atom = all_atoms[key];
        set(atom, value);
      });
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CacheProvider value={emotionCache}>
        <StyledEngineProvider injectFirst>
          {/* cacheprovider and head tested from MUI/next.js tutorial */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RecoilRoot
              initializeState={initializeRecoilState(initialRecoilState)}
            >
              <Component {...pageProps} />
            </RecoilRoot>
          </ThemeProvider>
        </StyledEngineProvider>
      </CacheProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
