import { css, Global } from "@emotion/react"

const globalStyles = css`
  /* lato-latin-400-normal */
  @font-face {
    font-family: "Lato";
    font-style: normal;
    font-display: block;
    font-weight: 400;
    src:
      url(@fontsource/lato/files/lato-latin-400-normal.woff2) format("woff2"),
      url(@fontsource/lato/files/lato-latin-400-normal.woff) format("woff");
    unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
      U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
      U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: "Lato-Bold";
    font-style: normal;
    font-display: block;
    font-weight: 900;
    src:
      url(@fontsource/lato/files/lato-latin-900-normal.woff2) format("woff2"),
      url(@fontsource/lato/files/lato-latin-900-normal.woff) format("woff");
    unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
      U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
      U+2212, U+2215, U+FEFF, U+FFFD;
  }

  * {
    box-sizing: border-box;
    font-family: "Lato", sans-serif;
  }

  body {
    margin: 0 !important;
    font-size: 16px;
  }

  @media print {
    background-color: rgb(255, 255, 255);
  }

  p {
    margin: 0;
  }
`

const GlobalStyles = () => <Global styles={globalStyles} />

export default GlobalStyles
