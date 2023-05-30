import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle<{ prefix: string }>`
  @font-face {
    font-display:swap;
    font-family: "Lato-Regular";
    src: ${({ prefix }) =>
      `url("${prefix}/fonts/Lato-Regular.ttf") format("truetype");`}
  }

  @font-face {
    font-display:swap;
    font-family: "Lato-Bold";
    src: ${({ prefix }) =>
      `url("${prefix}/fonts/Lato-Bold.ttf") format("truetype");`}
  }

  @font-face {
    font-display:swap;
    font-family: "Lato-Thin";src: ${({ prefix }) =>
      `url("${prefix}/fonts/Lato-Thin.ttf") format("truetype");`}
  }

  @font-face {
    font-display:swap;
    font-family: "Lato-Black";src: ${({ prefix }) =>
      `url("${prefix}/fonts/Lato-Black.ttf") format("truetype");`}
  }

  @font-face {
    font-display:swap;
    font-family: "Lato-Light";src: ${({ prefix }) =>
      `url("${prefix}/fonts/Lato-Light.ttf") format("truetype");`}
  }

  * {
    box-sizing: border-box;
    font-family: "Lato-Regular", sans-serif;
  }

  body {
    margin: 0 !important;
    background: rgb(34,35,39);
    font-size: 16px;
  }

  @media print {
    background-color: rgb(255, 255, 255);
  }

  p {
    margin: 0;
  }
`

export default GlobalStyles
