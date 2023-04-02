import * as styled from "styled-components"

const GlobalStyles = styled.createGlobalStyle`
  @font-face {
    font-family: "Lato-Regular";
    src: url("/fonts/Lato-Regular.ttf") format("truetype")
      url("/fonts/Lato-Bold.ttf") format("truetype");
  }

  @font-face {
    font-family: "Lato-Thin";
    src: url("/fonts/Lato-Thin.ttf") format("truetype");
  }

  @font-face {
    font-family: "Lato-Black";
    src: url("/fonts/Lato-Black.ttf") format("truetype");
  }

  @font-face {
    font-family: "Lato-Light";
    src: url("/fonts/Lato-Light.ttf") format("truetype");
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: "Lato-Regular", sans-serif;
    margin: 0 auto !important;
  }

  @media print {
    background-color: rgb(255, 255, 255);
  }

  p {
    margin: 0;
  }
`

export default GlobalStyles
