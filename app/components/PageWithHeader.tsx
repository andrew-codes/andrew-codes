import styled from "styled-components"
import Paper from "./Paper"
import { Header } from "./Category"

const PageWithHeader = styled(Paper)`
  border: none;
  padding: 0;

  ${Header} {
    padding: 1.5rem;
    position: relative;
    border-radius: 1rem 1rem 0 0;

    h1 {
      font-variant: small-caps;
      margin: 0;
      padding: 0;
    }
  }
`

export default PageWithHeader
