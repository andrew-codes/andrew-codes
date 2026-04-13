import styled from "@emotion/styled"
import { Link as RemixLink } from "react-router"

const StyledLink = styled(RemixLink)`
  text-decoration: underline !important;

  @media print {
    text-decoration: none !important;
  }
`

export default StyledLink
