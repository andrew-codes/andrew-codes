import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-display:swap;
    font-family: "Lato-Regular";
    src: url("/fonts/Lato-Regular.ttf") format("truetype");
  }

  @font-face {
    font-display:swap;
    font-family: "Lato-Bold";
    src: url("/fonts/Lato-Bold.ttf") format("truetype");
  }

  @font-face {
    font-display:swap;
    font-family: "Lato-Thin";
    src: url("/fonts/Lato-Thin.ttf") format("truetype");
  }

  @font-face {
    font-display:swap;
    font-family: "Lato-Black";
    src: url("/fonts/Lato-Black.ttf") format("truetype");
  }

  @font-face {
    font-display:swap;
    font-family: "Lato-Light";
    src: url("/fonts/Lato-Light.ttf") format("truetype");
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
