import styled from "@emotion/styled"
import Paper from "./Paper"

const PageWithHeader = styled(Paper)`
  border: none;
  padding: 0;

  header {
    padding: 1.5rem;
    position: relative;
    border-radius: 1rem 1rem 0 0;

    h1 {
      font-variant: small-caps;
      margin: 0;
      padding: 0;
    }
  }

  header + *:last-child {
    padding-bottom: 0;
  }
`

export default PageWithHeader
